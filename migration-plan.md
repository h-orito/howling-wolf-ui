# HOWLING WOLF UI: Nuxt 2 → Nuxt 4 移行計画

## 概要

HOWLING WOLF UI を Nuxt 2 (Vue 2) から Nuxt 4 (Vue 3) に移行する。
同じ開発者による類似プロジェクト `.firewolf-ui/` (Nuxt 4移行済み) を参考にし、同等のアーキテクチャで再構築する。

### 現行スタック → 新スタック

| 項目                 | 現行 (Nuxt 2)                         | 移行先 (Nuxt 4)                    |
| -------------------- | ------------------------------------- | ---------------------------------- |
| フレームワーク       | Nuxt 2.14 + Vue 2                     | Nuxt 4 + Vue 3                     |
| コンポーネント       | Class-based (nuxt-property-decorator) | Composition API (`<script setup>`) |
| 状態管理             | Vuex (modules)                        | Pinia (Composition API)            |
| UIフレームワーク     | Buefy (Bulma)                         | Tailwind CSS + 独自UI              |
| CSS                  | SCSS/SASS                             | Tailwind CSS                       |
| HTTP                 | @nuxtjs/axios                         | $fetch + useApi composable         |
| 認証                 | Firebase 8 + カスタムplugin           | Firebase 12 + nuxt-vuefire         |
| アイコン             | FontAwesome (webfonts)                | @heroicons/vue                     |
| バリデーション       | なし (手動)                           | vee-validate + yup                 |
| ビルド               | Webpack                               | Vite                               |
| パッケージマネージャ | npm                                   | pnpm                               |
| Lint                 | ESLint 6 + @nuxtjs/eslint-config      | ESLint 9 + @nuxt/eslint            |
| フォーマット         | Prettier 1                            | Prettier 3                         |
| テスト               | なし                                  | Vitest + Playwright                |
| Node.js              | 不明                                  | 22.14.0                            |

### 移行方針

- **機能完全維持**: 現行システムと100%同一の機能・UI/UXを維持
- **firewolf-uiの構成を踏襲**: ディレクトリ構成、コード規約、ガイドラインを共通化
- **段階的移行**: フェーズごとに動作確認しながら進める

---

## ファイル数の規模感

| 種別                | 現行ファイル数 | 備考                                        |
| ------------------- | -------------- | ------------------------------------------- |
| Vueコンポーネント   | 63             | 全てClass-based → Composition API変換が必要 |
| 型定義ファイル (TS) | 82             | `components/type/` 配下、interface定義      |
| ページ              | 12             | pages/ 配下                                 |
| レイアウト          | 3              | layouts/ 配下                               |
| ストアモジュール    | 3              | Vuex modules → Pinia変換                    |
| プラグイン          | 3              | 全て書き直し                                |
| ミドルウェア        | 3              | Nuxt 4形式に書き直し                        |
| 定数ファイル        | 1              | components/const/consts.ts                  |

---

## フェーズ 1: プロジェクト基盤構築

### 1.1 プロジェクト初期化

- [ ] Nuxt 4プロジェクトを `app/` ディレクトリ構成で新規作成
  - `nuxt.config.ts` を firewolf-ui を参考に作成 (HOWLING WOLF用に調整)
  - `tsconfig.json` (Nuxt生成のものをextend)
  - `.node-version` (22.14.0)
  - `.editorconfig`
  - `.prettierrc` (prettier-plugin-tailwindcss含む)
  - `eslint.config.js` (@nuxt/eslint ベース)
  - `.gitignore` (Nuxt 4用に更新)
  - `.env` / `.env.example` (NUXT*PUBLIC*\* 形式に変換)
- [ ] `package.json` 作成
  - pnpm に移行
  - 依存関係を Nuxt 4 互換に置き換え
  - scripts定義 (dev, build, lint, format, type-check 等)
- [ ] pnpm install で依存解決を確認
- [ ] `pnpm dev` で空のNuxtアプリが起動することを確認

### 1.2 ドキュメント整備

- [ ] `doc/guidelines/` を firewolf-ui から複製・調整
  - `code-style-guidelines.md`
  - `component-guidelines.md`
  - `implementation-guidelines.md`
  - `api-types-guidelines.md`
  - `api-usage-guidelines.md`
- [ ] `CLAUDE.md` を作成 (firewolf-uiを参考に、HOWLING WOLF用に調整)

### 1.3 基本ファイル構成

- [ ] `app/app.vue` 作成 (NuxtLayout + NuxtPage + Toast)
- [ ] `app/spa-loading-template.html` 作成 (既存loading-indicator.htmlを参考)

---

## フェーズ 2: 共通基盤 (認証・API・ユーティリティ)

### 2.1 Firebase認証

- [ ] `app/lib/firebase/auth.ts` 作成
  - Firebase 12 の modular API を使用
  - getAuth, signInWithPopup, linkWithPopup, signOut等
  - firewolf-uiの実装をそのまま流用可能
- [ ] `nuxt.config.ts` に nuxt-vuefire 設定追加
  - Firebase設定を runtimeConfig 経由で注入

### 2.2 Piniaストア

- [ ] `app/stores/auth.ts` 作成
  - Vuex auth module → Pinia Composition API
  - state: user, myselfPlayer, isLoading
  - getAuthToken (Cookie管理含む)
- [ ] `app/stores/village.ts` 作成
  - Vuex village module → Pinia
  - state: village, latestDay, messages, situation 等
- [ ] `app/stores/village-user-settings.ts` 作成
  - Vuex village-settings → Pinia
  - Cookie連携のユーザー設定管理
- [ ] `app/stores/village-message.ts` 作成
- [ ] `app/stores/village-message-filter.ts` 作成
- [ ] `app/stores/village-say-status.ts` 作成
- [ ] `app/stores/village-slider.ts` 作成

### 2.3 Composables (コア)

- [ ] `app/composables/useApi.ts` 作成
  - $fetch ベースの認証付きAPI呼び出し
  - baseURL自動設定、Authorization header自動付与
  - エラーハンドリング (status 499 = ビジネスエラー)
  - firewolf-uiの実装を流用
- [ ] `app/composables/useAuth.ts` 作成
  - Firebase認証操作 (signin, logout, link, registerIfNeeded等)
  - firewolf-uiの実装を流用・調整
- [ ] `app/composables/useToast.ts` 作成
- [ ] `app/composables/useWindowResize.ts` 作成
  - 既存 plugins/window-resize.js の機能を composable 化
- [ ] `app/composables/useOnlineStatus.ts` 作成

### 2.4 プラグイン・ミドルウェア

- [ ] `app/plugins/auth.client.ts` 作成
  - クライアントサイドでの認証初期化
- [ ] `app/middleware/auth.global.ts` 作成
  - 認証必要ルートの保護 (/create-village)
  - 既存 authenticated.js の機能を Nuxt 4 形式に

### 2.5 型定義 (OpenAPI自動生成)

howling-wolf APIはOpenAPI 3.0対応済み (`/howling-wolf/v3/api-docs`)。
firewolf-uiと同じ方式で自動生成する。

- [ ] `app/lib/api/openapi.json` をAPIサーバーから取得
- [ ] `app/lib/api/schema.ts` を `openapi-typescript` で自動生成
- [ ] `app/lib/api/types.ts` にラッパー型を定義
- [ ] `pnpm generate:api-types` スクリプト追加
  - `curl -o app/lib/api/openapi.json http://localhost:8086/howling-wolf/v3/api-docs && openapi-typescript app/lib/api/openapi.json -o app/lib/api/schema.ts && prettier --write app/lib/api/schema.ts`
- [ ] 既存の `components/type/` (82ファイル) は不要になる (自動生成型で置き換え)

### 2.6 定数の移行

- [ ] `app/lib/api/message-constants.ts` 作成
  - 既存 `components/const/consts.ts` の MESSAGE_TYPE, FACE_TYPE 等を移行
- [ ] `app/lib/api/village-status-constants.ts` 作成
  - VILLAGE_STATUS 等を移行

---

## フェーズ 3: UIコンポーネント基盤

### 3.1 Tailwind CSS セットアップ

- [ ] `app/assets/css/main.css` 作成 (Tailwindディレクティブ)
- [ ] `nuxt.config.ts` に @tailwindcss/vite プラグイン設定
- [ ] 既存 Buefy/Bulma のスタイルに対応するTailwindクラスの方針策定

### 3.2 UIコンポーネント作成

firewolf-ui の `components/ui/` を参考に、HOWLING WOLFで必要なものを作成:

- [ ] `app/components/ui/feedback/Toast.vue` 作成
- [ ] `app/components/ui/feedback/LoadingSpinner.vue` 作成
- [ ] `app/components/ui/feedback/Alert.vue` 作成
- [ ] `app/components/ui/feedback/OfflineBanner.vue` 作成
- [ ] `app/components/ui/modal/Modal.vue` 作成
- [ ] `app/components/ui/button/index.vue` 作成
- [ ] `app/components/ui/icon/Icon.vue` + svg-icons.ts 作成
- [ ] `app/components/ui/accordion/Accordion.vue` 作成
- [ ] `app/components/ui/form/` 配下 (FormGroup, FormInput, FormSelect, FormCheckbox, FormRadioGroup, FormSwitch, FormTextarea, FormNumberInput 等)
- [ ] `app/components/ui/badge/index.vue` 作成

### 3.3 レイアウトコンポーネント

- [ ] `app/components/layout/NavBar.vue` 作成
  - 既存 `components/common/navbar.vue` を Composition API + Tailwindで書き直し
- [ ] `app/components/layout/NavBarSlider.vue` 作成
- [ ] `app/components/layout/GoogleAds.vue` 作成
  - 既存 middleware/google-ads.js の機能をコンポーネント化
- [ ] `app/components/layout/GoogleAdsSidebar.vue` 作成
- [ ] `app/components/layout/GoogleAdsMessageList.vue` 作成

### 3.4 レイアウト

- [ ] `app/layouts/default.vue` 作成
  - NavBar + GoogleAds + slot
- [ ] `app/layouts/village.vue` 作成
  - GoogleAds + slot (NavBarなし)

---

## フェーズ 4: ページ移行 (情報ページ群)

シンプルなページから移行し、動作確認の基盤を固める。

### 4.1 静的情報ページ

- [ ] `app/pages/about.vue` 移行
- [ ] `app/pages/faq.vue` 移行
- [ ] `app/pages/rule.vue` 移行
  - [ ] `app/components/pages/rule/RuleMessage.vue` 作成
  - [ ] `app/components/pages/rule/RuleSkill.vue` 作成
  - [ ] `app/components/pages/rule/RuleAbility.vue` 作成
- [ ] `app/pages/release-note.vue` 移行
- [ ] `app/pages/document.vue` 移行 (firewolf-uiには無いページ)

### 4.2 キャラチップ関連

- [ ] `app/pages/charachip-list.vue` 移行
- [ ] `app/pages/charachip.vue` 移行

---

## フェーズ 5: ページ移行 (認証・データ表示系)

### 5.1 トップページ

- [ ] `app/pages/index.vue` 移行
  - [ ] `app/components/pages/index/Intro.vue` 作成
  - [ ] `app/components/pages/index/VillageCard.vue` 作成
  - [ ] `app/components/pages/index/SigninModal.vue` 作成
  - [ ] `app/components/pages/index/PlayerStats.vue` 作成
  - [ ] `app/components/pages/index/IndexFooter.vue` 作成
  - [ ] その他トップページコンポーネント
  - HW独自: 紹介機能・ブラックリスト関連のUI (MyselfPlayerViewの`introduce_players`, `introduced_players`, `blacklist_players`)

### 5.2 村一覧

- [ ] `app/pages/village-list.vue` 移行

### 5.3 プレイヤー戦績

- [ ] `app/pages/player-record.vue` 移行
  - [ ] `app/components/pages/player-record/DoughnutChart.vue` 作成
    - chart.js 2 → 新版への対応 (または別のチャートライブラリ検討)
  - [ ] その他プレイヤー戦績コンポーネント

---

## フェーズ 6: 村作成ページ

HowlingWolfは自動生成村のみ (`/auto-generated-village`)。
FireWolfのような自由な村作成UIとは根本的に異なるため、firewolf-uiの村作成フォームは参考にならない。
既存の `create-village.vue` を元に Composition API + Tailwind で書き直す。

- [ ] `app/pages/create-village.vue` 移行
  - `AutoGeneratedVillageRegisterBody`: organization, start_datetime, silent_hours, available_dummy_skill, for_beginner
  - firewolf-uiよりもシンプルなフォーム
  - vee-validate + yup でフォームバリデーション実装

---

## フェーズ 7: 村ページ (メインゲーム)

最も複雑なページ。composablesを活用して状態管理を分割する。

### 7.1 Village Composables

- [ ] `app/composables/village/useVillage.ts` 作成
- [ ] `app/composables/village/useVillageRefresh.ts` 作成
- [ ] `app/composables/village/useVillagePolling.ts` 作成
- [ ] `app/composables/village/useVillageTimer.ts` 作成
- [ ] `app/composables/village/useVillageSlider.ts` 作成
- [ ] `app/composables/village/useVillageNavigation.ts` 作成
- [ ] `app/composables/village/useVillageMessageFilter.ts` 作成
- [ ] `app/composables/village/useVillageMemo.ts` 作成
- [ ] `app/composables/village/useMessage.ts` 作成
- [ ] `app/composables/village/useSituation.ts` 作成
- [ ] `app/composables/village/useSayInput.ts` 作成
- [ ] `app/composables/village/useVillageSayStatus.ts` 作成
- [ ] `app/composables/village/useAnchorMessage.ts` 作成
- [ ] `app/composables/village/useUserSettings.ts` 作成
- [ ] `app/composables/village/useVillageMatome.ts` 作成

### 7.2 Village Action Composables

- [ ] `app/composables/village/action/useSay.ts` 作成
- [ ] `app/composables/village/action/useVote.ts` 作成
- [ ] `app/composables/village/action/useCommit.ts` 作成
- [ ] `app/composables/village/action/useParticipate.ts` 作成
- [ ] `app/composables/village/action/useLeave.ts` 作成
- [ ] `app/composables/village/action/useAbility.ts` 作成
- [ ] `app/composables/village/action/useComingout.ts` 作成
- [ ] `app/composables/village/action/useSkillRequest.ts` 作成
- [ ] `app/composables/village/action/useKick.ts` 作成 (admin-controller経由、FWのcreator-controllerとは異なる)
- [ ] `app/composables/village/action/useDebug.ts` 作成
- ※ FW固有のため不要: useActionSay, useCreatorSay, useCancelVillage, useChangeName, useExtendEpilogue

### 7.3 Village コンポーネント

- [ ] `app/pages/village.vue` 移行 (layout: 'village')
- [ ] `app/components/pages/village/VillageHeader.vue` 作成
- [ ] `app/components/pages/village/VillageFooter.vue` 作成
- [ ] `app/components/pages/village/VillageSidebar.vue` 作成
- [ ] `app/components/pages/village/VillageDayList.vue` 作成
- [ ] `app/components/pages/village/CharaImage.vue` 作成

### 7.4 メッセージ表示

- [ ] `app/components/pages/village/message/MessageList.vue` 作成
- [ ] `app/components/pages/village/message/MessageCard.vue` 作成
- [ ] `app/components/pages/village/message/MessagePagination.vue` 作成
- [ ] `app/components/pages/village/message/SayMessage.vue` 作成
- [ ] `app/components/pages/village/message/SystemMessage.vue` 作成
- [ ] `app/components/pages/village/message/ActionMessage.vue` 作成
- [ ] `app/components/pages/village/message/message-converter.ts` 作成

### 7.5 アクションパネル

- [ ] `app/components/pages/village/action/ActionContainer.vue` 作成
- [ ] `app/components/pages/village/action/ActionPanel.vue` 作成
- [ ] `app/components/pages/village/action/Say.vue` 作成
- [ ] `app/components/pages/village/action/Vote.vue` 作成
- [ ] `app/components/pages/village/action/Participate.vue` 作成
- [ ] `app/components/pages/village/action/Leave.vue` 作成
- [ ] `app/components/pages/village/action/Commit.vue` 作成
- [ ] `app/components/pages/village/action/Comingout.vue` 作成
- [ ] `app/components/pages/village/action/Ability.vue` 作成
- [ ] `app/components/pages/village/action/SkillRequest.vue` 作成
- [ ] 確認モーダル群 (Say, Participate, Leave, Comingout等)
- [ ] Adminパネル (Admin, Debug, Kick)
  - ※ FWの CreatorMenu (CreatorSay, Cancel, KickOut, ExtendEpilogue) はHWでは不要
- [ ] フィルター等

### 7.6 サイドバー・モーダル

- [ ] `app/components/pages/village/sidebar/ModalVillageInfo.vue` 作成
- [ ] `app/components/pages/village/sidebar/ModalUserSettings.vue` 作成
- [ ] `app/components/pages/village/sidebar/ModalMemo.vue` 作成
- [ ] `app/components/pages/village/sidebar/ParticipantList.vue` 作成
- [ ] `app/components/pages/village/footer/ModalFilter.vue` 作成

---

## フェーズ 8: ユーティリティ・SEO・PWA

### 8.1 ユーティリティ

- [ ] `app/utils/toast.ts` 作成
- [ ] `app/utils/seo.ts` 作成

### 8.2 SEO

- [ ] `nuxt.config.ts` の head設定 (OGP, meta, sitemap)
- [ ] `server/routes/sitemap.xml.ts` 作成

### 8.3 PWA

- [ ] @vite-pwa/nuxt 設定 (manifest, workbox, icons)

### 8.4 Google Ads

- [ ] 既存 middleware/google-ads.js をコンポーネント方式に移行

### 8.5 Google Analytics

- [ ] GA4対応 (UA → GA4移行、または gtag.js 直接使用)

---

## フェーズ 9: 静的アセット・ビルド最適化

### 9.1 静的アセット

- [ ] `public/` ディレクトリに既存 `static/` の内容を移行
  - 画像, アイコン, favicon等

### 9.2 ビルド最適化

- [ ] Vite の manualChunks 設定 (Firebase, validation, icons等)
- [ ] チャンクサイズ警告閾値設定
- [ ] Nitro routeRules (キャッシュヘッダー)

---

## フェーズ 10: テスト・品質保証

- [ ] Vitest セットアップ
- [ ] message-converter のユニットテスト
- [ ] 主要コンポーネントのテスト
- [ ] Playwright E2E テスト基盤構築
- [ ] Lighthouse CI 設定
- [ ] 全ページの動作確認

---

## 移行時の主要な変換パターン

### 1. Class-based → Composition API

```typescript
// Before (Nuxt 2)
@Component({ components: { ChildComp } })
export default class MyPage extends Vue {
  private data1: string = ''
  private get computed1() { return this.data1 + '!' }
  private method1() { ... }
  async created() { ... }
}

// After (Nuxt 4)
<script setup lang="ts">
const data1 = ref('')
const computed1 = computed(() => data1.value + '!')
const method1 = () => { ... }
onMounted(async () => { ... }) // created → onMounted (SPA)
</script>
```

### 2. Vuex → Pinia

```typescript
// Before (Vuex)
this.$store.dispatch(VILLAGE.LOAD_VILLAGE, { villageId })
this.$store.getters['village/getVillage']

// After (Pinia via composable)
const { loadVillage, village } = useVillage()
await loadVillage(villageId)
```

### 3. Buefy → Tailwind + 独自UI

```html
<!-- Before (Buefy) -->
<b-button type="is-primary" @click="submit">送信</b-button>
<b-modal :active.sync="isOpen">...</b-modal>
<b-field label="名前"><b-input v-model="name" /></b-field>

<!-- After (Tailwind + 独自UI) -->
<UiButton variant="primary" @click="submit">送信</UiButton>
<Modal v-model="isOpen">...</Modal>
<FormGroup label="名前"><FormInput v-model="name" /></FormGroup>
```

### 4. @nuxtjs/axios → useApi composable

```typescript
// Before
const res = await this.$axios.$get(`/village/${id}`)

// After
const { apiCall } = useApi()
const res = await apiCall<VillageView>(`/village/${id}`)
```

### 5. 環境変数

```bash
# Before
FIREBASE_API_KEY=xxx
HOWLING_WOLF_API_BASEURL=http://localhost:8086/howling-wolf

# After
NUXT_PUBLIC_FIREBASE_API_KEY=xxx
NUXT_PUBLIC_API_BASE_URL=http://localhost:8086/howling-wolf
```

---

## 移行から除外するもの

| 除外項目                    | 理由                                          |
| --------------------------- | --------------------------------------------- |
| `vue-datetime`              | 使用箇所を確認し代替検討 (HTML5 date input等) |
| `vue-scrollto`              | VueUse の useScrollTo で代替                  |
| `nuxt-clipboard2`           | Navigator Clipboard API で直接実装            |
| `cookie-universal-nuxt`     | Nuxt 4 の useCookie で代替                    |
| `@nuxtjs/dotenv`            | Nuxt 4 の runtimeConfig で代替                |
| `@nuxtjs/style-resources`   | Tailwind CSS移行により不要                    |
| `node-sass` / `sass-loader` | SCSS → Tailwind CSS移行により不要             |
| `vuexfire`                  | Pinia + nuxt-vuefire で代替                   |
| `weekstart`                 | 使用箇所を確認、不要なら除外                  |

---

## HowlingWolf API と FireWolf API の差分

firewolf-uiのコードを参考にする際、以下のAPI仕様差分に注意が必要。

### エンドポイント差分

#### HowlingWolfにのみ存在するエンドポイント

| メソッド | パス                                           | 説明                            |
| -------- | ---------------------------------------------- | ------------------------------- |
| POST     | `/player/introduce/{playerId}`                 | 紹介登録                        |
| POST     | `/player/remove-introduce/{playerId}`          | 紹介解除                        |
| POST     | `/player/blacklist-player/register/{playerId}` | ブラックリスト登録              |
| POST     | `/player/blacklist-player/remove/{playerId}`   | ブラックリスト解除              |
| POST     | `/auto-generated-village`                      | 自動生成村登録                  |
| POST     | `/admin/village/{villageId}/kick`              | 管理者キック (admin-controller) |

#### FireWolfにのみ存在するエンドポイント (HowlingWolfには不要)

| メソッド | パス                                           | 説明                       |
| -------- | ---------------------------------------------- | -------------------------- |
| POST     | `/village`                                     | 村作成 (HWは自動生成のみ)  |
| POST     | `/village/confirm`                             | 村作成確認                 |
| POST     | `/village/{villageId}/setting/confirm`         | 設定変更確認               |
| POST     | `/village/{villageId}/notification-setting`    | 通知設定 (Discord webhook) |
| POST     | `/village/{villageId}/change-name`             | キャラ名変更               |
| POST     | `/village/{villageId}/action`                  | アクション発言             |
| POST     | `/village/{villageId}/action-confirm`          | アクション確認             |
| POST     | `/creator/village/{villageId}/say`             | 村建て発言                 |
| POST     | `/creator/village/{villageId}/say-confirm`     | 村建て発言確認             |
| POST     | `/creator/village/{villageId}/kick`            | 村建てキック               |
| POST     | `/creator/village/{villageId}/extend-epilogue` | エピローグ延長             |
| POST     | `/creator/village/{villageId}/cancel`          | 村キャンセル               |
| POST     | `/reserved-village`                            | 予約村登録                 |
| DELETE   | `/reserved-village/{id}`                       | 予約村削除                 |
| GET      | `/charachips`                                  | キャラチップ一覧 (新パス)  |
| GET      | `/charas`                                      | キャラ一覧                 |

### スキーマ差分 (主要なもの)

#### 村作成の仕組み

- **HowlingWolf**: `/auto-generated-village` + `AutoGeneratedVillageRegisterBody` (編成・開始日時・沈黙時間・初心者向け等)
- **FireWolf**: `/village` + `VillageRegisterBody` (村名・詳細設定を含むフル村作成)
- → HowlingWolfでは自動生成村のみ。firewolf-uiの村作成UIは流用不可、独自実装が必要

#### 紹介・ブラックリスト機能

- **HowlingWolfのみ**: `MyselfPlayerView` に `blacklist_players`, `introduce_players`, `introduced_players` が存在
- **FireWolf**: これらは廃止済み
- → firewolf-uiにはない機能。HowlingWolf独自に実装が必要

#### VillageSayBody

- **HowlingWolf**: `message`, `message_type`, `face_type`
- **FireWolf**: 上記 + `target_id` (秘話の宛先)
- → HowlingWolfにはtarget_idがないため、秘話の宛先選択UIは不要

#### VillageParticipateBody

- **HowlingWolf**: `chara_id`, `first_request_skill`, `second_request_skill`, `join_message`, `join_password?`, `spectator?`
- **FireWolf**: 上記 + `chara_name`, `chara_short_name` (キャラ名カスタマイズ)
- → HowlingWolfではキャラ名変更機能なし

#### VillageParticipantView

- **HowlingWolf**: `id`, `chara`, `player?`, `dead?`, `spectator`, `skill?`, `skill_request?`, `win?`, `coming_outs`
- **FireWolf**: 上記 + `name`, `chara_name`, `status`, `camp`, `notification`, `comming_outs` (typo)
- → HowlingWolfの方がシンプル。firewolf-uiのコンポーネントから不要なフィールド参照を除外する

#### Skill

- **HowlingWolf**: 基本的な役職情報
- **FireWolf**: 上記 + `is_viewable_lovers_message`, `is_available_sympathize_say`, `is_viewable_sympathize_say` (恋人・共鳴機能)
- → HowlingWolfには恋人・共鳴機能なし

#### VillageRules

- **HowlingWolf**: `open_vote`, `available_skill_request`, `available_spectate`, `open_skill_in_grave`, `visible_grave_message`, `available_suddenly_death`, `available_commit`, `auto_generated`, `available_dummy_skill`, `for_beginner`, `message_restrict`
- **FireWolf**: 上記から`for_beginner`削除、`available_action`, `available_secret_say`, `available_guard_same_target` 追加
- → ルールフィールドが異なるため、村情報表示・村作成で注意

#### VillageCharachip

- **HowlingWolf**: `charachip_id` (単一int), `dummy_chara_id`
- **FireWolf**: `charachip_ids` (配列), `dummy_chara_id`, `dummy_chara_name`, `dummy_chara_short_name`, `dummy_chara_day0_message`, `dummy_chara_day1_message`
- → HowlingWolfは単一キャラチップのみ

#### VillageSettingsView

- **HowlingWolf**: `capacity`, `charachip`, `organizations`, `password`, `rules`, `time`
- **FireWolf**: 上記 + `tags` (R15/R18タグ)
- → HowlingWolfにはタグシステムなし

#### SituationAsParticipantView

- **HowlingWolf**: `participate`, `skill_request`, `commit`, `coming_out`, `say`, `ability`, `vote`, `admin`
- **FireWolf**: 上記 + `creator`, `rp`
- → HowlingWolfには村建てロール・RP状況なし

#### VillageAdminSituation

- **HowlingWolf**: `admin`, `available_kick`, `participant_list`
- **FireWolf**: `admin`, `participant_list` (`available_kick` なし、代わりに `VillageCreatorSituation` で管理)

#### PlayerView

- **HowlingWolf**: `id`, `nickname`, `twitter_user_name?`, `other_site_name?`, `introduction?`, `introduced` (required)
- **FireWolf**: `introduced` フィールドなし

#### VillageListForm

- **HowlingWolf**: `village_status`, `is_auto_generate`
- **FireWolf**: `village_status` のみ

#### パスの違い

- キャラチップ取得: HW `/charachip/{id}` vs FW `/charachips/{id}`
- キック: HW `/admin/village/{id}/kick` vs FW `/creator/village/{id}/kick`

### firewolf-uiから流用時の注意点まとめ

1. **流用可能 (そのまま or 微調整)**: 認証 (auth), API基盤 (useApi), UIコンポーネント, レイアウト, Toast, PWA, SEO
2. **流用可能だがスキーマ差分に注意**: 村表示, メッセージ表示, 投票, コミット, 能力行使, CO, 役職希望
3. **firewolf-uiにない機能 (HW独自実装)**: 紹介機能, ブラックリスト機能, 自動生成村作成
4. **firewolf-uiにある機能だがHWでは不要**: 村建て操作 (creator), アクション発言, 秘話宛先, キャラ名変更, 通知設定, タグ, 恋人/共鳴

---

## リスク・注意事項

1. **Buefy → Tailwind**: UIの見た目を可能な限り現行に合わせるが、完全一致は困難。機能的な同等性を優先。
2. **Chart.js**: vue-chartjs (Vue 2用) → Vue 3対応の chart.js ラッパーに変更が必要。
3. **version middleware**: バージョンチェック機能の移行方法を検討 (composable化 or middleware維持)。
4. **Google Analytics**: UA (Universal Analytics) → GA4 への移行が必要な可能性。
5. **自動生成村**: HowlingWolfの村作成はfirewolfと根本的に異なる。firewolf-uiの村作成フォームは参考にならず、独自実装が必要。

---

## 推奨作業順序

1. **フェーズ 1** → `pnpm dev` で空ページ起動確認
2. **フェーズ 2** → 認証ログイン確認
3. **フェーズ 3** → UIコンポーネントのビジュアル確認
4. **フェーズ 4** → 静的ページが正しく表示されることを確認
5. **フェーズ 5** → API連携を含むページの動作確認
6. **フェーズ 6** → 村作成→作成後の遷移確認
7. **フェーズ 7** → ゲームプレイの一連の流れを通しで動作確認
8. **フェーズ 8-9** → 本番デプロイ品質に仕上げ
9. **フェーズ 10** → テスト整備
