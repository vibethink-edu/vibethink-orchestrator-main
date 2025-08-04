# 📁 File Manager - Usage Examples & Best Practices

> **Examples for using the File Manager in different monorepo contexts**

## 🎯 **Current Features (Working with Mock Data)**

### **✅ Complete File Management System**
- **Drag & drop upload** with progress tracking
- **Folder organization** with visual hierarchy
- **Storage analytics** with real-time charts
- **File filtering and search** with advanced options
- **Multi-tenant security** patterns preserved
- **Responsive design** for all devices

## 📋 **Usage Examples by Context**

### **1. 🏢 Main App Integration**
```typescript
// apps/main-app/components/DocumentAttachment.tsx
import { useFileService } from '@/shared/services/FileService'

export function DocumentAttachment({ documentId, companyId }: Props) {
  const { uploadFile, getFilesByDocument } = useFileService()
  
  const handleFileUpload = async (file: File) => {
    await uploadFile(file, {
      companyId,           // 🔒 Multi-tenant security
      documentId,          // Link to parent document
      category: 'document-attachment',
      tags: ['contract', 'legal']
    })
  }
  
  // Integration with File Manager
  return (
    <FileUploadDialog
      isOpen={isUploading}
      onUpload={handleFileUpload}
      currentFolder={`documents/${documentId}`}
    />
  )
}
```

### **2. 🎫 Helpdesk Integration**
```typescript
// apps/helpdesk/components/TicketFileManager.tsx
import { FileManagerService } from '@/shared/services/FileManagerService'

export function TicketFileManager({ ticketId, companyId }: Props) {
  const { files, uploadFile, deleteFile } = useFileManagerData()
  
  // Filter files for this specific ticket
  const ticketFiles = files.filter(file => 
    file.metadata?.ticketId === ticketId &&
    file.company_id === companyId  // 🔒 Security filter
  )
  
  const handleTicketFileUpload = async (file: File) => {
    await uploadFile(file, {
      companyId,
      metadata: {
        ticketId,
        category: 'support-attachment',
        visibility: 'internal' // Only support team
      },
      tags: ['support', 'ticket', ticketId]
    })
  }
  
  return (
    <div className="space-y-4">
      <h3>Ticket Attachments</h3>
      <TableRecentFiles 
        files={ticketFiles}
        onFileDownload={(fileId) => downloadFile(fileId)}
        onFileDelete={(fileId) => deleteFile(fileId)}
      />
      <FileUploadDialog
        onUpload={handleTicketFileUpload}
        currentFolder={`tickets/${ticketId}`}
      />
    </div>
  )
}
```

### **3. 👑 Admin Panel Integration**
```typescript
// apps/admin/components/CompanyFileManager.tsx
import { AdminFileService } from '@/shared/services/AdminFileService'

export function CompanyFileManager({ companyId }: Props) {
  const { 
    getCompanyStorageMetrics,
    getCompanyFiles,
    enforceStorageQuota
  } = useAdminFileAccess()
  
  const [metrics, setMetrics] = useState<StorageMetrics | null>(null)
  
  useEffect(() => {
    const loadCompanyMetrics = async () => {
      // Admin can view any company's storage metrics
      const companyMetrics = await getCompanyStorageMetrics(companyId)
      setMetrics(companyMetrics)
      
      // Check quota compliance
      if (companyMetrics.usagePercentage > 95) {
        await enforceStorageQuota(companyId)
      }
    }
    
    loadCompanyMetrics()
  }, [companyId])
  
  return (
    <div className="space-y-6">
      {/* Company-wide storage overview */}
      <SummaryCards metrics={metrics} loading={!metrics} />
      
      {/* Admin controls */}
      <Card>
        <CardContent className="p-6">
          <h3>Storage Management</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button onClick={() => increaseQuota(companyId)}>
              Increase Quota
            </Button>
            <Button onClick={() => cleanupOldFiles(companyId)}>
              Cleanup Old Files
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### **4. 🔐 Login App Integration**
```typescript
// apps/login/components/ProfilePictureUpload.tsx
export function ProfilePictureUpload({ userId, companyId }: Props) {
  const { uploadFile } = useFileService()
  
  const handleProfilePictureUpload = async (file: File) => {
    // Validate image file
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed')
    }
    
    // Upload with specific constraints
    await uploadFile(file, {
      companyId,
      userId,
      category: 'profile-picture',
      maxSize: 5 * 1024 * 1024, // 5MB limit
      generateThumbnails: true,
      isPublic: false,
      tags: ['profile', 'avatar', userId]
    })
  }
  
  return (
    <FileUploadDialog
      isOpen={isEditing}
      onUpload={handleProfilePictureUpload}
      currentFolder="profile-pictures"
      acceptedTypes={['image/*']}
      maxFiles={1}
    />
  )
}
```

## 🔄 **Cross-App Sharing Examples**

### **Document Sharing Between Apps**
```typescript
// Shared service for cross-app file access
export class CrossAppFileService {
  async shareFileAcrossApps(
    fileId: string,
    fromApp: string,
    toApp: string,
    companyId: string,
    permissions: FilePermissions
  ) {
    // Verify multi-tenant security
    const file = await this.getFile(fileId, companyId)
    if (!file) throw new Error('File not found or access denied')
    
    // Create cross-app reference
    await this.createFileReference({
      original_file_id: fileId,
      source_app: fromApp,
      target_app: toApp,
      company_id: companyId,
      permissions,
      shared_at: new Date()
    })
    
    // Log sharing activity
    await this.logFileActivity({
      file_id: fileId,
      action: 'shared_cross_app',
      details: `Shared from ${fromApp} to ${toApp}`,
      company_id: companyId
    })
  }
}

// Usage in Main App
const shareDocument = async (documentId: string) => {
  await crossAppFileService.shareFileAcrossApps(
    documentId,
    'main-app',
    'helpdesk',
    user.company_id,
    { read: true, download: true, comment: true }
  )
}
```

### **Centralized Asset Management**
```typescript
// apps/admin/components/AssetManager.tsx
export function AssetManager() {
  const { getAllCompanyAssets } = useAdminFileAccess()
  
  const [assets, setAssets] = useState<FileAsset[]>([])
  
  // Get assets from all apps
  useEffect(() => {
    const loadAllAssets = async () => {
      const allAssets = await getAllCompanyAssets({
        includeApps: ['main-app', 'helpdesk', 'dashboard'],
        categories: ['document', 'image', 'video'],
        timeRange: 'last-30-days'
      })
      setAssets(allAssets)
    }
    
    loadAllAssets()
  }, [])
  
  return (
    <div className="space-y-6">
      <h2>Company-wide Asset Management</h2>
      
      {/* Asset breakdown by app */}
      <div className="grid grid-cols-3 gap-6">
        {['main-app', 'helpdesk', 'dashboard'].map(app => (
          <Card key={app}>
            <CardContent className="p-6">
              <h3>{app} Assets</h3>
              <p className="text-2xl font-bold">
                {assets.filter(a => a.source_app === app).length}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Unified file table */}
      <TableRecentFiles 
        files={assets}
        showSourceApp={true}
        onFileTransfer={(fileId, targetApp) => 
          transferFileBetweenApps(fileId, targetApp)
        }
      />
    </div>
  )
}
```

## 📊 **Analytics Integration Examples**

### **Company-wide Storage Analytics**
```typescript
// apps/dashboard/app/file-analytics/page.tsx
export default function FileAnalyticsPage() {
  const { 
    getStorageAnalytics,
    getUsageTrends,
    getTopUsers,
    getFileTypeBreakdown
  } = useFileAnalytics()
  
  const [analytics, setAnalytics] = useState(null)
  
  useEffect(() => {
    const loadAnalytics = async () => {
      const [storage, trends, users, breakdown] = await Promise.all([
        getStorageAnalytics(),
        getUsageTrends(),
        getTopUsers(),
        getFileTypeBreakdown()
      ])
      
      setAnalytics({ storage, trends, users, breakdown })
    }
    
    loadAnalytics()
  }, [])
  
  return (
    <BunduiCompleteLayout>
      <div className="space-y-6">
        <h1>File Storage Analytics</h1>
        
        {/* Cross-app storage summary */}
        <div className="grid grid-cols-4 gap-6">
          <SummaryCards metrics={analytics?.storage} />
        </div>
        
        {/* Usage trends chart */}
        <ChartFileTransfer 
          data={analytics?.trends}
          showApps={true}
          title="Cross-App File Usage Trends"
        />
        
        {/* Top users and file types */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3>Top Users by Storage</h3>
              {analytics?.users?.map(user => (
                <div key={user.id} className="flex justify-between">
                  <span>{user.name}</span>
                  <span>{formatBytes(user.storageUsed)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3>File Type Breakdown</h3>
              <AllocationChart 
                data={analytics?.breakdown}
                title="Storage by File Type"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </BunduiCompleteLayout>
  )
}
```

## 🔐 **Security Best Practices**

### **Multi-tenant File Access**
```typescript
// Security middleware for file operations
export const withFileAccess = (operation: FileOperation) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { fileId } = req.params
    const { company_id } = req.user
    
    // Verify file belongs to user's company
    const file = await supabase
      .from('files')
      .select('company_id, user_id')
      .eq('id', fileId)
      .eq('company_id', company_id) // 🔒 CRITICAL: Multi-tenant filter
      .single()
    
    if (!file.data) {
      return res.status(404).json({ error: 'File not found' })
    }
    
    // Check operation permissions
    const hasPermission = await checkFilePermission(
      fileId, 
      req.user.id, 
      company_id, 
      operation
    )
    
    if (!hasPermission) {
      return res.status(403).json({ error: 'Access denied' })
    }
    
    next()
  }
}

// Usage in API routes
app.get('/api/files/:fileId/download', 
  withFileAccess('download'),
  async (req, res) => {
    // File download logic - already security verified
    const fileStream = await getFileStream(req.params.fileId)
    fileStream.pipe(res)
  }
)
```

### **File Audit Trail**
```typescript
// Comprehensive file audit logging
export class FileAuditService {
  async logFileActivity(activity: FileActivity) {
    await supabase.from('file_audit_log').insert({
      file_id: activity.fileId,
      user_id: activity.userId,
      company_id: activity.companyId,
      action: activity.action,
      details: activity.details,
      app_source: activity.appSource,
      ip_address: activity.ipAddress,
      user_agent: activity.userAgent,
      timestamp: new Date()
    })
  }
  
  async getFileAuditTrail(fileId: string, companyId: string) {
    const { data } = await supabase
      .from('file_audit_log')
      .select(`
        action, details, timestamp, user_id, app_source,
        users(name, email)
      `)
      .eq('file_id', fileId)
      .eq('company_id', companyId) // 🔒 CRITICAL: Multi-tenant filter
      .order('timestamp', { ascending: false })
    
    return data
  }
}
```

## 🚀 **Performance Optimization**

### **Efficient File Loading**
```typescript
// Lazy loading with virtual scrolling for large file lists
export function VirtualizedFileList({ companyId }: Props) {
  const { 
    files, 
    loadMoreFiles, 
    hasMore, 
    loading 
  } = useLazyFileLoading(companyId)
  
  const [containerRef, isIntersecting] = useIntersectionObserver()
  
  // Load more files when scrolling near bottom
  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      loadMoreFiles()
    }
  }, [isIntersecting, hasMore, loading])
  
  return (
    <div className="space-y-2">
      {files.map((file, index) => (
        <FileListItem 
          key={file.id} 
          file={file}
          style={{ 
            transform: `translateY(${index * 60}px)`,
            position: 'absolute',
            width: '100%'
          }}
        />
      ))}
      
      {/* Intersection observer target */}
      <div ref={containerRef} className="h-10" />
      
      {loading && <FileListSkeleton />}
    </div>
  )
}
```

### **Smart Caching Strategy**
```typescript
// Redis caching for frequently accessed files
export class FileCacheService {
  async getCachedFileMetadata(fileId: string): Promise<FileMetadata | null> {
    const cached = await redis.get(`file:${fileId}`)
    return cached ? JSON.parse(cached) : null
  }
  
  async cacheFileMetadata(fileId: string, metadata: FileMetadata) {
    await redis.setex(
      `file:${fileId}`, 
      3600, // 1 hour TTL
      JSON.stringify(metadata)
    )
  }
  
  async invalidateFileCache(fileId: string) {
    await redis.del(`file:${fileId}`)
    await redis.del(`file:${fileId}:permissions`)
    await redis.del(`file:${fileId}:activity`)
  }
}
```

## 🧪 **Testing Examples**

### **File Manager Component Tests**
```typescript
// components/FileManager.test.tsx
describe('FileManager Integration', () => {
  test('should upload file with company_id filtering', async () => {
    const mockUser = { id: 'user1', company_id: 'comp1' }
    const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' })
    
    render(<FileManager user={mockUser} />)
    
    // Simulate file upload
    const uploadButton = screen.getByRole('button', { name: /upload/i })
    fireEvent.click(uploadButton)
    
    const fileInput = screen.getByLabelText(/choose files/i)
    fireEvent.change(fileInput, { target: { files: [mockFile] } })
    
    // Verify file was uploaded with correct company_id
    await waitFor(() => {
      expect(mockUploadFile).toHaveBeenCalledWith(
        expect.objectContaining({
          company_id: 'comp1'
        })
      )
    })
  })
  
  test('should not display files from other companies', async () => {
    const mockFiles = [
      { id: '1', name: 'file1.txt', company_id: 'comp1' },
      { id: '2', name: 'file2.txt', company_id: 'comp2' } // Different company
    ]
    
    const mockUser = { company_id: 'comp1' }
    
    render(<FileManager user={mockUser} files={mockFiles} />)
    
    // Should only show file from same company
    expect(screen.getByText('file1.txt')).toBeInTheDocument()
    expect(screen.queryByText('file2.txt')).not.toBeInTheDocument()
  })
})
```

---

## 📋 **Implementation Checklist**

### **For Each App Integration:**
- [ ] ✅ Import File Manager components
- [ ] ✅ Configure file service with app-specific context
- [ ] ✅ Set up proper multi-tenant filtering
- [ ] ✅ Implement file permissions for app-specific access
- [ ] ✅ Add audit logging for file operations
- [ ] ✅ Configure storage quotas and limits
- [ ] ✅ Test cross-app file sharing (if needed)
- [ ] ✅ Implement performance optimizations
- [ ] ✅ Add comprehensive error handling
- [ ] ✅ Write integration tests

**Result:** ✅ **Complete file management system ready for monorepo integration with full security, performance, and feature compliance.**