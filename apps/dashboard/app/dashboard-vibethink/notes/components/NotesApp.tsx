// =============================================================================
// NOTES APP COMPONENT
// =============================================================================
// 
// Main notes application component following DashboardLayout pattern
// NO app-specific sidebar - follows CRM/Kanban pattern with content in main area
//
// VThink 1.0 Compliance:
// - ✅ Multi-tenant security
// - ✅ Universal DashboardLayout pattern
// - ✅ HSL color variables
// - ✅ Shadcn/ui components
// =============================================================================

'use client';

import React, { useState } from 'react';
import { NotesHeader } from './NotesHeader';
import { NotesContent } from './NotesContent';
import { AddNoteModal } from './AddNoteModal';
import { EditLabelsModal } from './EditLabelsModal';
import { NoteShareDialog } from './NoteShareDialog';
import { useNotesData } from '../hooks/useNotesData';
import { useNoteFilters } from '../hooks/useNoteFilters';
import { useNoteFolders } from '../hooks/useNoteFolders';
import { useNoteLabels } from '../hooks/useNoteLabels';

/**
 * Main Notes Application Component
 * 
 * Follows DashboardLayout pattern with:
 * - Header with search, filters, and controls in main content area
 * - Notes list and editor in main content area
 * - Modal dialogs for creating notes and managing labels
 * - NO app-specific sidebar (uses universal DashboardLayout sidebar only)
 */
export function NotesApp() {
  // Data hooks
  const notesData = useNotesData();
  const filtersData = useNoteFilters();
  const foldersData = useNoteFolders();
  const labelsData = useNoteLabels();

  // UI state
  const [addNoteModalOpen, setAddNoteModalOpen] = useState(false);
  const [editLabelsModalOpen, setEditLabelsModalOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  // Filter and display notes
  const filteredNotes = filtersData.filterNotes(notesData.notes);

  // Handlers
  const handleCreateNote = async (noteData: any) => {
    try {
      const newNote = await notesData.createNote(noteData);
      notesData.selectNote(newNote.id);
      setAddNoteModalOpen(false);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleSelectNote = (noteId: string | null) => {
    notesData.selectNote(noteId);
  };

  const handleUpdateNote = async (updates: any) => {
    if (notesData.selectedNote) {
      try {
        await notesData.updateNote({
          id: notesData.selectedNote.id,
          ...updates
        });
      } catch (error) {
        console.error('Error updating note:', error);
      }
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await notesData.deleteNote(noteId);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Quick create note
  const handleQuickCreateNote = () => {
    setAddNoteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Notes Header with controls, search, and filters */}
      <NotesHeader
        totalNotes={filteredNotes.length}
        hasActiveFilters={filtersData.hasActiveFilters}
        filterCount={filtersData.filterCount}
        onCreateNote={handleQuickCreateNote}
        onManageLabels={() => setEditLabelsModalOpen(true)}
        filters={filtersData}
        folders={foldersData.folders}
        labels={labelsData.labels}
        stats={notesData.stats}
      />

      {/* Main Notes Content Area */}
      <NotesContent
        notes={filteredNotes}
        selectedNote={notesData.selectedNote}
        onSelectNote={handleSelectNote}
        onUpdateNote={handleUpdateNote}
        onDeleteNote={handleDeleteNote}
        onShareNote={() => setShareDialogOpen(true)}
        onCreateNote={handleQuickCreateNote}
        folders={foldersData.folders}
        labels={labelsData.labels}
        isUpdating={notesData.isUpdating}
      />

      {/* Modals and Dialogs */}
      <AddNoteModal
        open={addNoteModalOpen}
        onOpenChange={setAddNoteModalOpen}
        onCreateNote={handleCreateNote}
        folders={foldersData.folders}
        labels={labelsData.labels}
      />

      <EditLabelsModal
        open={editLabelsModalOpen}
        onOpenChange={setEditLabelsModalOpen}
        labels={labelsData.labels}
        onCreateLabel={labelsData.createLabel}
        onUpdateLabel={labelsData.updateLabel}
        onDeleteLabel={labelsData.deleteLabel}
      />

      {notesData.selectedNote && (
        <NoteShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          note={notesData.selectedNote}
          onUpdateNote={handleUpdateNote}
        />
      )}

      {/* Error Display */}
      {notesData.error && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg max-w-sm">
            <p className="text-sm">{notesData.error}</p>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {notesData.isLoading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex items-center gap-2 bg-card p-4 rounded-lg shadow-lg">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Loading notes...</span>
          </div>
        </div>
      )}
    </div>
  );
}
