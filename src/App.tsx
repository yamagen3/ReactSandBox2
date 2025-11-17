import { useState, useEffect } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
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
  const [isMobile, setIsMobile] = useState(false)

  // 画面サイズの変更を検出
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="app">
      <header className="app__header">
        <h1>React Sandbox</h1>
        <p>お手本を見ながら React を練習しよう</p>
      </header>
      <PanelGroup
        direction={isMobile ? 'vertical' : 'horizontal'}
        className="app__container"
      >
        <Panel
          defaultSize={70}
          minSize={20}
          maxSize={80}
          className="app__panel"
          data-testid="editor-area"
        >
          <CodeEditor
            value={practiceCode}
            onChange={setPracticeCode}
            title="練習エディタ"
            exampleCode={EXAMPLE_CODE}
          />
        </Panel>
        <PanelResizeHandle className="app__resizer" data-testid="resizer" />
        <Panel
          defaultSize={30}
          minSize={20}
          maxSize={80}
          className="app__panel"
        >
          <PreviewSection code={practiceCode} />
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default App
