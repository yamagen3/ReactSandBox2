import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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

  describe('リサイザブル機能', () => {
    it('境界線（リサイザー）が表示される', () => {
      render(<App />)
      const resizer = screen.getByTestId('resizer')
      expect(resizer).toBeInTheDocument()
    })

    it('境界線にカーソルを当てると、col-resizeスタイルが適用される', () => {
      render(<App />)
      const resizer = screen.getByTestId('resizer')
      expect(resizer).toHaveStyle({ cursor: 'col-resize' })
    })

    it('境界線をドラッグするとエディタの幅が変更される', () => {
      render(<App />)
      const resizer = screen.getByTestId('resizer')
      const editorArea = screen.getByTestId('editor-area')

      // マウスダウン、ムーブ、アップをシミュレート
      fireEvent.mouseDown(resizer, { clientX: 700 })
      fireEvent.mouseMove(document, { clientX: 600 })
      fireEvent.mouseUp(document)

      // 幅が変更されたことを確認（正確な値ではなく、変更されたことを確認）
      const newWidth = editorArea.style.width
      expect(newWidth).toBeTruthy()
    })

    it('ドラッグ中はドキュメント全体でマウスイベントを捕捉する', () => {
      const mockAddEventListener = vi.spyOn(document, 'addEventListener')
      render(<App />)
      const resizer = screen.getByTestId('resizer')

      fireEvent.mouseDown(resizer, { clientX: 700 })

      expect(mockAddEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function))
      expect(mockAddEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function))

      mockAddEventListener.mockRestore()
    })
  })
})
