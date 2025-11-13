import React, { useEffect, useRef } from 'react'
import './Preview.css'

interface PreviewProps {
  code: string
  error?: string
}

export const Preview: React.FC<PreviewProps> = ({ code, error }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!code || error) return

    const iframe = iframeRef.current
    if (!iframe) return

    const document = iframe.contentDocument
    if (!document) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
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
          <div id="root"></div>
          <script type="text/babel">
            const { useState, useEffect } = React;

            try {
              ${code}

              const rootElement = document.getElementById('root');
              const root = ReactDOM.createRoot(rootElement);

              // デフォルトエクスポートがある場合はそれを使用
              if (typeof App !== 'undefined') {
                root.render(<App />);
              } else if (typeof Welcome !== 'undefined') {
                root.render(<Welcome />);
              } else {
                root.render(<div>コンポーネントが定義されていません</div>);
              }
            } catch (err) {
              document.getElementById('root').innerHTML =
                '<div style="color: red; padding: 16px;">エラー: ' + err.message + '</div>';
            }
          </script>
        </body>
      </html>
    `

    document.open()
    document.write(htmlContent)
    document.close()
  }, [code, error])

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
        sandbox="allow-scripts"
        data-testid="preview-iframe"
      />
    </div>
  )
}
