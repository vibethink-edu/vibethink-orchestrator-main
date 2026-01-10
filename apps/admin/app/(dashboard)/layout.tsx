import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    ShieldAlert,
    Activity,
    LogOut
} from "lucide-react"; // Asumiendo lucide-react (standard shadcn)

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-zinc-950">
            {/* SIDEBAR */}
            <aside className="w-64 border-r border-zinc-800 flex flex-col fixed top-0 bottom-0 left-0 bg-zinc-950 z-50">
                <div className="p-6 border-b border-zinc-800">
                    <div className="flex items-center gap-2 font-bold text-white tracking-wider">
                        <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
                        ViTo NEXUS
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">
                        Control Plane
                    </div>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-1">
                    <NavLink href="/tenants" icon={<LayoutDashboard size={18} />} label="Tenants" active />
                    <NavLink href="/users" icon={<Users size={18} />} label="Identity Search" />
                    <NavLink href="/audit" icon={<ShieldAlert size={18} />} label="Audit Log" />
                    <div className="h-px bg-zinc-800 my-4 mx-2"></div>
                    <NavLink href="/status" icon={<Activity size={18} />} label="Platform Health" />
                </nav>

                <div className="p-4 border-t border-zinc-800 mt-auto">
                    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-900 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-500">
                            AD
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-sm font-medium text-white truncate">Admin User</div>
                            <div className="text-xs text-yellow-500 font-mono">SUPER_ADMIN</div>
                        </div>
                        <LogOut size={16} className="text-zinc-500" />
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-64 bg-zinc-950 text-foreground">
                {children}
            </main>
        </div>
    );
}

function NavLink({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${active ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}`}
        >
            {icon}
            {label}
        </Link>
    )
}
