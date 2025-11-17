import React, { useEffect, useRef, useState } from 'react'
import './Preview.css'

interface PreviewProps {
  code: string
  error?: string
}

export const Preview: React.FC<PreviewProps> = ({ code, error }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [debouncedCode, setDebouncedCode] = useState(code)

  // デバウンス処理：入力が止まってから500ms後に更新
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCode(code)
    }, 500)

    return () => clearTimeout(timer)
  }, [code])

  useEffect(() => {
    if (!debouncedCode || error) return

    const iframe = iframeRef.current
    if (!iframe) return

    const document = iframe.contentDocument
    if (!document) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            body {
              margin: 0;
              padding: 16px;
              font-family: system-ui, -apple-system, sans-serif;
            }
            #root {
              width: 100%;
              height: 100%;
            }
          </style>
        </head>
        <body>
          <div id="root">Loading...</div>
          <script type="text/babel">
            (function() {
              try {
                // React と ReactDOM の読み込み確認
                if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
                  document.getElementById('root').innerHTML =
                    '<div style="color: red; padding: 16px;">React ライブラリの読み込みに失敗しました</div>';
                  return;
                }

                const { useState, useEffect } = React;

                ${debouncedCode}

                const rootElement = document.getElementById('root');
                const root = ReactDOM.createRoot(rootElement);

                // デフォルトエクスポートがある場合はそれを使用
                if (typeof App !== 'undefined') {
                  root.render(React.createElement(App));
                } else if (typeof Welcome !== 'undefined') {
                  root.render(React.createElement(Welcome));
                } else {
                  root.render(React.createElement('div', null, 'コンポーネントが定義されていません'));
                }
              } catch (err) {
                console.error('Preview Error:', err);
                const rootEl = document.getElementById('root');
                if (rootEl) {
                  rootEl.innerHTML =
                    '<div style="color: red; padding: 16px; white-space: pre-wrap;">エラー: ' +
                    err.message +
                    (err.stack ? '\\n\\n' + err.stack : '') +
                    '</div>';
                }
              }
            })();
          </script>
        </body>
      </html>
    `

    document.open()
    document.write(htmlContent)
    document.close()
  }, [debouncedCode, error])

  if (error) {
    return (
      <div className="preview" data-testid="preview-container">
        <div className="preview__error">
          <h3>エラー</h3>
          <pre>{error}</pre>
        </div>
      </div>
    )
  }

  if (!code) {
    return (
      <div className="preview" data-testid="preview-container">
        <div className="preview__empty">
          コードを入力してください
        </div>
      </div>
    )
  }

  return (
    <div className="preview" data-testid="preview-container">
      <iframe
        ref={iframeRef}
        className="preview__iframe"
        title="Preview"
        sandbox="allow-scripts allow-same-origin"
        data-testid="preview-iframe"
      />
    </div>
  )
}
