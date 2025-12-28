// ✅ SOLUCIÓN CORRECTA para Logo Colapsado en dashboard-vibethink
// Basada en cómo funciona en dashboard-bundui, pero adaptada para Link

<SidebarMenuButton 
  size="lg" 
  asChild  // ← CRÍTICO: Debe estar para evitar error React children
  className="hover:text-foreground hover:bg-[var(--primary)]/5"
>
  <Link 
    href={isVibeThinkRoute ? "/dashboard-vibethink" : "/dashboard-bundui"} 
    className="flex items-center gap-2"
  >
    <Logo />
    <span className="font-semibold group-data-[collapsible=icon]:hidden">
      VibeThink
    </span>
    <span className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
      {sectionTitle}
    </span>
  </Link>
</SidebarMenuButton>

// Explicación:
// 1. asChild es CRÍTICO: Permite que Radix UI use el Link como el botón real
// 2. group-data-[collapsible=icon]:hidden oculta el texto cuando el sidebar está colapsado
// 3. El Logo se muestra siempre (no necesita lógica condicional)
// 4. Link dinámico mantiene flexibilidad entre rutas











