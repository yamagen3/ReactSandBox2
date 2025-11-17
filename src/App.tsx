import { useState, useRef, useEffect } from 'react'
import { CodeEditor } from './components/CodeEditor'
import { PreviewSection } from './components/PreviewSection'
import './App.css'

const EXAMPLE_CODE = `function Welcome() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Hello, React Sandbox!</h1>
      <p>このサンドボックスでReactを練習しましょう。</p>
      <button
        onClick={() => setCount(count + 1)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#007acc',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        カウント: {count}
      </button>
    </div>
  )
}

// Appという名前でエクスポート（デフォルトで認識されます）
const App = Welcome
`

const INITIAL_PRACTICE_CODE = `function Welcome() {
  // ここにコードを入力してください
  return (
    <div>
      <h1>練習中...</h1>
    </div>
  )
}

const App = Welcome
`

function App() {
  const [practiceCode, setPracticeCode] = useState(INITIAL_PRACTICE_CODE)
  const [editorWidth, setEditorWidth] = useState(70) // パーセンテージ
  const [isResizing, setIsResizing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

      // 最小20%、最大80%に制限
      if (newWidth >= 20 && newWidth <= 80) {
        setEditorWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  const handleResizerMouseDown = () => {
    setIsResizing(true)
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>React Sandbox</h1>
        <p>お手本を見ながら React を練習しよう</p>
      </header>
      <div className="app__container" ref={containerRef}>
        <div
          className="app__editor-area"
          data-testid="editor-area"
          style={{ width: `${editorWidth}%` }}
        >
          <CodeEditor
            value={practiceCode}
            onChange={setPracticeCode}
            title="練習エディタ"
            exampleCode={EXAMPLE_CODE}
          />
        </div>
        <div
          className="app__resizer"
          data-testid="resizer"
          onMouseDown={handleResizerMouseDown}
        />
        <div
          className="app__preview"
          style={{ width: `${100 - editorWidth}%` }}
        >
          <PreviewSection code={practiceCode} />
        </div>
      </div>
    </div>
  )
}

export default App
