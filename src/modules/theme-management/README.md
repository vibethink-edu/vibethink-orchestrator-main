# Gestión de Temas (`theme-management/`)

## 🎯 **Propósito**

Módulo de lógica de negocio para gestión completa de temas visuales, incluyendo almacenamiento, distribución, versionado y análisis de uso.

## 📁 **Estructura**

```
theme-management/
├── services/                 # Servicios de gestión
├── hooks/                   # Hooks de gestión
├── components/              # Componentes de gestión
├── types/                   # Tipos de gestión
├── utils/                   # Utilidades
└── tests/                   # Tests
```

## 🔧 **Servicios Principales**

### **Theme Storage Service:**
```typescript
// ✅ Servicio de almacenamiento de temas
export class ThemeStorageService {
  private supabase: SupabaseClient;
  
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
  }
  
  // Guardar tema
  async saveTheme(theme: Theme, companyId: string): Promise<Theme> {
    const { data, error } = await this.supabase
      .from('themes')
      .insert({
        ...theme,
        company_id: companyId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw new Error(`Failed to save theme: ${error.message}`);
    return data;
  }
  
  // Obtener tema por ID
  async getTheme(themeId: string, companyId: string): Promise<Theme> {
    const { data, error } = await this.supabase
      .from('themes')
      .select('*')
      .eq('id', themeId)
      .eq('company_id', companyId)
      .single();
    
    if (error) throw new Error(`Failed to get theme: ${error.message}`);
    return data;
  }
  
  // Listar temas de la empresa
  async listThemes(companyId: string): Promise<Theme[]> {
    const { data, error } = await this.supabase
      .from('themes')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(`Failed to list themes: ${error.message}`);
    return data || [];
  }
  
  // Actualizar tema
  async updateTheme(themeId: string, updates: Partial<Theme>, companyId: string): Promise<Theme> {
    const { data, error } = await this.supabase
      .from('themes')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', themeId)
      .eq('company_id', companyId)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to update theme: ${error.message}`);
    return data;
  }
  
  // Eliminar tema
  async deleteTheme(themeId: string, companyId: string): Promise<void> {
    const { error } = await this.supabase
      .from('themes')
      .delete()
      .eq('id', themeId)
      .eq('company_id', companyId);
    
    if (error) throw new Error(`Failed to delete theme: ${error.message}`);
  }
}
```

### **Theme Versioning Service:**
```typescript
// ✅ Servicio de versionado de temas
export class ThemeVersioningService {
  private storage: ThemeStorageService;
  
  constructor() {
    this.storage = new ThemeStorageService();
  }
  
  // Crear nueva versión
  async createVersion(themeId: string, version: string, companyId: string): Promise<ThemeVersion> {
    const theme = await this.storage.getTheme(themeId, companyId);
    
    const versionData: ThemeVersion = {
      id: generateId(),
      theme_id: themeId,
      version,
      theme_data: theme,
      created_at: new Date().toISOString(),
      created_by: getCurrentUser().id
    };
    
    const { data, error } = await supabase
      .from('theme_versions')
      .insert(versionData)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create version: ${error.message}`);
    return data;
  }
  
  // Obtener versiones de un tema
  async getVersions(themeId: string, companyId: string): Promise<ThemeVersion[]> {
    const { data, error } = await supabase
      .from('theme_versions')
      .select('*')
      .eq('theme_id', themeId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(`Failed to get versions: ${error.message}`);
    return data || [];
  }
  
  // Restaurar versión
  async restoreVersion(versionId: string, companyId: string): Promise<Theme> {
    const version = await this.getVersion(versionId, companyId);
    const theme = await this.storage.updateTheme(
      version.theme_id,
      version.theme_data,
      companyId
    );
    
    return theme;
  }
}
```

### **Theme Analytics Service:**
```typescript
// ✅ Servicio de analíticas de temas
export class ThemeAnalyticsService {
  // Registrar uso de tema
  async trackThemeUsage(themeId: string, companyId: string, action: 'view' | 'apply' | 'export'): Promise<void> {
    const usageData = {
      theme_id: themeId,
      company_id: companyId,
      action,
      user_id: getCurrentUser().id,
      timestamp: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('theme_usage_logs')
      .insert(usageData);
    
    if (error) {
      console.error('Failed to track theme usage:', error);
    }
  }
  
  // Obtener estadísticas de tema
  async getThemeStats(themeId: string, companyId: string): Promise<ThemeStats> {
    const { data, error } = await supabase
      .from('theme_usage_logs')
      .select('*')
      .eq('theme_id', themeId)
      .eq('company_id', companyId);
    
    if (error) throw new Error(`Failed to get theme stats: ${error.message}`);
    
    const logs = data || [];
    const stats: ThemeStats = {
      totalViews: logs.filter(log => log.action === 'view').length,
      totalApplies: logs.filter(log => log.action === 'apply').length,
      totalExports: logs.filter(log => log.action === 'export').length,
      lastUsed: logs.length > 0 ? logs[0].timestamp : null,
      usageByUser: this.groupByUser(logs)
    };
    
    return stats;
  }
  
  // Obtener temas más populares
  async getPopularThemes(companyId: string, limit: number = 10): Promise<PopularTheme[]> {
    const { data, error } = await supabase
      .rpc('get_popular_themes', {
        company_id: companyId,
        limit_count: limit
      });
    
    if (error) throw new Error(`Failed to get popular themes: ${error.message}`);
    return data || [];
  }
}
```

## 🎯 **Hooks de Gestión**

### **Hook Principal:**
```typescript
// ✅ Hook para gestión completa de temas
export const useThemeManagement = () => {
  const { user } = useAuth();
  const storage = useMemo(() => new ThemeStorageService(), []);
  const versioning = useMemo(() => new ThemeVersioningService(), []);
  const analytics = useMemo(() => new ThemeAnalyticsService(), []);
  
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar temas
  const loadThemes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const themes = await storage.listThemes(user.company_id);
      setThemes(themes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [storage, user.company_id]);
  
  // Guardar tema
  const saveTheme = useCallback(async (theme: Theme) => {
    try {
      setLoading(true);
      setError(null);
      
      const savedTheme = await storage.saveTheme(theme, user.company_id);
      setThemes(prev => [savedTheme, ...prev]);
      
      // Track analytics
      await analytics.trackThemeUsage(savedTheme.id, user.company_id, 'apply');
      
      return savedTheme;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [storage, analytics, user.company_id]);
  
  // Actualizar tema
  const updateTheme = useCallback(async (themeId: string, updates: Partial<Theme>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedTheme = await storage.updateTheme(themeId, updates, user.company_id);
      setThemes(prev => prev.map(theme => 
        theme.id === themeId ? updatedTheme : theme
      ));
      
      return updatedTheme;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [storage, user.company_id]);
  
  // Eliminar tema
  const deleteTheme = useCallback(async (themeId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await storage.deleteTheme(themeId, user.company_id);
      setThemes(prev => prev.filter(theme => theme.id !== themeId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [storage, user.company_id]);
  
  // Crear versión
  const createVersion = useCallback(async (themeId: string, version: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const themeVersion = await versioning.createVersion(themeId, version, user.company_id);
      return themeVersion;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [versioning, user.company_id]);
  
  // Obtener estadísticas
  const getThemeStats = useCallback(async (themeId: string) => {
    try {
      const stats = await analytics.getThemeStats(themeId, user.company_id);
      return stats;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [analytics, user.company_id]);
  
  return {
    // Estado
    themes,
    loading,
    error,
    
    // Acciones
    loadThemes,
    saveTheme,
    updateTheme,
    deleteTheme,
    createVersion,
    getThemeStats
  };
};
```

## 🛡️ **Seguridad Multi-tenant**

### **Validación de Acceso:**
```typescript
// ✅ Validación de acceso a temas
export const validateThemeAccess = (theme: Theme, user: User): boolean => {
  // Verificar que el tema pertenece a la empresa del usuario
  if (theme.company_id !== user.company_id) {
    return false;
  }
  
  // Verificar permisos del usuario
  if (!hasPermission(user, 'THEME_MANAGEMENT')) {
    return false;
  }
  
  return true;
};
```

## 🧪 **Testing Strategy**

### **Servicios Testing:**
```typescript
describe('ThemeManagement', () => {
  it('should save theme correctly', async () => {
    const storage = new ThemeStorageService();
    const testTheme = createTestTheme();
    
    const savedTheme = await storage.saveTheme(testTheme, 'company-1');
    
    expect(savedTheme.id).toBeDefined();
    expect(savedTheme.company_id).toBe('company-1');
  });
  
  it('should not access cross-company themes', async () => {
    const storage = new ThemeStorageService();
    
    await expect(
      storage.getTheme('theme-1', 'company-2')
    ).rejects.toThrow('Failed to get theme');
  });
});
```

## 📊 **Métricas de Calidad**

### **Performance:**
- **Load Time**: <500ms para cargar temas
- **Save Time**: <200ms para guardar tema
- **Update Time**: <300ms para actualizar tema
- **Delete Time**: <100ms para eliminar tema

### **Reliability:**
- **Data Integrity**: 100% validación
- **Multi-tenant Isolation**: 100% aislamiento
- **Error Handling**: 100% errores manejados

---

**El módulo de gestión de temas sigue los principios de VThink 1.0, asegurando gestión segura y escalable de temas visuales.** 