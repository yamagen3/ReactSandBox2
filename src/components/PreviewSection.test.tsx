import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PreviewSection } from './PreviewSection'

describe('PreviewSection', () => {
  it('プレビューヘッダーが表示される', () => {
    render(<PreviewSection code="test code" />)
    expect(screen.getByText('プレビュー')).toBeInTheDocument()
  })

  it('プレビューコンテナが表示される', () => {
    render(<PreviewSection code="test code" />)
    const container = screen.getByTestId('preview-container')
    expect(container).toBeInTheDocument()
  })
})
