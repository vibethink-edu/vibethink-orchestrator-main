// =============================================================================
// NOTES APPLICATION TYPES
// =============================================================================
// 
// TypeScript definitions for the Notes system with multi-tenant support
// Includes enhanced features for professional note-taking and collaboration
//
// VThink 1.0 Compliance:
// - ✅ Multi-tenant security (company_id filtering)
// - ✅ Strict TypeScript definitions
// - ✅ Professional note-taking features
// - ✅ Collaboration and sharing support
// =============================================================================

export type NoteType = "text" | "checklist" | "markdown" | "voice" | "image" | "template";

export type NoteStatus = "active" | "archived" | "deleted" | "shared";

export type NotePriority = "low" | "medium" | "high" | "urgent";

export type NotePermission = "read" | "write" | "admin" | "owner";

export type NoteShareLevel = "private" | "team" | "company" | "public";

/**
 * Main Note interface with multi-tenant support
 */
export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  status: NoteStatus;
  priority: NotePriority;
  
  // Multi-tenant security
  company_id: string;
  user_id: string;
  
  // Organization
  folder_id: string | null;
  labels: string[];
  tags: string[];
  
  // Checklist items (for checklist type)
  checklist_items?: ChecklistItem[];
  
  // Media attachments
  attachments?: NoteAttachment[];
  
  // Sharing and collaboration
  share_level: NoteShareLevel;
  shared_with?: NoteShare[];
  
  // Metadata
  word_count: number;
  estimated_read_time: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
  
  // Versioning
  version: number;
  
  // Template specific
  is_template: boolean;
  template_category?: string;
  
  // Voice notes
  voice_transcript?: string;
  voice_duration?: number;
  
  // Reminders
  reminder_at?: string;
  
  // Encryption
  is_encrypted: boolean;
}

/**
 * Checklist item for checklist-type notes
 */
export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Note labels for organization
 */
export interface NoteLabel {
  id: string;
  title: string;
  color: string;
  description?: string;
  company_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Note folders for hierarchical organization
 */
export interface NoteFolder {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parent_folder_id: string | null;
  
  // Multi-tenant security
  company_id: string;
  user_id: string;
  
  // Sharing
  share_level: NoteShareLevel;
  
  // Order and organization
  order: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Computed fields
  notes_count?: number;
  subfolders_count?: number;
}

/**
 * Note sharing configuration
 */
export interface NoteShare {
  id: string;
  note_id: string;
  shared_with_user_id?: string;
  shared_with_team_id?: string;
  permission: NotePermission;
  expires_at?: string;
  created_by: string;
  created_at: string;
}

/**
 * Note attachments (files, images, etc.)
 */
export interface NoteAttachment {
  id: string;
  note_id: string;
  filename: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  file_url: string;
  thumbnail_url?: string;
  
  // Multi-tenant security
  company_id: string;
  user_id: string;
  
  created_at: string;
}

/**
 * Note templates for quick creation
 */
export interface NoteTemplate {
  id: string;
  title: string;
  description: string;
  content: string;
  type: NoteType;
  category: string;
  
  // Multi-tenant
  company_id: string;
  user_id: string;
  
  // Sharing
  is_public: boolean;
  is_system: boolean;
  
  // Usage tracking
  usage_count: number;
  
  created_at: string;
  updated_at: string;
}

/**
 * Note version history
 */
export interface NoteVersion {
  id: string;
  note_id: string;
  version_number: number;
  title: string;
  content: string;
  change_summary: string;
  
  // User who made the change
  user_id: string;
  
  created_at: string;
}

/**
 * Note comments for collaboration
 */
export interface NoteComment {
  id: string;
  note_id: string;
  content: string;
  
  // Author
  user_id: string;
  user_name: string;
  user_avatar?: string;
  
  // Threading
  parent_comment_id?: string;
  
  // Status
  is_resolved: boolean;
  
  created_at: string;
  updated_at: string;
}

/**
 * Note analytics and insights
 */
export interface NoteAnalytics {
  note_id: string;
  view_count: number;
  edit_count: number;
  share_count: number;
  comment_count: number;
  last_viewed_at: string;
  time_spent_reading: number; // in seconds
  time_spent_editing: number; // in seconds
}

/**
 * Filters for note lists
 */
export interface NoteFilters {
  search?: string;
  type?: NoteType[];
  status?: NoteStatus[];
  priority?: NotePriority[];
  labels?: string[];
  folder_id?: string;
  date_range?: {
    start: string;
    end: string;
  };
  shared_only?: boolean;
  has_attachments?: boolean;
  has_reminders?: boolean;
}

/**
 * Sort options for note lists
 */
export interface NoteSortOptions {
  field: 'created_at' | 'updated_at' | 'title' | 'priority' | 'word_count';
  direction: 'asc' | 'desc';
}

/**
 * Note list view configuration
 */
export interface NoteViewConfig {
  view_type: 'list' | 'grid' | 'compact';
  sort: NoteSortOptions;
  filters: NoteFilters;
  columns: string[]; // for list view
}

/**
 * Note creation/update payload
 */
export interface CreateNotePayload {
  title: string;
  content: string;
  type: NoteType;
  folder_id?: string;
  labels?: string[];
  tags?: string[];
  priority?: NotePriority;
  share_level?: NoteShareLevel;
  is_template?: boolean;
  template_category?: string;
  reminder_at?: string;
}

export interface UpdateNotePayload extends Partial<CreateNotePayload> {
  id: string;
  status?: NoteStatus;
}

/**
 * Bulk operations payload
 */
export interface BulkNoteOperation {
  note_ids: string[];
  operation: 'archive' | 'delete' | 'move' | 'label' | 'share';
  params?: {
    folder_id?: string;
    labels?: string[];
    share_level?: NoteShareLevel;
  };
}

/**
 * Export options
 */
export interface ExportOptions {
  format: 'pdf' | 'markdown' | 'html' | 'txt' | 'json';
  include_attachments: boolean;
  include_comments: boolean;
  include_metadata: boolean;
}

/**
 * Search results
 */
export interface NoteSearchResult {
  note: Note;
  highlights: {
    title?: string;
    content?: string;
  };
  score: number;
}

/**
 * Voice note configuration
 */
export interface VoiceNoteConfig {
  language: string;
  auto_transcribe: boolean;
  quality: 'low' | 'medium' | 'high';
  max_duration: number; // in seconds
}

/**
 * Collaboration settings
 */
export interface CollaborationSettings {
  allow_comments: boolean;
  allow_suggestions: boolean;
  auto_save_interval: number; // in seconds
  conflict_resolution: 'merge' | 'overwrite' | 'prompt';
}