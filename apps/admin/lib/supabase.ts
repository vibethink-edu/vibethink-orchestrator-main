import "server-only"; // 🛡️ CRITICAL: Prevent usage in Client Components
import { createClient } from "@supabase/supabase-js";

// SINGLETON for Server-Side Admin Operations
// This uses the SERVICE_ROLE_KEY to bypass RLS when needed (e.g. looking up global user roles)
// BE CAREFUL using this client. Only for authorized Admin Service operations.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    // Graceful handling for build time or dev setup missing envs
    if (process.env.NODE_ENV !== 'test') {
        console.warn("WARN: Supabase credentials missing in Admin App environment");
    }
}

// Admin-privileged client (Bypasses RLS)
export const adminDb = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseServiceKey || "placeholder", {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
    },
});
