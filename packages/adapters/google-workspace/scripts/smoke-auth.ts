import { GoogleWorkspaceAdapter } from "../src/GoogleWorkspaceAdapter";
import * as dotenv from "dotenv";
import * as path from "path";

// Load root .env
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

async function smokeTest() {
    console.log("🧪 Starting Smoke Test: Google Workspace Auth Activation");

    const adapter = new GoogleWorkspaceAdapter();

    try {
        console.log("🔍 Attempting ingestion with 'google:dev'...");
        const result = await adapter.ingest({
            connection_ref: "google:dev",
            signal_classes: ["email"]
        });

        if (result.errors) {
            console.error("❌ Ingestion yielded errors:", JSON.stringify(result.errors, null, 2));
        } else {
            console.log("✅ Ingestion successful!");
            console.log(`📡 Signals received: ${result.events.length}`);
            if (result.events.length > 0) {
                console.log("📄 First Signal Subject:", (result.events[0].signal as any).subject);
            }
        }
    } catch (error) {
        console.error("💥 Fatal Error during smoke test:", error);
    }
}

smokeTest();
