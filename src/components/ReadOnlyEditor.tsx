import React from 'react'
import './ReadOnlyEditor.css'

interface ReadOnlyEditorProps {
  value: string
  title?: string
}

export const ReadOnlyEditor: React.FC<ReadOnlyEditorProps> = ({
  value,
  title = 'お手本'
}) => {
  return (
    <div className="readonly-editor">
      <div className="readonly-editor__header">
        {title}
      </div>
      <textarea
        className="readonly-editor__textarea"
        value={value}
        readOnly
        spellCheck={false}
      />
    </div>
  )
}
