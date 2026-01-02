/**
 * Smoke Script: Auth Verification (NOT for CI)
 * 
 * Verifies that the GoogleWorkspaceAdapter can resolve credentials from ENV.
 * Run with: npx tsx packages/adapters/google-workspace/scripts/smoke-auth.ts
 */
import { GoogleWorkspaceAdapter } from "../src/GoogleWorkspaceAdapter";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env from root if exists
dotenv.config({ path: path.join(__dirname, "../../../../.env") });

async function smoke() {
    console.log("🧪 Running Google Workspace Auth Smoke Test...");

    const adapter = new GoogleWorkspaceAdapter();

    try {
        console.log("🔍 Testing connection_ref: 'google:dev'...");
        // This will attempt to authenticate and list (real call)
        // We only verify that the client can be instantiated and the list call attempted
        await adapter.ingest({
            connection_ref: "google:dev",
            signal_classes: ["email"]
        });
        console.log("✅ Credentials resolved and client instantiated.");
    } catch (error: any) {
        if (error.message.includes("Failed to resolve credentials")) {
            console.error("❌ Auth Resolution Failed: Check your environment variables.");
        } else {
            // If it resolved but the actual API call fails (e.g. invalid tokens), that's also an indicator
            console.log("⚠️ Auth resolved but API call failed (expected if tokens are invalid):", error.message);
        }
    }
}

smoke();
