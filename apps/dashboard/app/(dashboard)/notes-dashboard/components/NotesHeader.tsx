// =============================================================================
// NOTES HEADER COMPONENT
// =============================================================================
// 
// Header component for notes app with search, filters, and controls
// Moves sidebar functionality to the main content area following CRM pattern
//
// VThink 1.0 Compliance:
// - ✅ Universal DashboardLayout pattern
// - ✅ HSL color variables
// - ✅ Shadcn/ui components
// - ✅ Multi-tenant awareness
// =============================================================================

'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { Input } from '@/shared/components/bundui-premium/components/ui/input';
import { Badge } from '@/shared/components/bundui-premium/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/bundui-premium/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/bundui-premium/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/bundui-premium/components/ui/collapsible';
import { 
  Search, 
  Plus, 
  Filter,
  FolderOpen,
  Tag,
  Archive,
  Star,
  StickyNote,
  ChevronDown,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Note, NoteFolder, NoteLabel } from '../types';
import { UseNoteFiltersReturn } from '../hooks/useNoteFilters';
import { NoteFolderTree } from './NoteFolderTree';

interface NotesHeaderProps {
  totalNotes: number;
  hasActiveFilters: boolean;
  filterCount: number;
  onCreateNote: () => void;
  onManageLabels: () => void;
  filters: UseNoteFiltersReturn;
  folders: NoteFolder[];
  labels: NoteLabel[];
  stats: {
    totalNotes: number;
    archivedNotes: number;
    sharedNotes: number;
    todayNotes: number;
  };
}

export function NotesHeader({
  totalNotes,
  hasActiveFilters,
  filterCount,
  onCreateNote,
  onManageLabels,
  filters,
  folders,
  labels,
  stats
}: NotesHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [foldersExpanded, setFoldersExpanded] = useState(false);
  const [labelsExpanded, setLabelsExpanded] = useState(false);

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    filters.setSearchQuery(query);
  };

  return (
    <div className="space-y-4">
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Notes</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <StickyNote className="w-4 h-4" />
              {totalNotes} notes
            </span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                {filterCount} filters active
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onManageLabels}
            className="hidden sm:flex"
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage Labels
          </Button>

          <Button
            onClick={onCreateNote}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            New Note
          </Button>
        </div>
      </div>

      {/* Search and Quick Filters */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Search */}
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9 pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8",
                (showFilters || hasActiveFilters) && "bg-accent"
              )}
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 md:col-span-2">
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{stats.archivedNotes}</p>
                <p className="text-xs text-muted-foreground">Archived</p>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{stats.sharedNotes}</p>
                <p className="text-xs text-muted-foreground">Shared</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filters & Organization</CardTitle>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={filters.clearAllFilters}
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Active Filters</h4>
                <div className="flex flex-wrap gap-2">
                  {filters.filters.type && (
                    <Badge variant="secondary" className="text-xs">
                      Type: {filters.filters.type.join(', ')}
                    </Badge>
                  )}
                  {filters.filters.priority && (
                    <Badge variant="secondary" className="text-xs">
                      Priority: {filters.filters.priority.join(', ')}
                    </Badge>
                  )}
                  {filters.filters.labels && (
                    <Badge variant="secondary" className="text-xs">
                      Labels: {filters.filters.labels.length}
                    </Badge>
                  )}
                  {filters.filters.folder_id && (
                    <Badge variant="secondary" className="text-xs">
                      Folder Filter Active
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {/* Folders */}
              <Collapsible open={foldersExpanded} onOpenChange={setFoldersExpanded}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      <span>Folders ({folders.length})</span>
                    </div>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      foldersExpanded && "rotate-180"
                    )} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <Card className="p-3">
                    <NoteFolderTree
                      folders={folders}
                      onSelectFolder={(folderId) => filters.setFolderFilter(folderId)}
                      onCreateFolder={async (name, parentId) => {
                        // This should be handled by the parent component
                        console.log('Create folder:', name, parentId);
                        return {
                          id: 'temp',
                          name,
                          description: '',
                          color: 'hsl(221 83% 53%)',
                          icon: 'folder',
                          parent_folder_id: parentId || null,
                          company_id: 'company_1',
                          user_id: 'user_1',
                          share_level: 'private',
                          order: 0,
                          created_at: new Date().toISOString(),
                          updated_at: new Date().toISOString(),
                        } as NoteFolder;
                      }}
                      selectedFolderId={filters.filters.folder_id || null}
                    />
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              {/* Labels */}
              <Collapsible open={labelsExpanded} onOpenChange={setLabelsExpanded}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span>Labels ({labels.length})</span>
                    </div>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      labelsExpanded && "rotate-180"
                    )} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <Card className="p-3 max-h-48 overflow-y-auto">
                    <div className="space-y-2">
                      {labels.map((label) => (
                        <Button
                          key={label.id}
                          variant="ghost"
                          size="sm"
                          onClick={() => filters.setLabelFilter([label.id])}
                          className="w-full justify-start gap-2 text-xs h-8"
                        >
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: label.color }}
                          />
                          <span className="flex-1 text-left">{label.title}</span>
                        </Button>
                      ))}
                      {labels.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          No labels created yet
                        </p>
                      )}
                    </div>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}