---
paths: app/**/*.{ts,vue}
---

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

# 実装ガイドライン

## TypeScript 型安全性

### 禁止事項

1. **`as any` の使用は禁止**
   - 型の問題は適切な型定義で解決する
   - 例外的に使用が必要な場合は、必ずユーザーに確認を取ること

2. **`as unknown` の使用も禁止**
   - 型変換は具体的な型定義で対応する
   - 適切なインターフェースや型定義を作成する

3. **`@ts-ignore` の使用禁止**
   - 型エラーは必ず解決する
   - 一時的な回避策も避ける

4. **`any` 型の直接使用禁止**
   - 適切な型を定義して使用
   - API レスポンスなどは適切に型定義する

5. **`// eslint-disable` の使用禁止**
   - ESLint ルールは遵守する
   - ルールの例外を設ける場合は、必ずユーザーに確認を取ること

### 推奨される型対応方法

```typescript
// ❌ 悪い例
const data = response as any
const data2 = response as unknown
const props = defineProps<any>()

// ✅ 良い例
interface ApiResponse {
  data: VillageView
}
const data = response as ApiResponse

// 具体的な型定義を作成
interface CustomProps {
  villageId: string
  isActive: boolean
}
const props = defineProps<CustomProps>()
```

## API 通信

詳細は[API使用ガイドライン](docs/guidelines/api-usage-guidelines.md)を参照

## API 型定義

詳細は[API型定義ガイドライン](docs/guidelines/api-types-guidelines.md)を参照

## 開発サーバー

- **ポート**: 3011
- **起動コマンド**: `pnpm dev`
- **URL**: http://localhost:3011

## storeを直接使用しない

参照であっても必ずcomposables経由で使用する
