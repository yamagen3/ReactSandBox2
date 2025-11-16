import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CodeEditor } from './CodeEditor'

describe('CodeEditor', () => {
  it('テキストエリアが表示される', () => {
    render(<CodeEditor value="" onChange={() => {}} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeInTheDocument()
  })

  it('初期値が表示される', () => {
    const initialCode = 'function Hello() { return <div>Hello</div> }'
    render(<CodeEditor value={initialCode} onChange={() => {}} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue(initialCode)
  })

  it('テキスト入力時にonChangeが呼ばれる', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<CodeEditor value="" onChange={handleChange} />)

    const textarea = screen.getByRole('textbox')
    await user.type(textarea, 'test')

    expect(handleChange).toHaveBeenCalled()
  })

  it('複数行のコードを入力できる', () => {
    const multilineCode = `function App() {
  return (
    <div>Hello</div>
  )
}`
    render(<CodeEditor value={multilineCode} onChange={() => {}} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue(multilineCode)
  })

  it('プレースホルダーが表示される', () => {
    render(<CodeEditor value="" onChange={() => {}} />)
    const textarea = screen.getByPlaceholderText(/React コードを入力/)
    expect(textarea).toBeInTheDocument()
  })

  describe('透過オーバーレイ機能', () => {
    it('exampleCodeが渡された場合、お手本表示ボタンが表示される', () => {
      render(<CodeEditor value="" onChange={() => {}} exampleCode="const example = true" />)
      const button = screen.getByRole('button', { name: /お手本を表示/ })
      expect(button).toBeInTheDocument()
    })

    it('exampleCodeがない場合、ボタンは表示されない', () => {
      render(<CodeEditor value="" onChange={() => {}} />)
      const button = screen.queryByRole('button', { name: /お手本を表示/ })
      expect(button).not.toBeInTheDocument()
    })

    it('ボタンをクリックするとオーバーレイが表示される', async () => {
      const user = userEvent.setup()
      const exampleCode = 'function Example() { return <div>Test</div> }'
      render(<CodeEditor value="" onChange={() => {}} exampleCode={exampleCode} />)

      const button = screen.getByRole('button', { name: /お手本を表示/ })
      await user.click(button)

      const overlay = screen.getByText(/Example/)
      expect(overlay).toBeInTheDocument()
    })

    it('もう一度クリックするとオーバーレイが非表示になる', async () => {
      const user = userEvent.setup()
      const exampleCode = 'function Example() { return <div>Test</div> }'
      render(<CodeEditor value="" onChange={() => {}} exampleCode={exampleCode} />)

      const button = screen.getByRole('button', { name: /お手本を表示/ })

      // 表示
      await user.click(button)
      expect(screen.getByText(/Example/)).toBeInTheDocument()

      // 非表示
      await user.click(button)
      expect(screen.queryByText(/Example/)).not.toBeInTheDocument()
    })
  })
})
