# UIガイドライン

## テーブルデザイン

### 標準的なテーブルスタイル

HOWLING WOLFのテーブルは以下の統一されたスタイルを使用します：

#### 構造

```vue
<div class="overflow-hidden rounded-lg bg-white shadow">
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <!-- ヘッダー行 -->
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <!-- データ行 -->
    </tbody>
  </table>
</div>
```

#### ヘッダーセル（th）

- **クラス**: `px-3 py-3.5 text-left text-sm font-semibold text-gray-900`
- **パディング**: 横方向 12px (px-3)、縦方向 14px (py-3.5)
- **フォント**: 小サイズ、太字
- **色**: グレー900

#### データセル（td）

- **クラス**: `p-2 text-sm whitespace-nowrap text-gray-900`
- **パディング**: 全方向 8px (p-2)
- **フォント**: 小サイズ
- **色**: グレー900
- **その他**: `whitespace-nowrap`で改行を防ぐ

#### 中央揃えのセル

数値や短いテキストの場合：

```html
<td class="p-2 text-center text-sm whitespace-nowrap text-gray-900"></td>
```

### リンクスタイル

テーブル内のリンク：

```html
<NuxtLink
  :to="リンク先"
  class="text-blue-600 hover:text-blue-800 hover:underline"
></NuxtLink>
```

### 空状態の表示

データがない場合：

```vue
<div class="bg-white rounded-lg shadow p-8">
  <div class="text-center text-gray-500">
    <p>データがありません</p>
  </div>
</div>
```

または（ダークモード対応版）：

```vue
<div class="rounded-lg bg-white p-12 shadow-md dark:bg-gray-800">
  <div class="text-center text-gray-500 dark:text-gray-400">
    <p>データがありません</p>
  </div>
</div>
```

## フォームデザイン

### インプットフィールド

- **FormInput**: `components/ui/form/FormInput.vue` を使用
- **FormSelect**: `components/ui/form/FormSelect.vue` を使用
- **FormCheckbox**: `components/ui/form/FormCheckbox.vue` を使用
- **FormSwitch**: `components/ui/form/FormSwitch.vue` を使用
- **FormTextarea**: `components/ui/form/FormTextarea.vue` を使用
- **FormRadioGroup**: `components/ui/form/FormRadioGroup.vue` を使用

### ボタン

- **Button**: `components/ui/button/index.vue` を使用
  - プライマリ: `variant="solid" color="primary"`
  - セカンダリ: `variant="outline"`
  - 削除・危険: `variant="solid" color="red"`

## レイアウト

### セクション

```vue
<section class="bg-gray-50 py-8">
  <div class="container mx-auto px-4">
    <!-- コンテンツ -->
  </div>
</section>
```

### カード

```vue
<div class="rounded-lg bg-white p-4 shadow">
  <!-- コンテンツ -->
</div>
```

## 色使い

### プライマリカラー

- テキストリンク: `text-blue-600 hover:text-blue-800`
- ボタン: Nuxt UIのprimaryカラー

### テキストカラー

- 主要テキスト: `text-gray-900`
- 補助テキスト: `text-gray-500`
- ダークモード: `dark:text-gray-100` / `dark:text-gray-400`

### 背景色

- ページ背景: `bg-gray-50`
- カード背景: `bg-white`
- テーブルヘッダー: `bg-gray-50`
- ダークモード: `dark:bg-gray-800`

## スペーシング

### パディング

- カード内: `p-4` (16px)
- 空状態: `p-8` (32px) または `p-12` (48px)
- セクション: `py-8` (縦32px)
- コンテナ: `px-4` (横16px)

### マージン

- 要素間: `mb-4` (下16px)
- タイトル: `mb-4` (下16px)
