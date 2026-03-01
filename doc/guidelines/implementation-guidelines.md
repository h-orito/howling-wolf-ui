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

詳細は[API使用ガイドライン](./api-usage-guidelines.md)を参照

## API 型定義

詳細は[API型定義ガイドライン](./api-types-guidelines.md)を参照

## 開発サーバー

- **ポート**: 3000
- **起動コマンド**: `pnpm dev`
- **URL**: http://localhost:3000

## storeを直接使用しない

参照であっても必ずcomposables経由で使用する
