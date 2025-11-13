import { useState } from 'react'
import { CodeEditor } from './components/CodeEditor'
import { Preview } from './components/Preview'
import './App.css'

const INITIAL_CODE = `function Welcome() {
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

function App() {
  const [code, setCode] = useState(INITIAL_CODE)

  return (
    <div className="app">
      <header className="app__header">
        <h1>React Sandbox</h1>
        <p>React を練習しよう</p>
      </header>
      <div className="app__container">
        <div className="app__editor">
          <h2 className="app__section-title">エディタ</h2>
          <CodeEditor value={code} onChange={setCode} />
        </div>
        <div className="app__preview">
          <h2 className="app__section-title">プレビュー</h2>
          <Preview code={code} />
        </div>
      </div>
    </div>
  )
}

export default App
