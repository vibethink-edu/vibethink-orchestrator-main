'use client'

import { useState, useEffect } from 'react'
;
import { 
  MailHeader, 
  EmailList, 
  EmailView, 
  ComposeEmail 
} from './components'
import { useMailData } from './hooks/useMailData'
import { useCompose } from './hooks/useCompose'
import { Email, EmailFilters } from './types'
import { toast } from 'sonner'

/**
 * Mail Application Page
 * 
 * Complete email management system with multi-tenant security,
 * responsive design, and comprehensive email features.
 * 
 * VThink 1.0 Compliance:
 * - ✅ Multi-tenant security with company_id filtering
 * - ✅ DashboardLayout integration  
 * - ✅ TypeScript strict mode
 * - ✅ HSL color variables for theming
 * - ✅ Responsive design
 * - ✅ Professional email management features
 */

export default function MailPage() {
  // Mail data management
  const {
    emails,
    folders,
    labels,
    metrics,
    loading,
    error,
    loadMailData,
    markAsRead,
    toggleStar,
    moveToFolder,
    deleteEmails
  } = useMailData()

  // Email composition
  const {
    isOpen: isComposeOpen,
    mode: composeMode,
    draft,
    isSending,
    error: composeError,
    openCompose,
    openReply,
    openForward,
    closeCompose,
    updateDraft,
    addRecipient,
    removeRecipient,
    addAttachment,
    removeAttachment,
    sendEmail,
    saveDraft,
    scheduleEmail
  } = useCompose()

  // UI state
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState<Email | null>(null)
  const [currentFolder, setCurrentFolder] = useState('inbox')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  // Handle email selection
  const handleEmailSelect = (emailId: string) => {
    const email = emails.find(e => e.id === emailId)
    if (email) {
      setCurrentEmail(email)
      if (!email.read) {
        markAsRead(emailId, true)
      }
    }
  }

  // Handle email toggle for bulk operations
  const handleEmailToggle = (emailId: string) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    )
  }

  // Handle select all
  const handleSelectAll = (selected: boolean) => {
    setSelectedEmails(selected ? emails.map(e => e.id) : [])
  }

  // Handle folder selection
  const handleFolderSelect = (folderId: string) => {
    setCurrentFolder(folderId)
    setCurrentEmail(null)
    setSelectedEmails([])
    
    const filters: EmailFilters = { folder: folderId }
    loadMailData(filters)
  }

  // Handle label selection
  const handleLabelSelect = (labelId: string) => {
    const filters: EmailFilters = { labels: [labelId] }
    loadMailData(filters)
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filters: EmailFilters = { search: query }
    loadMailData(filters)
  }

  // Handle star toggle
  const handleStar = (emailId: string) => {
    toggleStar(emailId)
  }

  // Handle bulk star
  const handleBulkStar = () => {
    selectedEmails.forEach(emailId => toggleStar(emailId))
    setSelectedEmails([])
    toast.success(`${selectedEmails.length} emails starred`)
  }

  // Handle archive
  const handleArchive = (emailIds: string[]) => {
    moveToFolder(emailIds, 'archive').then(() => {
      setSelectedEmails([])
      toast.success(`${emailIds.length} email${emailIds.length > 1 ? 's' : ''} archived`)
    })
  }

  // Handle delete
  const handleDelete = (emailIds: string[]) => {
    if (window.confirm(`Delete ${emailIds.length} email${emailIds.length > 1 ? 's' : ''}?`)) {
      deleteEmails(emailIds).then(() => {
        setSelectedEmails([])
        setCurrentEmail(null)
        toast.success(`${emailIds.length} email${emailIds.length > 1 ? 's' : ''} deleted`)
      })
    }
  }

  // Handle reply
  const handleReply = (email: Email, replyAll: boolean = false) => {
    openReply(email, replyAll)
  }

  // Handle forward
  const handleForward = (email: Email) => {
    openForward(email)
  }

  // Handle back (mobile)
  const handleBack = () => {
    setCurrentEmail(null)
  }

  // Handle refresh
  const handleRefresh = () => {
    loadMailData()
    toast.success('Emails refreshed')
  }

  // Show error toasts
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  useEffect(() => {
    if (composeError) {
      toast.error(composeError)
    }
  }, [composeError])

  return (
    <div className="space-y-6">
        {/* Mail Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Email Management</h1>
            <p className="text-muted-foreground">
              Manage your emails efficiently with powerful tools and organization
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <MailHeader
              searchQuery={searchQuery}
              onSearchChange={handleSearch}
              selectedCount={selectedEmails.length}
              metrics={metrics || undefined}
              onCompose={openCompose}
              onRefresh={handleRefresh}
              onArchive={handleBulkStar}
              onDelete={() => handleDelete(selectedEmails)}
              onStar={handleBulkStar}
              loading={loading}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="border rounded-lg bg-card">
          <div className="flex h-[calc(100vh-12rem)]">
            {/* Folders Panel */}
            <div className="w-64 border-r bg-card/50 p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Folders</h3>
                </div>
                <div className="space-y-1">
                  {folders?.map((folder) => (
                    <div
                      key={folder.id}
                      className={`p-2 rounded-md cursor-pointer transition-colors ${
                        folder.id === currentFolder 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted"
                      }`}
                      onClick={() => handleFolderSelect(folder.id)}
                    >
                      <p className="text-sm font-medium">{folder.name}</p>
                      <p className="text-xs text-muted-foreground">{folder.total_count} emails</p>
                    </div>
                  ))}
                </div>
                {labels && labels.length > 0 && (
                  <>
                    <h4 className="font-medium text-sm">Labels</h4>
                    <div className="space-y-1">
                      {labels.map((label) => (
                        <div
                          key={label.id}
                          className="p-2 rounded-md cursor-pointer hover:bg-muted transition-colors"
                          onClick={() => handleLabelSelect(label.id)}
                        >
                          <p className="text-sm">{label.name}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Email List */}
            <div className="w-96 border-r">
              <EmailList
                emails={emails}
                selectedEmails={selectedEmails}
                onEmailSelect={handleEmailSelect}
                onEmailToggle={handleEmailToggle}
                onSelectAll={handleSelectAll}
                onStar={handleStar}
                onReply={handleReply}
                onForward={handleForward}
                onArchive={handleArchive}
                onDelete={handleDelete}
                loading={loading}
              />
            </div>

            {/* Email View */}
            <div className="flex-1">
              <EmailView
                email={currentEmail}
                onReply={(email) => handleReply(email, false)}
                onReplyAll={(email) => handleReply(email, true)}
                onForward={handleForward}
                onStar={handleStar}
                onArchive={handleArchive}
                onDelete={handleDelete}
                onBack={handleBack}
              />
            </div>
          </div>
        </div>

        {/* Compose dialog */}
        <ComposeEmail
          isOpen={isComposeOpen}
          mode={composeMode}
          draft={draft}
          onClose={closeCompose}
          onSend={sendEmail}
          onSaveDraft={saveDraft}
          onSchedule={scheduleEmail}
          onUpdate={updateDraft}
          onAddRecipient={addRecipient}
          onRemoveRecipient={removeRecipient}
          onAddAttachment={addAttachment}
          onRemoveAttachment={removeAttachment}
          isSending={isSending}
        />
      </div>
  )
}