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
  const [editorWidth, setEditorWidth] = useState(70) // デスクトップ用パーセンテージ
  const [editorHeight, setEditorHeight] = useState(50) // モバイル用パーセンテージ
  const [isResizing, setIsResizing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // 画面サイズの変更を検出
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isResizing || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()

      if (isMobile) {
        // モバイル: 縦方向のリサイズ
        // クライアント座標を制限して範囲外に出ないようにする
        const clampedY = Math.max(containerRect.top, Math.min(clientY, containerRect.bottom))
        const newHeight = ((clampedY - containerRect.top) / containerRect.height) * 100
        // 20%〜80%の範囲に制限
        const clampedHeight = Math.max(20, Math.min(80, newHeight))
        setEditorHeight(clampedHeight)
      } else {
        // デスクトップ: 横方向のリサイズ
        // クライアント座標を制限して範囲外に出ないようにする
        const clampedX = Math.max(containerRect.left, Math.min(clientX, containerRect.right))
        const newWidth = ((clampedX - containerRect.left) / containerRect.width) * 100
        // 20%〜80%の範囲に制限
        const clampedWidth = Math.max(20, Math.min(80, newWidth))
        setEditorWidth(clampedWidth)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleEnd = () => {
      setIsResizing(false)
      // ドラッグ終了時にテキスト選択を再度有効化
      document.body.style.userSelect = ''
    }

    if (isResizing) {
      // ドラッグ中はテキスト選択を無効化
      document.body.style.userSelect = 'none'

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleEnd)
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleEnd)
      // クリーンアップ時にもテキスト選択を再度有効化
      document.body.style.userSelect = ''
    }
  }, [isResizing, isMobile])

  const handleResizerStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const editorStyle = isMobile
    ? { height: `${editorHeight}%` }
    : { width: `${editorWidth}%` }

  const previewStyle = isMobile
    ? { height: `${100 - editorHeight}%` }
    : { width: `${100 - editorWidth}%` }

  return (
    <div className="app">
      <header className="app__header">
        <h1>React Sandbox</h1>
        <p>お手本を見ながら React を練習しよう</p>
      </header>
      <div
        className={`app__container ${isMobile ? 'app__container--mobile' : ''}`}
        ref={containerRef}
      >
        <div
          className="app__editor-area"
          data-testid="editor-area"
          style={editorStyle}
        >
          <CodeEditor
            value={practiceCode}
            onChange={setPracticeCode}
            title="練習エディタ"
            exampleCode={EXAMPLE_CODE}
          />
        </div>
        <div
          className={`app__resizer ${isMobile ? 'app__resizer--mobile' : ''}`}
          data-testid="resizer"
          onMouseDown={handleResizerStart}
          onTouchStart={handleResizerStart}
        />
        <div
          className="app__preview"
          style={previewStyle}
        >
          <PreviewSection code={practiceCode} />
        </div>
      </div>
    </div>
  )
}

export default App
