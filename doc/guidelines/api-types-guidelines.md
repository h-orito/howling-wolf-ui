# API型定義ガイドライン

## 概要

OpenAPI定義から自動生成される型定義の正しい使用方法について説明します。

## 型定義の生成

```bash
# API型定義を生成
pnpm generate:api-types
```

生成される型定義: `app/lib/api/types.ts`

## 使用ルール

### ✅ 推奨: ラッパー型を `lib/api/types.ts` に定義してから使用

```typescript
// app/lib/api/village.ts
import type { components } from './types'

export type VillageView = components['schemas']['VillageView']
export type VillageRegisterBody = components['schemas']['VillageRegisterBody']
```

```typescript
// Vue コンポーネントで使用
import type { VillageView } from '~/lib/api/village'

const village = ref<VillageView>()
```

### ❌ 禁止: 自動生成型を直接使用

```typescript
// 悪い例 - componentsを直接使用
import type { components } from '~/lib/api/types'
const village = ref<components['schemas']['VillageView']>()
```

## API通信での型安全性

### useApiコンポーザブル使用時の型注釈（推奨）

```typescript
// useApiを使用した型安全な通信
const { apiCall } = useApi()
const village = await apiCall<VillageView>('/villages', {
  method: 'POST',
  body: body as VillageRegisterBody
})
```

**注意**: 直接$fetchを使用せず、必ずuseApiコンポーザブルのapiCallメソッドを使用してください。

### Pinia Storeでの使用

```typescript
// stores/village.ts
import type { VillageView } from '~/lib/api/types'

export const useVillageStore = defineStore('village', () => {
  const villages = ref<VillageView[]>([])
  const { apiCall } = useApi()

  const fetchVillages = async () => {
    try {
      const data = await apiCall<VillageView[]>('/villages')
      villages.value = data
    } catch (error) {
      console.error('Failed to fetch villages:', error)
    }
  }

  return { villages, fetchVillages }
})
```

## 型定義の更新管理

1. **API型定義の再生成**: ユーザーが必要と判断した時に `pnpm generate:api-types` を実行
2. **型エラー発生時**: API仕様書との整合性を確認し、必要に応じてユーザーに再生成を依頼

## 重要事項

- 自動生成される型定義ファイル（schema.ts）は直接編集しない
