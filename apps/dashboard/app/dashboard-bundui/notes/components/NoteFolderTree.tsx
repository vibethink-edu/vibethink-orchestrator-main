// Placeholder component for folder tree
'use client';
import React from 'react';
import { NoteFolder } from '../types';

interface NoteFolderTreeProps {
  folders: NoteFolder[];
  onSelectFolder: (folderId: string | null) => void;
  onCreateFolder: (name: string, parentId?: string) => Promise<NoteFolder>;
  selectedFolderId: string | null;
}

export function NoteFolderTree(props: NoteFolderTreeProps) {
  return <div className="p-2 text-xs text-muted-foreground">Folder tree coming soon...</div>;
}
