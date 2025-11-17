# React Sandbox - 仕様書

## プロジェクト概要

React を静的環境で練習できる Sandbox アプリケーション。
ユーザーが React コンポーネントをブラウザ上で編集し、リアルタイムでプレビューできる。
お手本コードを参照しながら、VSCode 風のショートカットを使って快適に React を学習できる。

## 技術スタック

- **フレームワーク**: React 18
- **ビルドツール**: Vite
- **言語**: TypeScript
- **テスト**: Vitest + React Testing Library
- **デプロイ**: GitHub Pages
- **CI/CD**: GitHub Actions
- **UI ライブラリ**: react-resizable-panels (リサイザブル UI)

## 機能要件

### 1. コードエディタ
- **FR-001**: ユーザーは JSX/React コードを入力できる
- **FR-002**: 複数行のコード入力が可能
- **FR-003**: VSCode 風ショートカットをサポート
  - Tab: インデント追加（2スペース）
  - Shift+Tab: インデント削除
  - Ctrl+/ (Cmd+/): 行のコメントアウト/解除
  - Ctrl+D (Cmd+D): 現在行の複製
  - Ctrl+Shift+K (Cmd+Shift+K): 現在行の削除
  - Ctrl+Enter (Cmd+Enter): 下に新しい行を挿入
- **FR-004**: お手本コード表示機能
  - ボタンでお手本コードの表示/非表示を切り替え
  - お手本は入力欄の背景に半透明で表示（40%透明度）
  - 入力欄の入力は継続可能

### 2. プレビュー機能
- **FR-005**: 入力したコードがリアルタイムでプレビューされる
- **FR-006**: デバウンス処理（500ms）により、入力中の頻繁な更新を防ぐ
- **FR-007**: エラーが発生した場合、エラーメッセージを表示する
- **FR-008**: プレビューは独立した領域に表示される
- **FR-009**: iframe 内で安全にコードを実行

### 3. レイアウト・UI
- **FR-010**: リサイザブル 2 分割レイアウト
  - デスクトップ: 横並び（左：エディタ 70% / 右：プレビュー 30%）
  - モバイル: 縦並び（上：エディタ 50% / 下：プレビュー 50%）
  - リサイザーをドラッグして比率を変更可能（20% ~ 80%）
- **FR-011**: レスポンシブデザイン対応
  - 768px 以下: モバイルレイアウト（縦並び）
  - 769px ~ 1024px: タブレット対応
  - 1025px 以上: デスクトップレイアウト（横並び）
- **FR-012**: タッチデバイス対応
  - タッチでリサイザーを操作可能
  - タッチしやすいボタンサイズ（最小 32px）

### 4. サンプルコード
- **FR-013**: 初期表示時にサンプルコードが表示される
- **FR-014**: ユーザーが編集可能
- **FR-015**: お手本コードを提供

## 非機能要件

### パフォーマンス
- **NFR-001**: コード変更から 500ms 後にプレビュー更新（デバウンス）
- **NFR-002**: 初回ロード時間は 3 秒以内
- **NFR-003**: スムーズなリサイズ操作

### セキュリティ
- **NFR-004**: XSS 攻撃を防ぐため、コード実行は iframe で分離
- **NFR-005**: iframe に sandbox 属性（allow-scripts, allow-same-origin）を設定
- **NFR-006**: ユーザー入力のサニタイズ

### アクセシビリティ
- **NFR-007**: キーボード操作でリサイザーを操作可能
- **NFR-008**: スクリーンリーダー対応
- **NFR-009**: ARIA 属性の適切な設定

### 保守性
- **NFR-010**: テストカバレッジ 80% 以上
- **NFR-011**: ESLint によるコード品質管理
- **NFR-012**: コンポーネントの責務を明確に分離

## UI コンポーネント構成

```
App
├── Header (ヘッダー)
│   ├── Title: "React Sandbox"
│   └── Subtitle: "お手本を見ながら React を練習しよう"
└── PanelGroup (react-resizable-panels)
    ├── Panel (エディタ側)
    │   └── CodeEditor
    │       ├── Header
    │       │   ├── Title: "練習エディタ"
    │       │   └── OverlayButton: "👁️ お手本を表示"
    │       └── Content
    │           ├── Textarea (入力欄・z-index: 2)
    │           └── Overlay (お手本表示・z-index: 1)
    │               └── Pre (お手本コード・40%透明度)
    ├── PanelResizeHandle (リサイザー)
    └── Panel (プレビュー側)
        └── PreviewSection
            ├── Header: "プレビュー"
            └── Preview
                └── iframe (サンドボックス実行環境)
```

### コンポーネント詳細

#### App (src/App.tsx)
- **責務**: アプリケーション全体の状態管理とレイアウト
- **状態**:
  - `practiceCode`: ユーザーが入力したコード
  - `isMobile`: モバイルレイアウトかどうか
- **ライブラリ**: react-resizable-panels (PanelGroup, Panel, PanelResizeHandle)

#### CodeEditor (src/components/CodeEditor.tsx)
- **責務**: コード入力とお手本表示
- **Props**:
  - `value`: 現在のコード
  - `onChange`: コード変更時のコールバック
  - `title`: エディタのタイトル
  - `exampleCode`: お手本コード
- **状態**:
  - `showOverlay`: お手本表示の ON/OFF
- **機能**:
  - VSCode 風ショートカット処理
  - お手本の透過表示

#### Preview (src/components/Preview.tsx)
- **責務**: コードのプレビュー表示
- **Props**:
  - `code`: 実行するコード
  - `error`: エラーメッセージ
- **状態**:
  - `debouncedCode`: デバウンス処理されたコード
- **機能**:
  - 500ms のデバウンス処理
  - iframe 内での安全なコード実行
  - Babel Standalone による JSX トランスパイル

#### PreviewSection (src/components/PreviewSection.tsx)
- **責務**: プレビュー領域のラッパー
- **Props**:
  - `code`: 実行するコード

## データフロー

### コード入力からプレビュー表示まで

1. **入力**: ユーザーが CodeEditor の textarea にコードを入力
2. **状態更新**: onChange イベントで App の `practiceCode` state が更新
3. **デバウンス**: Preview コンポーネントで 500ms のデバウンス処理
4. **トランスパイル**: Babel Standalone が JSX を JavaScript に変換
5. **実行**: iframe 内で変換されたコードを実行
6. **表示**: ReactDOM.createRoot で結果をレンダリング
7. **エラー処理**: エラーが発生した場合はエラーメッセージを表示

### リサイズ操作

1. **検出**: PanelResizeHandle でマウス/タッチイベントを検出
2. **計算**: react-resizable-panels が新しいサイズを計算
3. **適用**: Panel のサイズが更新される
4. **制約**: minSize(20%) と maxSize(80%) の範囲内に制限

### レスポンシブ切り替え

1. **監視**: window.innerWidth を監視
2. **判定**: 768px 以下かどうかを判定
3. **切り替**: PanelGroup の direction を 'horizontal' または 'vertical' に変更
4. **リフロー**: レイアウトが自動的に再計算される

## 開発方針

- **Spec-Driven**: 仕様を先に定義し、仕様に基づいて開発
- **TDD**: テストファースト、Red → Green → Refactor
- **継続的デプロイ**: main ブランチへのマージで自動デプロイ

## テスト戦略

### 単体テスト (32 tests)
- **CodeEditor**: 15 tests
  - 基本的な入力機能
  - お手本表示機能（4 tests）
  - VSCode 風ショートカット（6 tests）
- **Preview**: 4 tests
  - プレビュー表示
  - エラー処理
  - 空コード処理
- **PreviewSection**: 2 tests
- **ReadOnlyEditor**: 5 tests
- **App**: 6 tests
  - 基本レンダリング（3 tests）
  - リサイザブル機能（3 tests）

### テストカバレッジ
- **目標**: 80% 以上
- **現状**: 全 32 テストが合格

### テストツール
- **Vitest**: テストランナー
- **React Testing Library**: コンポーネントテスト
- **@testing-library/user-event**: ユーザーインタラクションシミュレーション

## CI/CD パイプライン

```yaml
Trigger: Push to any branch / Pull Request
└── Jobs:
    ├── 1. Lint (ESLint)
    │   └── コード品質チェック
    ├── 2. Test (Vitest)
    │   └── 全 32 テストを実行
    ├── 3. Build (Vite)
    │   └── プロダクションビルド
    └── 4. Deploy (GitHub Pages)
        └── main ブランチのみ自動デプロイ
```

### ワークフロー詳細
- **トリガー**: `push` または `pull_request`
- **並列実行**: lint と test を並列実行
- **Node バージョン**: 18.x
- **キャッシュ**: npm dependencies

## デプロイ設定

- **Base Path**: `/ReactSandBox2/`
- **Asset Path**: 相対パス
- **404 Handling**: SPA 対応
- **デプロイ先**: GitHub Pages
- **URL**: `https://<username>.github.io/ReactSandBox2/`

## 初期サンプルコード

### お手本コード (EXAMPLE_CODE)
```jsx
function Welcome() {
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

const App = Welcome
```

### 練習用初期コード (INITIAL_PRACTICE_CODE)
```jsx
function Welcome() {
  // ここにコードを入力してください
  return (
    <div>
      <h1>練習中...</h1>
    </div>
  )
}

const App = Welcome
```

## セキュリティ考慮事項

### iframe サンドボックス
- **属性**: `sandbox="allow-scripts allow-same-origin"`
- **制限事項**:
  - フォーム送信不可
  - ポップアップ不可
  - トップレベルナビゲーション不可
- **許可事項**:
  - JavaScript 実行（allow-scripts）
  - 同一オリジン API アクセス（allow-same-origin）

### XSS 対策
- ユーザー入力は直接 DOM に挿入せず、iframe 内で実行
- Babel Standalone によるトランスパイルで、構文エラーを検出
- エラー発生時は安全にエラーメッセージを表示

## パフォーマンス最適化

### デバウンス処理
- **目的**: 入力中の頻繁なプレビュー更新を防ぐ
- **実装**: 500ms のデバウンス
- **効果**: Loading 表示の頻度を削減、CPU 使用率を低減

### ライブラリの選定
- **react-resizable-panels**:
  - プロダクショングレードの堅牢性
  - 最適化されたレンダリング
  - アクセシビリティサポート

## 今後の拡張可能性

### 実装済み
- [x] コードエディタ
- [x] リアルタイムプレビュー
- [x] リサイザブル UI
- [x] VSCode 風ショートカット
- [x] お手本表示機能
- [x] レスポンシブ対応
- [x] タッチデバイス対応

### 今後の検討事項
- [ ] コード保存機能（localStorage）
- [ ] 複数タブ対応
- [ ] コードのエクスポート/インポート
- [ ] シンタックスハイライト強化
- [ ] オートコンプリート
- [ ] コードフォーマッター統合
- [ ] ダークモード対応
- [ ] 多言語対応（i18n）
