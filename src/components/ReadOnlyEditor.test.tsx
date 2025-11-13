import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReadOnlyEditor } from './ReadOnlyEditor'

describe('ReadOnlyEditor', () => {
  it('テキストエリアが表示される', () => {
    render(<ReadOnlyEditor value="test code" />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeInTheDocument()
  })

  it('渡された値が表示される', () => {
    const sampleCode = 'function Example() { return <div>Hello</div> }'
    render(<ReadOnlyEditor value={sampleCode} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue(sampleCode)
  })

  it('読み取り専用である', () => {
    render(<ReadOnlyEditor value="test" />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('readonly')
  })

  it('タイトルが表示される', () => {
    render(<ReadOnlyEditor value="test" title="お手本コード" />)
    expect(screen.getByText('お手本コード')).toBeInTheDocument()
  })

  it('デフォルトタイトルが表示される', () => {
    render(<ReadOnlyEditor value="test" />)
    expect(screen.getByText('お手本')).toBeInTheDocument()
  })
})
