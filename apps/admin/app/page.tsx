import { Button } from "@/components/ui/button"; // Placeholder import
import Link from "next/link";

export default function AdminLandingPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-950 text-white gap-4">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">ViTo Nexus</h1>
        <p className="text-zinc-400">Global Operations Console</p>
      </div>

      <div className="p-8 border border-zinc-800 rounded-lg bg-zinc-900/50 backdrop-blur max-w-sm w-full">
        <div className="flex flex-col gap-4">
          <div className="text-sm text-yellow-500 font-mono bg-yellow-900/20 p-2 rounded border border-yellow-900/50">
            ⚠️ RESTRICTED ACCESS<br />
            Authorized Personnel Only
          </div>

          <p className="text-xs text-zinc-500">
            Audit logging is active. All effective actions are recorded.
          </p>

          <Link href="/login" className="w-full">
            {/* Using a simple button style div since we might miss the Button component in this app scope */}
            <div className="w-full bg-white text-black hover:bg-zinc-200 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              Staff Login
            </div>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-4 text-[10px] text-zinc-700 font-mono">
        System v1.0.0 • Enforcement: STRICT
      </div>
    </div>
  );
}