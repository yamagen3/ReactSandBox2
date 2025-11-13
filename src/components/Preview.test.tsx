import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Preview } from './Preview'

describe('Preview', () => {
  it('プレビュー領域が表示される', () => {
    render(<Preview code="" />)
    const preview = screen.getByTestId('preview-container')
    expect(preview).toBeInTheDocument()
  })

  it('コードが空の場合、メッセージが表示される', () => {
    render(<Preview code="" />)
    expect(screen.getByText(/コードを入力してください/)).toBeInTheDocument()
  })

  it('有効なコードの場合、プレビューフレームが表示される', () => {
    const code = 'function App() { return <div>Hello</div> }'
    render(<Preview code={code} />)
    const iframe = screen.getByTestId('preview-iframe')
    expect(iframe).toBeInTheDocument()
  })

  it('エラーが発生した場合、エラーメッセージが表示される', () => {
    render(<Preview code="" error="Syntax Error" />)
    expect(screen.getByText(/Syntax Error/)).toBeInTheDocument()
  })
})
