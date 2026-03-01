# API使用ガイドライン

## 重要: API呼び出しの方法

### ❌ 使用禁止

```typescript
// $fetchを直接使用しない
const response = await $fetch<ResponseType>('/api/endpoint')
const response = await $fetch<ResponseType>(
  `${config.public.apiBaseUrl}/endpoint`
)
```

### ✅ 正しい使用方法

```typescript
// 必ずuseApiコンポーザブルを使用する
const { apiCall } = useApi()
const data = await apiCall<ResponseType>('/endpoint')

// データの取得
if (data) {
  // データを処理
  myData.value = data
}
```

## useApiの利点

1. **自動的なベースURL設定**: `useRuntimeConfig()`の設定を自動的に使用
2. **認証ヘッダー**: Firebase認証トークンを自動的に付与
3. **エラーハンドリング**: 統一されたエラー処理とログ出力
4. **型安全性**: TypeScriptの型推論が効く
5. **インターセプター機能**: リクエスト・レスポンスの共通処理

## 使用例

### 基本的な使用例

```typescript
// ページコンポーネントでの使用
const { apiCall } = useApi()
const charachips = await apiCall<CharachipsView>('/charachip/list')
if (charachips) {
  charachipList.value = charachips.list || []
}
```

### エラーハンドリング付きの例

```typescript
const { apiCall } = useApi()
try {
  const village = await apiCall<VillageView>('/village/1')
  // 正常処理
  villageData.value = village
} catch (error) {
  console.error('データ取得エラー:', error)
  // エラー処理
}
```

### POSTリクエストの例

```typescript
const { apiCall } = useApi()
try {
  const result = await apiCall<VillageView>('/village', {
    method: 'POST',
    body: {
      name: '新しい村',
      capacity: 15
    }
  })
  // 成功時の処理
} catch (error) {
  // エラー処理
}
```

### PUTリクエストの例

```typescript
const { apiCall } = useApi()
try {
  const updated = await apiCall<VillageView>('/village/1', {
    method: 'PUT',
    body: updatedVillageData
  })
  // 更新成功
} catch (error) {
  // エラー処理
}
```

## apiCallの仕様

### 引数

1. `url: string` - APIエンドポイントのパス（ベースURLは自動付与）
2. `options?: object` - $fetchのオプション（method, body, headers等）

### 戻り値

- 成功時: Promise<T> - 指定した型のレスポンスデータ
- 失敗時: エラーをスロー

### 自動処理

- Firebase認証トークンの自動付与（Authorization: Bearer）
- Content-Type: application/jsonの自動設定
- ベースURLの自動付与（nuxt.config.tsのapiBaseUrl設定）
- エラー時のログ出力

## 注意事項

- API呼び出しは必ず`useApi`コンポーザブルの`apiCall`メソッドを使用すること
- `$fetch`は内部実装でのみ使用され、コンポーネントやページでは直接使用しない
- APIのベースURLは`nuxt.config.ts`で設定され、`apiCall`が自動的に適用する
- ステータス499のビジネスエラーは個別にハンドリングが必要
