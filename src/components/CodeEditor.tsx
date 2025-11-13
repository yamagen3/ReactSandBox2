import React from 'react'
import './CodeEditor.css'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  title?: string
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  title = '練習エディタ'
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="code-editor">
      <div className="code-editor__header">
        {title}
      </div>
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
