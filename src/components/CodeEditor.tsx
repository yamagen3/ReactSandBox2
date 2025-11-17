import React, { useState, useRef } from 'react'
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const { selectionStart, selectionEnd } = textarea
    const lines = value.split('\n')
    let currentLineStart = 0
    let currentLineIndex = 0

    // 現在の行を見つける
    for (let i = 0; i < lines.length; i++) {
      const lineLength = lines[i].length + 1 // +1 for newline
      if (selectionStart < currentLineStart + lineLength) {
        currentLineIndex = i
        break
      }
      currentLineStart += lineLength
    }

    // Tab: インデント追加
    if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      const newValue = value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd)
      onChange(newValue)
      setTimeout(() => {
        textarea.setSelectionRange(selectionStart + 2, selectionStart + 2)
      }, 0)
      return
    }

    // Shift+Tab: インデント削除
    if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault()
      const currentLine = lines[currentLineIndex]
      if (currentLine.startsWith('  ')) {
        lines[currentLineIndex] = currentLine.substring(2)
        const newValue = lines.join('\n')
        onChange(newValue)
        setTimeout(() => {
          const newPos = Math.max(selectionStart - 2, currentLineStart)
          textarea.setSelectionRange(newPos, newPos)
        }, 0)
      }
      return
    }

    // Ctrl+/ または Cmd+/: コメントアウト
    if (e.key === '/' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      const currentLine = lines[currentLineIndex]

      if (currentLine.trimStart().startsWith('//')) {
        // コメント解除
        lines[currentLineIndex] = currentLine.replace(/^(\s*)\/\/\s?/, '$1')
      } else {
        // コメント追加
        const indent = currentLine.match(/^\s*/)?.[0] || ''
        lines[currentLineIndex] = indent + '// ' + currentLine.trimStart()
      }

      const newValue = lines.join('\n')
      onChange(newValue)
      return
    }

    // Ctrl+D または Cmd+D: 行の複製
    if (e.key === 'd' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
      e.preventDefault()
      const currentLine = lines[currentLineIndex]
      lines.splice(currentLineIndex + 1, 0, currentLine)
      const newValue = lines.join('\n')
      onChange(newValue)
      setTimeout(() => {
        const newPos = currentLineStart + currentLine.length + 1
        textarea.setSelectionRange(newPos, newPos)
      }, 0)
      return
    }

    // Ctrl+Shift+K または Cmd+Shift+K: 行の削除
    if (e.key === 'K' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
      e.preventDefault()
      if (lines.length > 1) {
        lines.splice(currentLineIndex, 1)
        const newValue = lines.join('\n')
        onChange(newValue)
        setTimeout(() => {
          textarea.setSelectionRange(currentLineStart, currentLineStart)
        }, 0)
      } else {
        onChange('')
      }
      return
    }

    // Ctrl+Enter または Cmd+Enter: 下に新しい行を挿入
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      const lineEnd = currentLineStart + lines[currentLineIndex].length
      const newValue = value.substring(0, lineEnd) + '\n' + value.substring(lineEnd)
      onChange(newValue)
      setTimeout(() => {
        textarea.setSelectionRange(lineEnd + 1, lineEnd + 1)
      }, 0)
      return
    }
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
          ref={textareaRef}
          className="code-editor__textarea"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
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
