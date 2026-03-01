# コードスタイルガイドライン

## 概要

このプロジェクトのコードスタイルは、以下の設定ファイルで管理されています。

## 設定ファイル

### エディタ設定

- **`.editorconfig`**: エディタ共通の基本設定
  - インデント: スペース2つ
  - 文字コード: UTF-8
  - 改行コード: LF
  - 末尾の空白: 自動削除
  - 最終行に改行: あり

### コードフォーマット

- **`.prettierrc`**: Prettierによる自動フォーマット設定
  - セミコロン: なし
  - クォート: シングルクォート
  - トレイリングカンマ: なし
  - 括弧のスペース: なし

### リンティング

- **`eslint.config.js`**: ESLintによるコード品質チェック
  - TypeScript strict mode対応
  - Vue 3 Composition API対応
  - Nuxt 4推奨ルール適用

## コマンド

```bash
# リント実行
pnpm lint

# 自動修正付きリント
pnpm lint --fix

# フォーマット実行
pnpm format

# 型チェック
pnpm type-check
```

## 重要事項

- **コミット前には必ず以下を実行**:

  ```bash
  pnpm lint && pnpm format && pnpm type-check
  ```

- 設定ファイルの内容を直接変更する場合は、チーム全体での合意が必要です
- VSCode使用時は、推奨拡張機能（ESLint、Prettier、EditorConfig）をインストールしてください
