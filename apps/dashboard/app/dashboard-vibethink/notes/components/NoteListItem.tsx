// =============================================================================
// NOTE LIST ITEM COMPONENT
// =============================================================================
// 
// Individual note item in the sidebar list
// Shows note title, preview, metadata, and actions
//
// VThink 1.0 Compliance:
// - ✅ Responsive design
// - ✅ HSL color variables
// - ✅ Shadcn/ui components
// =============================================================================

'use client';

import React, { useState } from 'react';
import { Button } from '@vibethink/ui';
import { Badge } from '@vibethink/ui';
import { DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger, } from '@vibethink/ui';
import { 
  MoreHorizontal, 
  Archive, 
  Trash2, 
  Copy, 
  Share2,
  Pin,
  Tag,
  FileText,
  CheckSquare,
  Image,
  Mic,
  FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Note, NoteFolder, NoteLabel, NoteType } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface NoteListItemProps {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
  labels: NoteLabel[];
  folders: NoteFolder[];
  className?: string;
  compact?: boolean;
}

// Note type icons
const getNoteTypeIcon = (type: NoteType) => {
  switch (type) {
    case 'text':
      return FileText;
    case 'checklist':
      return CheckSquare;
    case 'image':
      return Image;
    case 'voice':
      return Mic;
    case 'markdown':
      return FileText;
    default:
      return FileText;
  }
};

// Priority colors
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'hsl(0 84% 60%)'; // red
    case 'high':
      return 'hsl(25 95% 53%)'; // orange
    case 'medium':
      return 'hsl(47 96% 53%)'; // yellow
    case 'low':
      return 'hsl(142 76% 36%)'; // green
    default:
      return 'hsl(var(--muted-foreground))';
  }
};

export function NoteListItem({
  note,
  isSelected,
  onClick,
  onDelete,
  labels,
  folders,
  className
}: NoteListItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get note metadata
  const folder = folders.find(f => f.id === note.folder_id);
  const noteLabels = labels.filter(label => note.labels.includes(label.id));
  const NoteIcon = getNoteTypeIcon(note.type);
  
  // Content preview
  const contentPreview = note.content
    .replace(/[#*`\[\]]/g, '') // Remove markdown chars
    .substring(0, 100);

  // Time formatting
  const timeAgo = formatDistanceToNow(new Date(note.updated_at), { addSuffix: true });

  // Handle menu actions
  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement archive functionality
    console.log('Archive note:', note.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement duplicate functionality
    console.log('Duplicate note:', note.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement share functionality
    console.log('Share note:', note.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      className={cn(
        "group relative p-3 rounded-lg border cursor-pointer transition-all duration-200",
        "hover:bg-muted/50 hover:border-border",
        isSelected && "bg-primary/5 border-primary/20 shadow-sm",
        className
      )}
      onClick={onClick}
    >
      {/* Priority Indicator */}
      {note.priority !== 'medium' && (
        <div 
          className="absolute top-2 right-2 w-2 h-2 rounded-full"
          style={{ backgroundColor: getPriorityColor(note.priority) }}
        />
      )}

      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <NoteIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <h3 className="font-medium text-sm text-foreground truncate">
            {note.title || 'Untitled'}
          </h3>
        </div>

        {/* Actions Menu */}
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity",
                isMenuOpen && "opacity-100"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleArchive}>
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content Preview */}
      {contentPreview && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
          {contentPreview}...
        </p>
      )}

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          {/* Folder */}
          {folder && (
            <div className="flex items-center gap-1">
              <FolderOpen className="w-3 h-3" />
              <span className="truncate max-w-20">{folder.name}</span>
            </div>
          )}

          {/* Word Count */}
          <span>{note.word_count} words</span>
        </div>

        {/* Time */}
        <span className="flex-shrink-0">{timeAgo}</span>
      </div>

      {/* Labels */}
      {noteLabels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {noteLabels.slice(0, 3).map((label) => (
            <Badge
              key={label.id}
              variant="outline"
              className="text-xs px-1 py-0 h-5"
              style={{ 
                borderColor: label.color + '40',
                backgroundColor: label.color + '10',
                color: label.color
              }}
            >
              {label.title}
            </Badge>
          ))}
          {noteLabels.length > 3 && (
            <Badge variant="outline" className="text-xs px-1 py-0 h-5">
              +{noteLabels.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Note Status Indicators */}
      <div className="flex items-center gap-1 mt-2">
        {note.share_level !== 'private' && (
          <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
            <Share2 className="w-2 h-2 mr-1" />
            Shared
          </Badge>
        )}
        
        {note.attachments && note.attachments.length > 0 && (
          <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
            📎 {note.attachments.length}
          </Badge>
        )}
        
        {note.reminder_at && (
          <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
            🔔
          </Badge>
        )}

        {note.is_encrypted && (
          <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
            🔒
          </Badge>
        )}
      </div>
    </div>
  );
}
