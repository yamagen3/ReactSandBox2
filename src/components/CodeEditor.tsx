import React from 'react'
import './CodeEditor.css'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="code-editor">
      <textarea
        className="code-editor__textarea"
        value={value}
        onChange={handleChange}
        placeholder="React コードを入力してください..."
        spellCheck={false}
      />
    </div>
  )
}
