import { useState } from 'react'
import { CodeEditor } from './components/CodeEditor'
import { ReadOnlyEditor } from './components/ReadOnlyEditor'
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

  return (
    <div className="app">
      <header className="app__header">
        <h1>React Sandbox</h1>
        <p>お手本を見ながら React を練習しよう</p>
      </header>
      <div className="app__container">
        <div className="app__editors">
          <div className="app__example">
            <ReadOnlyEditor value={EXAMPLE_CODE} title="お手本" />
          </div>
          <div className="app__practice">
            <CodeEditor value={practiceCode} onChange={setPracticeCode} title="練習エディタ" />
          </div>
        </div>
        <div className="app__preview">
          <PreviewSection exampleCode={EXAMPLE_CODE} practiceCode={practiceCode} />
        </div>
      </div>
    </div>
  )
}

export default App
