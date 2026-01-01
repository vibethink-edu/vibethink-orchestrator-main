import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

/**
 * Resolver for Google Workspace Credentials
 */
export interface CredentialResolver {
    resolve(connectionRef: string): Promise<OAuth2Client | null>;
}

/**
 * Resolves credentials from environment variables for local/node execution.
 * Expected vars:
 * - GOOGLE_OAUTH_CLIENT_ID
 * - GOOGLE_OAUTH_CLIENT_SECRET
 * - GOOGLE_OAUTH_REFRESH_TOKEN
 */
export class EnvCredentialResolver implements CredentialResolver {
    async resolve(connectionRef: string): Promise<OAuth2Client | null> {
        // MVP: Strictly maps "google:dev" or similar to local env vars
        const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
        const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

        if (!clientId || !clientSecret || !refreshToken) {
            console.error(`[EnvCredentialResolver] Missing mandatory environment variables for ${connectionRef}`);
            return null;
        }

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
