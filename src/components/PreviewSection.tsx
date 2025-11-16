import React from 'react'
import { Preview } from './Preview'
import './PreviewSection.css'

interface PreviewSectionProps {
  code: string
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({ code }) => {
  return (
    <div className="preview-section">
      <div className="preview-section__header">
        プレビュー
      </div>
      <div className="preview-section__content">
        <Preview code={code} />
      </div>
    </div>
  )
}
