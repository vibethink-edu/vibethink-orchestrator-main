/**
 * Verify Google Adapter Skeleton
 * 
 * Instantiates the GoogleWorkspaceAdapter and checks:
 * 1. It implements SignalAdapter (structural typing)
 * 2. ingest() returns a valid IngestResult
 * 3. No runtime errors on instantiation
 */

import { GoogleWorkspaceAdapter } from "../packages/adapters/google-workspace/src/GoogleWorkspaceAdapter";
import { SignalAdapter } from "@vibethink/core";

async function verify() {
    console.log("🧪 Verifying GoogleWorkspaceAdapter Skeleton...");

    const adapter = new GoogleWorkspaceAdapter();

    // Static/Runtime Check: Is it a SignalAdapter?
    const _isAdapter: SignalAdapter = adapter; // TypeScript check at compile time (if this file was TS)

    if (adapter.adapter_id !== "google-workspace") {
        throw new Error(`❌ Wrong adapter_id: ${adapter.adapter_id}`);
    }

    console.log("✅ Adapter Identity Verified");

    // Method Check
    if (typeof adapter.ingest !== "function") {
        throw new Error("❌ Missing ingest() method");
    }

    // Execution Check (Fixture)
    const result = await adapter.ingest({
        connection_ref: "fixture",
        signal_classes: ["email"]
    });

    if (!result || !Array.isArray(result.events)) {
        throw new Error("❌ ingest() did not return valid IngestResult");
    }

    console.log("✅ ingest() contract satisfied (Stub)");
    console.log("🟢 Skeleton Verification Passed");
}

verify().catch(e => {
    console.error(e);
    process.exit(1);
});
