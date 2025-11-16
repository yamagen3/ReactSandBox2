import React, { useState } from 'react'
import './CodeEditor.css'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  title?: string
  exampleCode?: string
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  title = '練習エディタ',
  exampleCode
}) => {
  const [showOverlay, setShowOverlay] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay)
  }

  return (
    <div className="code-editor">
      <div className="code-editor__header">
        {title}
        {exampleCode && (
          <button
            className="code-editor__overlay-button"
            onClick={toggleOverlay}
            aria-label="お手本を表示"
          >
            👁️ お手本を表示
          </button>
        )}
      </div>
      <div className="code-editor__content">
        <textarea
          className="code-editor__textarea"
          value={value}
          onChange={handleChange}
          placeholder="React コードを入力してください..."
          spellCheck={false}
        />
        {showOverlay && exampleCode && (
          <div className="code-editor__overlay">
            <pre className="code-editor__overlay-code">{exampleCode}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
