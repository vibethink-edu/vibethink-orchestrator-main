import type { Editor } from '@tiptap/react'
import type { EditorView } from '@tiptap/pm/view'
import type { EditorState } from '@tiptap/pm/state'

export interface LinkProps {
  url: string
  text?: string
  openInNewTab?: boolean
}

export interface ShouldShowProps {
  editor: Editor
  view: EditorView
  state: EditorState
  oldState?: EditorState
  from: number
  to: number
}

export interface FormatAction {
  label: string
  icon?: React.ReactNode
  action: (editor: Editor) => void
  isActive: (editor: Editor) => boolean
  canExecute: (editor: Editor) => boolean
  shortcuts: string[]
  value: string
}

export interface RichTextI18nLabels {
  // Formatting
  bold?: string
  italic?: string
  underline?: string
  strikethrough?: string
  code?: string
  clearFormatting?: string
  moreFormatting?: string

  // Lists
  orderedList?: string
  bulletList?: string

  // Links
  editLink?: string
  removeLink?: string
  openLink?: string
}

