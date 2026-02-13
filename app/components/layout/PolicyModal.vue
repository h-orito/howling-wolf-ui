<template>
  <UiModalModal v-model="isOpen" title="プライバシーポリシー" @close="close">
    <div class="max-h-96 overflow-y-auto text-sm">
      <h3 class="mb-2 font-semibold">プライバシーポリシー</h3>
      <p class="mb-3">
        HOWLING
        WOLF管理人（以下，「管理人」といいます。）は，本ウェブサイト上で提供するサービス（以下,「本サービス」といいます。）における，ユーザのプライバシー情報の取扱いについて，以下のとおりプライバシーポリシー（以下，「本ポリシー」といいます。）を定めます。
      </p>
      <h3 class="mb-2 font-semibold">第1条（プライバシー情報）</h3>
      <ol class="mb-3 list-decimal pl-5">
        <li>
          本サービスでは，個人情報保護法にいう「個人情報」を収集しません。
        </li>
        <li>
          本サービスは，ログインに利用したTwitterアカウント名やユーザ名，ご覧になったページや広告の履歴，ご利用日時，ご利用環境，ユーザのIPアドレス，クッキー情報などのプライバシー情報を収集します。
        </li>
      </ol>
      <h3 class="mb-2 font-semibold">第2条（プライバシー情報の収集方法）</h3>
      <ol class="mb-3 list-decimal pl-5">
        <li>
          本サービスは，ユーザが利用登録をする際にTwitterアカウント名やユーザ名などをお尋ねすることがあります。
        </li>
        <li>
          本サービスは，ユーザが各ページを閲覧する際に，ご覧になったページや広告の履歴，ご利用日時，ご利用環境，ユーザのIPアドレス，クッキー情報などを収集します。
        </li>
      </ol>
      <h3 class="mb-2 font-semibold">
        第3条（プライバシー情報を収集・利用する目的）
      </h3>
      <p class="mb-2">
        本サービスが個人情報を収集・利用する目的は，以下のとおりです。
      </p>
      <ol class="mb-3 list-decimal pl-5">
        <li>サービスの提供・運営のため</li>
        <li>
          ユーザからのお問い合わせに回答するため（本人確認を行うことを含む）
        </li>
        <li>メンテナンス，重要なお知らせなど必要に応じたご連絡のため</li>
        <li>利用規約に違反したユーザの特定をし，ご利用をお断りするため</li>
        <li>上記の利用目的に付随する目的</li>
      </ol>
      <h3 class="mb-2 font-semibold">第4条（個人情報の第三者提供）</h3>
      <p class="mb-3">
        管理人は、広告表示やアクセス解析のため、Google AdsenseおよびGoogle
        Analyticsにプライバシー情報を送信しています。それ以外の送信先については，あらかじめユーザの同意を得ることなく提供することはありません。
      </p>
      <h3 class="mb-2 font-semibold">第5条（プライバシーポリシーの変更）</h3>
      <ol class="mb-3 list-decimal pl-5">
        <li>
          本ポリシーの内容は，ユーザに通知することなく，変更することができるものとします。
        </li>
        <li>
          変更後のプライバシーポリシーは，本ウェブサイトに掲載したときから効力を生じるものとします。
        </li>
      </ol>
      <h3 class="mb-2 font-semibold">第6条（お問い合わせ窓口）</h3>
      <p class="mb-3">
        本ポリシーに関するお問い合わせは，Twitter @ort_devまでお願いいたします。
      </p>
    </div>

    <template #footer>
      <UiButton color="secondary" variant="outline" size="sm" @click="close">
        閉じる
      </UiButton>
    </template>
  </UiModalModal>
</template>

<script setup lang="ts">
interface Props {
  open: boolean
}

interface Emits {
  'update:open': [value: boolean]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

const close = () => {
  isOpen.value = false
}
</script>
