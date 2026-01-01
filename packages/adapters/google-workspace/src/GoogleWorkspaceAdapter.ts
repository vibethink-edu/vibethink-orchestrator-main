import {
    SignalAdapter,
    IngestResult,
    SignalClass,
    SignalEvent,
    NormalizedAdapterError
} from "@vibethink/core";

// Use import type to ensure the library isn't resolved at runtime 
// until we explicitly call the dynamic import().
import type { gmail_v1 } from "googleapis";

export class GoogleWorkspaceAdapter implements SignalAdapter {
    readonly adapter_id = "google-workspace";
    readonly adapter_version = "0.1.0";

    /**
     * Public Contract Implementation
     * Strictly follows SignalAdapter.ingest()
     */
    async ingest(input: {
        connection_ref: string;
        since?: string; // ISO
        until?: string; // ISO
        signal_classes: SignalClass[];
    }): Promise<IngestResult> {
        const events: SignalEvent[] = [];
        const errors: NormalizedAdapterError[] = [];

        if (input.signal_classes.includes("email")) {
            if (input.connection_ref === "fixture") {
                events.push(this.getFixtureEvent());
            } else {
                try {
                    const gmail = await this.getGmailClient(input.connection_ref);

                    // 1. List messages within time range (MVP: limit 50)
                    const listResponse = await gmail.users.messages.list({
                        userId: "me",
                        maxResults: 50,
                        q: this.buildQuery(input.since, input.until)
                    });

                    const messages = listResponse.data.messages || [];

                    // 2. Fetch full detail for each message and normalize
                    for (const msgRef of messages) {
                        if (!msgRef.id) continue;

                        try {
                            const msgResponse = await gmail.users.messages.get({
                                userId: "me",
                                id: msgRef.id,
                                format: "full"
                            });

                            const event = this.normalizeMessage(msgResponse.data);
                            if (event) {
                                events.push(event);
                            }
                        } catch (error) {
                            // Sanitize: Do not leak raw error.message to the domain
                            console.error(`Fetch failure for ${msgRef.id}:`, error);
                            errors.push({
                                code: "UNKNOWN",
                                message: `Failed to ingest message signal from source.`,
                                retryable: true
                            });
                        }
                    }
                } catch (error) {
                    // Sanitize: Generic safe message
                    console.error("List failure:", error);
                    errors.push({
                        code: "UNKNOWN",
                        message: `Failed to list signals from vendor.`,
                        retryable: true
                    });
                }
            }
        }

        return {
            events,
            errors: errors.length > 0 ? errors : undefined
        };
    }

    private async getGmailClient(connectionRef: string): Promise<gmail_v1.Gmail> {
        // Lazy-load the vendor library ONLY when real ingestion is needed.
        const { google } = await import("googleapis");

        if (connectionRef === "fixture") {
            return google.gmail({ version: "v1" });
        }

        // Real credentials wiring is scheduled for Phase 3A.
        // Phase 2 only supports "fixture" mode for architectural verification.
        throw new Error(`[GoogleWorkspaceAdapter] Real connection refs (e.g., "${connectionRef}") are not supported in Phase 2. Please use "fixture" mode.`);
    }

    private buildQuery(since?: string, until?: string): string {
        const parts: string[] = [];
        if (since) {
            const seconds = Math.floor(new Date(since).getTime() / 1000);
            parts.push(`after:${seconds}`);
        }
        if (until) {
            const seconds = Math.floor(new Date(until).getTime() / 1000);
            parts.push(`before:${seconds}`);
        }
        return parts.join(" ");
    }

    private normalizeMessage(msg: gmail_v1.Schema$Message): SignalEvent | null {
        if (!msg.id) return null;

        const headers = msg.payload?.headers || [];
        const getHeader = (name: string) => headers.find(h => h.name?.toLowerCase() === name.toLowerCase())?.value || "";

        const subject = getHeader("subject");
        const from = getHeader("from");
        const to = getHeader("to").split(",").map(s => s.trim()).filter(Boolean);
        const cc = getHeader("cc").split(",").map(s => s.trim()).filter(Boolean);
        const bcc = getHeader("bcc").split(",").map(s => s.trim()).filter(Boolean);

        const idempotencyKey = `${this.adapter_id}:${msg.id}:email`;

        return {
            event_type: "enterprise_signal.ingested",
            signal: {
                signal_class: "email",
                subject,
                from,
                to,
                cc: cc.length > 0 ? cc : undefined,
                bcc: bcc.length > 0 ? bcc : undefined,
                date: msg.internalDate ? new Date(parseInt(msg.internalDate)).toISOString() : new Date().toISOString(),
                excerpt: msg.snippet || ""
            },
            provenance: {
                adapter_id: this.adapter_id,
                adapter_version: this.adapter_version,
                source_ref: msg.id,
                received_at: new Date().toISOString(),
                idempotency_key: idempotencyKey
            }
        };
    }

    private getFixtureEvent(): SignalEvent {
        const mockMsgId = "msg_fixture_001";
        const idempotencyKey = `${this.adapter_id}:${mockMsgId}:email`;

        return {
            event_type: "enterprise_signal.ingested",
            signal: {
                signal_class: "email",
                subject: "VibeThink Phase 2 Verification",
                from: "architect@vibethink.edu",
                to: ["user@vibethink.edu"],
                cc: ["boss@vibethink.edu"],
                date: new Date().toISOString(),
                excerpt: "This is a sample normalized event from the real adapter logic (via fixture)."
            },
            provenance: {
                adapter_id: this.adapter_id,
                adapter_version: this.adapter_version,
                source_ref: mockMsgId,
                received_at: new Date().toISOString(),
                idempotency_key: idempotencyKey
            }
        };
    }
}
