import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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

  describe('VSCode風ショートカット機能', () => {
    it('Tabキーでインデントが追加される', () => {
      const handleChange = vi.fn()
      render(<CodeEditor value="test" onChange={handleChange} />)

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      textarea.setSelectionRange(0, 0)

      fireEvent.keyDown(textarea, { key: 'Tab', code: 'Tab' })

      expect(handleChange).toHaveBeenCalled()
      expect(handleChange).toHaveBeenCalledWith('  test')
    })

    it('Shift+Tabでインデントが削除される', () => {
      const handleChange = vi.fn()
      render(<CodeEditor value="  test" onChange={handleChange} />)

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      textarea.setSelectionRange(0, 0)

      fireEvent.keyDown(textarea, { key: 'Tab', code: 'Tab', shiftKey: true })

      expect(handleChange).toHaveBeenCalled()
      expect(handleChange).toHaveBeenCalledWith('test')
    })

    it('Ctrl+/でコメントアウトされる', () => {
      const handleChange = vi.fn()
      render(<CodeEditor value="const x = 1" onChange={handleChange} />)

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      textarea.setSelectionRange(0, 0)

      fireEvent.keyDown(textarea, { key: '/', code: 'Slash', ctrlKey: true })

      expect(handleChange).toHaveBeenCalled()
      expect(handleChange).toHaveBeenCalledWith('// const x = 1')
    })

    it('Ctrl+Dで現在行が複製される', () => {
      const handleChange = vi.fn()
      const testValue = 'const x = 1'
      render(<CodeEditor value={testValue} onChange={handleChange} />)

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      textarea.setSelectionRange(0, 0)

      fireEvent.keyDown(textarea, { key: 'd', code: 'KeyD', ctrlKey: true })

      expect(handleChange).toHaveBeenCalled()
      const expected = 'const x = 1\nconst x = 1'
      expect(handleChange).toHaveBeenCalledWith(expected)
    })

    it('Ctrl+Shift+Kで現在行が削除される', () => {
      const handleChange = vi.fn()
      const testValue = `line1
line2
line3`
      render(<CodeEditor value={testValue} onChange={handleChange} />)

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      // 2行目の先頭にカーソルを設定
      textarea.setSelectionRange(6, 6) // "line1\n"の後

      fireEvent.keyDown(textarea, { key: 'K', code: 'KeyK', ctrlKey: true, shiftKey: true })

      expect(handleChange).toHaveBeenCalled()
      const expected = `line1
line3`
      expect(handleChange).toHaveBeenCalledWith(expected)
    })

    it('Ctrl+Enterで改行が挿入される', () => {
      const handleChange = vi.fn()
      const testValue = 'test'
      render(<CodeEditor value={testValue} onChange={handleChange} />)

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      textarea.setSelectionRange(0, 0)

      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', ctrlKey: true })

      expect(handleChange).toHaveBeenCalled()
      const expected = 'test\n'
      expect(handleChange).toHaveBeenCalledWith(expected)
    })
  })
})
