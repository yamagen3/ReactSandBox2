import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PreviewSection } from './PreviewSection'

describe('PreviewSection', () => {
  it('タブが表示される', () => {
    render(<PreviewSection exampleCode="example" practiceCode="practice" />)
    expect(screen.getByText('お手本を表示')).toBeInTheDocument()
    expect(screen.getByText('練習を表示')).toBeInTheDocument()
  })

  it('デフォルトで練習プレビューが表示される', () => {
    render(<PreviewSection exampleCode="example" practiceCode="practice" />)
    const practiceTab = screen.getByText('練習を表示')
    expect(practiceTab.closest('button')).toHaveClass('preview-section__tab--active')
  })

  it('お手本タブをクリックするとお手本プレビューに切り替わる', async () => {
    const user = userEvent.setup()
    render(<PreviewSection exampleCode="example" practiceCode="practice" />)

    const exampleTab = screen.getByText('お手本を表示')
    await user.click(exampleTab)

    expect(exampleTab.closest('button')).toHaveClass('preview-section__tab--active')
  })

  it('練習タブをクリックすると練習プレビューに切り替わる', async () => {
    const user = userEvent.setup()
    render(<PreviewSection exampleCode="example" practiceCode="practice" />)

    // まずお手本に切り替え
    await user.click(screen.getByText('お手本を表示'))
    // 練習に戻す
    await user.click(screen.getByText('練習を表示'))

    const practiceTab = screen.getByText('練習を表示')
    expect(practiceTab.closest('button')).toHaveClass('preview-section__tab--active')
  })
})
