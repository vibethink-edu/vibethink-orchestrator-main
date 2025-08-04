# 📁 File Manager - Monorepo Integration Strategy

> **Status:** ✅ **READY** - Currently working with complete mock data  
> **Integration:** 🔄 **PLANNED** - Full monorepo integration documented

## 🎯 **Current Implementation Status**

### **✅ COMPLETED - Mock Data System**
- **Complete file management** with realistic mock data
- **Multi-tenant security patterns** preserved for future integration
- **Storage analytics** with charts and metrics
- **File operations** with proper error handling
- **Responsive design** with BunduiCompleteLayout
- **Real-time updates** simulation with loading states

### **📍 Location:** `apps/dashboard/app/file-manager/`

## 🗂️ **Current Architecture (Mock Mode)**

### **Core Components Structure**
```
apps/dashboard/app/file-manager/
├── page.tsx                     ✅ Main dashboard with BunduiCompleteLayout
├── components/                  ✅ All UI components working
│   ├── SummaryCards.tsx         ✅ Storage metrics summary
│   ├── FolderListCards.tsx      ✅ Folder management UI
│   ├── StorageStatusCard.tsx    ✅ Storage usage visualization
│   ├── ChartFileTransfer.tsx    ✅ Transfer analytics chart
│   ├── TableRecentFiles.tsx     ✅ Recent files table
│   └── FileUploadDialog.tsx     ✅ Upload interface
├── hooks/                       ✅ Data management hooks
│   ├── useFileManagerData.ts    ✅ Main data hook (FIXED infinite loop)
│   ├── useFileManagerFilters.ts ✅ Filtering logic
│   └── useFileOperations.ts     ✅ File operation handlers
└── types/                       ✅ TypeScript definitions
    └── index.ts                 ✅ Complete type system
```

### **Mock Data Features**
```typescript
// ✅ Complete mock data includes:
- File items with metadata (name, size, type, dates, permissions)
- Folder hierarchy with file counts and sizes
- Storage metrics (total, used, available, breakdown by type)
- Transfer metrics (uploads, downloads, trends)
- Recent activity logs
- User permissions and multi-tenant data
```

## 🔄 **Monorepo Integration Strategy**

### **Phase 1: Centralized Storage Service**
When ready to integrate with the monorepo:

#### **1.1 Create Shared Storage Service**
```
src/shared/services/storage/
├── StorageService.ts           # Central storage abstraction
├── providers/                  # Storage provider implementations
│   ├── SupabaseStorageProvider.ts
│   ├── AWSStorageProvider.ts
│   └── FileSystemProvider.ts
├── types/                      # Storage type definitions
└── utils/                      # Storage utilities
```

#### **1.2 Storage Service Interface**
```typescript
// src/shared/services/storage/StorageService.ts
export interface StorageService {
  // File operations
  uploadFile(file: File, path: string, metadata?: FileMetadata): Promise<UploadResult>
  downloadFile(fileId: string): Promise<Blob>
  deleteFile(fileId: string): Promise<void>
  moveFile(fileId: string, newPath: string): Promise<void>
  
  // Folder operations
  createFolder(name: string, parentId?: string): Promise<FolderResult>
  deleteFolder(folderId: string): Promise<void>
  listFolder(folderId: string): Promise<FolderContents>
  
  // Metadata operations
  getFileMetadata(fileId: string): Promise<FileMetadata>
  updateFileMetadata(fileId: string, metadata: Partial<FileMetadata>): Promise<void>
  
  // Search and filtering
  searchFiles(query: SearchQuery): Promise<SearchResult[]>
  getFilesByTag(tags: string[]): Promise<FileItem[]>
  
  // Analytics
  getStorageMetrics(companyId: string): Promise<StorageMetrics>
  getTransferMetrics(companyId: string): Promise<TransferMetrics>
}
```

### **Phase 2: Database Schema Integration**

#### **2.1 Supabase Tables (Already Prepared)**
```sql
-- Files table with multi-tenant security
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  user_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  path TEXT NOT NULL,
  size BIGINT NOT NULL,
  mime_type VARCHAR(100),
  parent_id UUID REFERENCES folders(id),
  storage_provider VARCHAR(50) DEFAULT 'supabase',
  storage_path TEXT NOT NULL,
  is_shared BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  tags TEXT[],
  version INTEGER DEFAULT 1,
  download_count INTEGER DEFAULT 0,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Folders table
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  user_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES folders(id),
  path TEXT NOT NULL,
  color VARCHAR(7) DEFAULT '#3B82F6',
  icon VARCHAR(50) DEFAULT 'folder',
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File permissions for sharing
CREATE TABLE file_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  role_id UUID REFERENCES roles(id),
  permission_type VARCHAR(20) CHECK (permission_type IN ('read', 'write', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Storage metrics for analytics
CREATE TABLE storage_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  total_storage BIGINT NOT NULL,
  used_storage BIGINT NOT NULL,
  file_count INTEGER NOT NULL,
  folder_count INTEGER NOT NULL,
  recent_uploads INTEGER DEFAULT 0,
  shared_files INTEGER DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **2.2 Row Level Security (RLS) Policies**
```sql
-- Files RLS policy
CREATE POLICY "Users can only access files from their company" ON files
  FOR ALL USING (company_id = auth.jwt() ->> 'company_id');

-- Folders RLS policy  
CREATE POLICY "Users can only access folders from their company" ON folders
  FOR ALL USING (company_id = auth.jwt() ->> 'company_id');

-- File permissions RLS policy
CREATE POLICY "Users can manage permissions for their company files" ON file_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM files 
      WHERE files.id = file_permissions.file_id 
      AND files.company_id = auth.jwt() ->> 'company_id'
    )
  );
```

### **Phase 3: Hook Migration Strategy**

#### **3.1 Update useFileManagerData Hook**
```typescript
// apps/dashboard/app/file-manager/hooks/useFileManagerData.ts

// STEP 1: Uncomment Supabase integration
const { data, error } = await supabase
  .from('files')
  .select(`
    id, name, type, size, modified_at, created_at,
    company_id, user_id, parent_id, path, mime_type,
    is_shared, is_favorite, is_archived, tags,
    version, download_count, thumbnail_url
  `)
  .eq('company_id', user.company_id) // 🔒 CRITICAL: Multi-tenant security
  .eq('is_archived', false)
  .order('modified_at', { ascending: false })
  .limit(100)

// STEP 2: Replace mock data with real data
setFiles(data || [])

// STEP 3: Add error handling
if (error) {
  throw new Error(`Failed to fetch files: ${error.message}`)
}
```

#### **3.2 Integration Checklist**
```typescript
// ✅ READY FOR INTEGRATION:
1. [ ] Enable Supabase queries in hooks (uncomment blocks)
2. [ ] Create database tables with provided schema
3. [ ] Configure Row Level Security policies
4. [ ] Set up storage bucket in Supabase
5. [ ] Update environment variables for storage
6. [ ] Test multi-tenant data isolation
7. [ ] Verify file upload/download functionality
8. [ ] Test permission system
9. [ ] Validate analytics and metrics
10. [ ] Deploy and monitor performance
```

## 🔧 **Shared Services Integration**

### **Centralized File Service Usage**
```typescript
// src/shared/services/FileService.ts
export class FileService {
  constructor(
    private storageProvider: StorageProvider,
    private databaseService: DatabaseService
  ) {}

  async uploadFile(
    file: File, 
    companyId: string, 
    userId: string, 
    options?: UploadOptions
  ): Promise<FileUploadResult> {
    // 1. Upload to storage provider
    const storageResult = await this.storageProvider.upload(file, options.path)
    
    // 2. Save metadata to database with company_id filtering
    const fileRecord = await this.databaseService.createFile({
      company_id: companyId, // 🔒 CRITICAL: Multi-tenant security
      user_id: userId,
      name: file.name,
      size: file.size,
      mime_type: file.type,
      storage_path: storageResult.path,
      parent_id: options.parentId,
      ...options.metadata
    })
    
    return { fileRecord, storageUrl: storageResult.url }
  }
}
```

### **Multi-App Integration**
```typescript
// All apps can use the same file service:

// apps/main-app/components/FileAttachment.tsx
import { useFileService } from '@/shared/services/FileService'

// apps/admin/components/SystemFiles.tsx  
import { useFileService } from '@/shared/services/FileService'

// apps/helpdesk/components/TicketAttachments.tsx
import { useFileService } from '@/shared/services/FileService'
```

## 📊 **Analytics Integration**

### **Cross-App Analytics**
```typescript
// src/shared/analytics/FileAnalytics.ts
export class FileAnalyticsService {
  async getCompanyStorageMetrics(companyId: string): Promise<StorageMetrics> {
    // Aggregate data across all apps
    const metrics = await Promise.all([
      this.getMainAppFiles(companyId),
      this.getHelpdeskFiles(companyId),
      this.getAdminFiles(companyId)
    ])
    
    return this.aggregateMetrics(metrics)
  }
  
  async generateStorageReport(companyId: string): Promise<StorageReport> {
    // Generate comprehensive storage report
    return {
      usage: await this.getUsageMetrics(companyId),
      growth: await this.getGrowthTrends(companyId),
      compliance: await this.getComplianceMetrics(companyId),
      recommendations: await this.getOptimizationSuggestions(companyId)
    }
  }
}
```

## 🔐 **Security Implementation**

### **Multi-Tenant Security Enforcement**
```typescript
// CRITICAL: All file operations MUST filter by company_id
export const secureFileQuery = (companyId: string) => ({
  baseQuery: supabase.from('files').select('*'),
  withSecurity: function() {
    return this.baseQuery.eq('company_id', companyId)
  },
  withArchiveFilter: function() {
    return this.withSecurity().eq('is_archived', false)
  }
})

// Usage:
const files = await secureFileQuery(user.company_id)
  .withArchiveFilter()
  .order('created_at', { ascending: false })
```

### **File Access Control**
```typescript
// Permission checking for file access
export const hasFileAccess = async (
  fileId: string, 
  userId: string, 
  companyId: string,
  permission: 'read' | 'write' | 'admin'
): Promise<boolean> => {
  // Check file ownership and permissions
  const { data: file } = await supabase
    .from('files')
    .select('user_id, company_id')
    .eq('id', fileId)
    .eq('company_id', companyId) // 🔒 CRITICAL: Multi-tenant security
    .single()
    
  if (!file) return false
  if (file.user_id === userId) return true
  
  // Check shared permissions
  const { data: permissions } = await supabase
    .from('file_permissions')
    .select('permission_type')
    .eq('file_id', fileId)
    .eq('user_id', userId)
    
  return permissions?.some(p => p.permission_type === permission) || false
}
```

## 📱 **Cross-Platform Considerations**

### **Responsive File Manager**
- ✅ **Mobile optimized** - Works on all device sizes
- ✅ **Touch friendly** - Proper touch targets and gestures
- ✅ **Progressive enhancement** - Core functionality without JavaScript
- ✅ **Offline capability** - Local caching for recently accessed files

### **Performance Optimization**
```typescript
// Lazy loading for large file lists
const useLazyFileLoading = (companyId: string) => {
  const [files, setFiles] = useState<FileItem[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  
  const loadMoreFiles = useCallback(async () => {
    const { data } = await supabase
      .from('files')
      .select('*')
      .eq('company_id', companyId)
      .range(offset, offset + 49) // Load 50 files at a time
      .order('modified_at', { ascending: false })
      
    setFiles(prev => [...prev, ...(data || [])])
    setHasMore((data?.length || 0) === 50)
    setOffset(prev => prev + 50)
  }, [companyId, offset])
  
  return { files, loadMoreFiles, hasMore }
}
```

## 🚀 **Deployment Strategy**

### **Migration Steps**
1. **Backup current mock data** (for reference)
2. **Deploy database schema** with RLS policies
3. **Configure storage buckets** in Supabase
4. **Update environment variables** with storage keys
5. **Uncomment Supabase integration** in hooks
6. **Test with staging data** before production
7. **Monitor performance** and optimize queries
8. **Implement caching layer** if needed

### **Rollback Plan**
```typescript
// Feature flag for easy rollback
const USE_REAL_DATA = process.env.NEXT_PUBLIC_USE_REAL_FILE_DATA === 'true'

export const useFileManagerData = () => {
  if (USE_REAL_DATA) {
    return useRealFileManagerData()
  } else {
    return useMockFileManagerData()
  }
}
```

## ✅ **Success Criteria**

### **Integration Complete When:**
- [ ] All file operations work with real database
- [ ] Multi-tenant security verified across all operations
- [ ] File upload/download functioning properly
- [ ] Storage analytics showing real data
- [ ] Cross-app file sharing working
- [ ] Performance meets requirements (< 2s load time)
- [ ] Mobile responsiveness maintained
- [ ] Error handling and user feedback working
- [ ] Backup and recovery procedures tested

---

## 📋 **Quick Start Commands**

### **Current Development (Mock Mode)**
```bash
# Start dashboard with file manager
cd apps/dashboard
npm run dev

# Access file manager
open http://localhost:3001/file-manager
```

### **Integration Mode (Future)**
```bash
# Deploy database schema
npm run deploy:schema

# Migrate to real data
npm run migrate:file-manager

# Test integration
npm run test:file-manager
```

---

**Status:** ✅ **READY FOR MONOREPO INTEGRATION**  
**Current Mode:** Mock data with complete functionality  
**Next Step:** Database schema deployment when ready for production integration