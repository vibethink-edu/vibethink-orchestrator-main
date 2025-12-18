// Placeholder hook for note export
'use client';
import { useState } from 'react';
import { ExportOptions } from '../types';

export function useNoteExport() {
  const [isExporting, setIsExporting] = useState(false);
  const exportNote = async (noteId: string, options: ExportOptions) => {
    setIsExporting(true);
    // TODO: Implement export logic
    setIsExporting(false);
  };
  return { isExporting, exportNote };
}