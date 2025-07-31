"use client"

import { useState, useRef } from "react"
import MDEditor from "@uiw/react-md-editor"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Bold, Italic, Code, ListOrdered, CheckSquare, Table, Heading1, Heading2, Link, Strikethrough } from "lucide-react"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
}

export function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder = "Enter description...", 
  label,
  className 
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

const insertMarkdown = (prefix: string, suffix: string = "", placeholder: string = "text") => {
    // Get the textarea from the MDEditor component
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const textarea = (editorRef.current as any)?.textarea || 
                    editorRef.current?.querySelector('textarea') ||
                    document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement
    
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = value.substring(start, end)
      const replacement = selectedText || placeholder
      const newValue = value.substring(0, start) + prefix + replacement + suffix + value.substring(end)
      onChange(newValue)
      
      // Set cursor position after insertion
      setTimeout(() => {
        textarea.focus()
        if (prefix.includes('|')) {
          // For tables, position cursor at first cell
          const headerEnd = newValue.indexOf('|', start + prefix.indexOf('|') + 1)
          textarea.setSelectionRange(headerEnd - 8, headerEnd - 1)
        } else {
          textarea.setSelectionRange(
            start + prefix.length,
            start + prefix.length + replacement.length
          )
        }
      }, 0)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      
{/* Markdown Toolbar */}
      <div className="flex gap-1 p-2 border rounded-md bg-muted/50">
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("# ", "", "Heading 1")} title="Heading 1">
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("## ", "", "Heading 2")} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("**", "**", "bold text")} title="Bold">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("*", "*", "italic text")} title="Italic">
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("~~", "~~", "strikethrough text")} title="Strikethrough">
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("`", "`", "code")} title="Inline Code">
          <Code className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("1. ", "", "numbered item")} title="Numbered List">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("- [ ] ", "", "task item")} title="Task List">
          <CheckSquare className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n", "", "")} title="Table">
          <Table className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("[", "](url)", "link text")} title="Link">
          <Link className="h-4 w-4" />
        </Button>
        <div className="ml-auto">
          <Button type="button" variant="outline" size="sm" onClick={() => setIsPreview(!isPreview)}>
            {isPreview ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>

      {/* Markdown Editor */}
      <div data-color-mode="auto">
        <MDEditor
          ref={editorRef}
          value={value}
          onChange={(val) => onChange(val || "")}
          preview={isPreview ? "preview" : "edit"}
          height={400}
          className="min-h-[400px]"
          hideToolbar
          visibleDragbar={false}
          style={{ height: 'auto', minHeight: '400px' }}
        />
      </div>
    </div>
  )
} 