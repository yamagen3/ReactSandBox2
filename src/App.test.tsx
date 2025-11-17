import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  describe('基本的なレンダリング', () => {
    it('タイトルが表示される', () => {
      render(<App />)
      expect(screen.getByText('React Sandbox')).toBeInTheDocument()
    })

    it('練習エディタが表示される', () => {
      render(<App />)
      expect(screen.getByText('練習エディタ')).toBeInTheDocument()
    })

    it('プレビューが表示される', () => {
      render(<App />)
      expect(screen.getByText('プレビュー')).toBeInTheDocument()
    })
  })

  describe('リサイザブル機能（react-resizable-panels）', () => {
    it('境界線（リサイザー）が表示される', () => {
      render(<App />)
      const resizer = screen.getByTestId('resizer')
      expect(resizer).toBeInTheDocument()
    })

    it('エディタ領域が表示される', () => {
      render(<App />)
      const editorArea = screen.getByTestId('editor-area')
      expect(editorArea).toBeInTheDocument()
    })

    it('リサイザーがPanelResizeHandleコンポーネントとして機能する', () => {
      render(<App />)
      const resizer = screen.getByTestId('resizer')
      // react-resizable-panelsはdata-resize-handle-state属性を追加する
      expect(resizer).toHaveClass('app__resizer')
    })
  })
})
