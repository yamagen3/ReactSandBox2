# React Sandbox - 仕様書

## プロジェクト概要

React を静的環境で練習できる Sandbox アプリケーション。
ユーザーが React コンポーネントをブラウザ上で編集し、リアルタイムでプレビューできる。

## 技術スタック

- **フレームワーク**: React 18
- **ビルドツール**: Vite
- **言語**: TypeScript
- **テスト**: Vitest + React Testing Library
- **デプロイ**: GitHub Pages
- **CI/CD**: GitHub Actions

## 機能要件

### 1. コードエディタ
- **FR-001**: ユーザーは JSX/React コードを入力できる
- **FR-002**: シンタックスハイライトが表示される
- **FR-003**: 複数行のコード入力が可能

### 2. プレビュー機能
- **FR-004**: 入力したコードがリアルタイムでプレビューされる
- **FR-005**: エラーが発生した場合、エラーメッセージを表示する
- **FR-006**: プレビューは独立した領域に表示される

### 3. レイアウト
- **FR-007**: 画面は左右2分割（エディタ/プレビュー）
- **FR-008**: レスポンシブデザイン対応

### 4. サンプルコード
- **FR-009**: 初期表示時にサンプルコードが表示される
- **FR-010**: ユーザーが編集可能

## 非機能要件

### パフォーマンス
- **NFR-001**: コード変更から 500ms 以内にプレビュー更新
- **NFR-002**: 初回ロード時間は 3 秒以内

### セキュリティ
- **NFR-003**: XSS 攻撃を防ぐため、コード実行は iframe で分離
- **NFR-004**: ユーザー入力のサニタイズ

### 保守性
- **NFR-005**: テストカバレッジ 80% 以上
- **NFR-006**: ESLint によるコード品質管理

## UI コンポーネント構成

```
App
├── Editor (左側)
│   └── CodeEditor
│       └── textarea
└── Preview (右側)
    └── PreviewFrame
        └── iframe
```

## データフロー

1. ユーザーがコードを入力
2. state が更新される
3. PreviewFrame が state の変更を検知
4. iframe 内でコードを実行
5. 結果を表示（またはエラー表示）

## 開発方針

- **Spec-Driven**: 仕様を先に定義し、仕様に基づいて開発
- **TDD**: テストファースト、Red → Green → Refactor
- **継続的デプロイ**: main ブランチへのマージで自動デプロイ

## テスト戦略

### 単体テスト
- 各コンポーネントの振る舞いをテスト
- エッジケース（空文字、エラー含むコード）のテスト

### 統合テスト
- コード入力からプレビュー表示までのフロー

## CI/CD パイプライン

```yaml
Trigger: Push to main / PR
└── Jobs:
    ├── Lint (ESLint)
    ├── Test (Vitest)
    ├── Build (Vite)
    └── Deploy (GitHub Pages) - main のみ
```

## デプロイ設定

- **Base Path**: `/ReactSandBox2/`
- **Asset Path**: 相対パス
- **404 Handling**: SPA 対応

## 初期サンプルコード

```jsx
function Welcome() {
  return <h1>Hello, React Sandbox!</h1>
}

export default Welcome
```
