---
paths: app/components/**/*.{ts,vue}
---

# コンポーネント配置ガイドライン

## ディレクトリ構造

```
/app/
  /components/
    /ui/           # UI関連コンポーネント
      /form/       # フォーム関連
      /modal/      # モーダル関連
      /navigation/ # ナビゲーション関連
      /feedback/   # フィードバック関連（エラー、ローディング等）
      /button/     # ボタン関連
      /card/       # カード関連
      /table/      # テーブル関連
    /layout/       # レイアウト関連コンポーネント
    /pages/        # 各ページ固有のコンポーネント
      /index/      # トップページ用
      /village/    # 村ページ用
      /create-village/ # 村作成ページ用
      /rule/       # ルールページ用
  /pages/          # ルーティング定義（薄いラッパー）
```

## 配置ルール

### ⚠️ 禁止事項

**`common`、`shared`、`general`などの汎用的な名前のディレクトリは作成禁止**

コンポーネントは必ず意味のある機能単位で分類すること。

### 1. UIコンポーネント (`/components/ui/`)

再利用可能なUI要素は`ui`配下の機能別サブディレクトリに配置する。

**例**:

- `/components/ui/form/`
  - `TextField.vue` - テキスト入力フィールド
  - `SelectField.vue` - セレクトボックス
  - `ValidationMessage.vue` - バリデーションメッセージ
  - `RadioGroup.vue` - ラジオボタングループ
  - `CheckboxField.vue` - チェックボックス

- `/components/ui/modal/`
  - `Modal.vue` - モーダルの基本実装
  - `ConfirmModal.vue` - 確認ダイアログ
  - `AlertModal.vue` - アラートダイアログ
- `/components/ui/feedback/`
  - `LoadingSpinner.vue` - ローディング表示
  - `ErrorMessage.vue` - エラー表示
  - `SuccessMessage.vue` - 成功メッセージ
  - `Toast.vue` - トースト通知

- `/components/ui/navigation/`
  - `Breadcrumb.vue` - パンくずリスト
  - `Pagination.vue` - ページネーション
  - `TabNavigation.vue` - タブナビゲーション

- `/components/ui/button/`
  - `BaseButton.vue` - 基本ボタン
  - `IconButton.vue` - アイコンボタン
  - `ButtonGroup.vue` - ボタングループ

- `/components/ui/card/`
  - `BaseCard.vue` - 基本カード
  - `VillageCard.vue` - 村表示用カード
  - `PlayerCard.vue` - プレイヤー表示用カード

- `/components/ui/table/`
  - `DataTable.vue` - データテーブル
  - `TableHeader.vue` - テーブルヘッダー
  - `TableRow.vue` - テーブル行

### 2. レイアウトコンポーネント (`/components/layout/`)

ページレイアウトを構成するコンポーネント

**例**:

- `Header.vue` - ヘッダー
- `Footer.vue` - フッター
- `Navigation.vue` - ナビゲーション
- `Sidebar.vue` - サイドバー

### 3. ページ固有コンポーネント (`/components/pages/[page-name]/`)

特定のページでのみ使用されるコンポーネント

**例**:

- `/components/pages/create-village/`
  - `BasicSettings.vue` - 基本設定セクション
  - `RoleSettings.vue` - 役職設定セクション
  - `ConfirmDialog.vue` - 確認ダイアログ

- `/components/pages/village/`
  - `MessageList.vue` - メッセージ一覧
  - `ParticipantList.vue` - 参加者一覧
  - `VotePanel.vue` - 投票パネル

## 命名規則

### ファイル名

- PascalCase使用: `UserProfile.vue`
- 複数単語推奨: `BaseButton.vue` > `Button.vue`
- インデックスファイル: 各ディレクトリに`index.ts`でエクスポート管理

### コンポーネント名

- ファイル名と一致させる
- ページ固有の場合はプレフィックス付与も可
  - 例: `CreateVillageBasicSettings.vue`

## インポート方法

### エイリアス使用

```typescript
// 推奨
import TextField from '~/components/ui/form/TextField.vue'
import ConfirmModal from '~/components/ui/modal/ConfirmModal.vue'
import VillageCard from '~/components/ui/card/VillageCard.vue'

// 非推奨（相対パス）
import TextField from '../../../components/ui/form/TextField.vue'
```

## 重要事項

- 再利用性を考慮してコンポーネントを設計
- 2箇所以上で使用される場合は`/components/ui/`配下の適切なディレクトリへ移動を検討
- ページ固有コンポーネントは該当ページのディレクトリに配置
- 過度な細分化は避け、適切な粒度を保つ
- **禁止**: `common`、`shared`、`general`などの汎用的な名前は使用しない
