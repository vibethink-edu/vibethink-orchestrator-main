import type { Auth } from "googleapis";

export interface CredentialResolver {
    resolve(connectionRef: string): Promise<Auth.OAuth2Client | null>;
}

/**
 * Resolves credentials from environment variables for local development.
 * 
 * Expected variables:
 * - GOOGLE_OAUTH_CLIENT_ID
 * - GOOGLE_OAUTH_CLIENT_SECRET
 * - GOOGLE_OAUTH_REFRESH_TOKEN
 */
export class EnvCredentialResolver implements CredentialResolver {
    async resolve(connectionRef: string): Promise<Auth.OAuth2Client | null> {
        // Only resolve if the connection_ref is the expected developer profile
        if (connectionRef !== "google:dev") {
            return null;
        }

        const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
        const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

        if (!clientId || !clientSecret || !refreshToken) {
            console.warn(`[GoogleWorkspaceAdapter] connection_ref 'google:dev' requires GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, and GOOGLE_OAUTH_REFRESH_TOKEN in environment.`);
            return null;
        }

        // We need to dynamic import googleapis here to avoid top-level resolution
        const { google } = await import("googleapis");
        const oauth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret
        );

        oauth2Client.setCredentials({
            refresh_token: refreshToken
        });

        return oauth2Client;
    }
}
