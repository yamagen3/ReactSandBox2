import React, { useState } from 'react'
import { Preview } from './Preview'
import './PreviewSection.css'

interface PreviewSectionProps {
  exampleCode: string
  practiceCode: string
}

type TabType = 'example' | 'practice'

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  exampleCode,
  practiceCode
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('practice')

  const displayCode = activeTab === 'example' ? exampleCode : practiceCode

  return (
    <div className="preview-section">
      <div className="preview-section__tabs">
        <button
          className={`preview-section__tab ${
            activeTab === 'example' ? 'preview-section__tab--active' : ''
          }`}
          onClick={() => setActiveTab('example')}
        >
          お手本を表示
        </button>
        <button
          className={`preview-section__tab ${
            activeTab === 'practice' ? 'preview-section__tab--active' : ''
          }`}
          onClick={() => setActiveTab('practice')}
        >
          練習を表示
        </button>
      </div>
      <div className="preview-section__content">
        <Preview code={displayCode} />
      </div>
    </div>
  )
}
