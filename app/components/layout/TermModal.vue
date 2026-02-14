<template>
  <Modal v-model="isOpen" title="利用規約" @close="close">
    <div class="max-h-96 overflow-y-auto text-sm">
      <h3 class="mb-2 font-semibold">利用規約</h3>
      <p class="mb-3">
        この利用規約（以下，「本規約」といいます。）は，HOWLING
        WOLF管理人（以下，「管理人」といいます。）がこのウェブサイト上で提供するサービス（以下，「本サービス」といいます。）の利用条件を定めるものです。登録ユーザの皆さま（以下，「ユーザ」といいます。）には，本規約に従って，本サービスをご利用いただきます。
      </p>
      <h3 class="mb-2 font-semibold">第1条（適用）</h3>
      <ol class="mb-3 list-decimal pl-5">
        <li>
          本規約は，ユーザと管理人との間の本サービスの利用に関わる一切の関係に適用されるものとします。
        </li>
        <li>
          管理人は本サービスに関し，本規約のほか，ご利用にあたってのルール等，各種の定め（以下，「個別規定」といいます。）をすることがあります。これら個別規定はその名称のいかんに関わらず，本規約の一部を構成するものとします。
        </li>
        <li>
          本規約の規定が前条の個別規定の規定と矛盾する場合には，個別規定において特段の定めなき限り，個別規定の規定が優先されるものとします。
        </li>
      </ol>
      <h3 class="mb-2 font-semibold">第2条（利用登録）</h3>
      <ol class="mb-3 list-decimal pl-5">
        <li>
          本サービスにおいては，登録希望者が本規約に同意の上，管理人の定める方法によって利用登録を申請し，管理人がこれを承認することによって，利用登録が完了するものとします。
        </li>
        <li>
          管理人は，利用登録の申請者に以下の事由があると判断した場合，利用登録の申請を承認しないことがあり，その理由については一切の開示義務を負わないものとします。
          <ol class="list-decimal pl-5">
            <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
            <li>本規約に違反したことがある者からの申請である場合</li>
            <li>その他，管理人が利用登録を相当でないと判断した場合</li>
          </ol>
        </li>
      </ol>
      <h3 class="mb-2 font-semibold">第3条（禁止事項）</h3>
      <p class="mb-2">
        ユーザは，本サービスの利用にあたり，以下の行為をしてはなりません。
      </p>
      <ol class="mb-3 list-decimal pl-5">
        <li>法令または公序良俗に違反する行為</li>
        <li>犯罪行為に関連する行為</li>
        <li>管理人のサービスの運営を妨害するおそれのある行為</li>
        <li>不正アクセスをし，またはこれを試みる行為</li>
        <li>他のユーザに関する個人情報等を収集または蓄積する行為</li>
        <li>
          本サービスの他のユーザまたはその他の第三者に不利益，損害，不快感を与える行為
        </li>
        <li>その他，管理人が不適切と判断する行為</li>
      </ol>
      <h3 class="mb-2 font-semibold">第4条（本サービスの提供の停止等）</h3>
      <ol class="mb-3 list-decimal pl-5">
        <li>
          管理人は，以下のいずれかの事由があると判断した場合，ユーザに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
        </li>
        <li>
          管理人は，本サービスの提供の停止または中断により，ユーザまたは第三者が被ったいかなる不利益または損害についても，一切の責任を負わないものとします。
        </li>
      </ol>
      <h3 class="mb-2 font-semibold">第5条（免責事項）</h3>
      <ol class="mb-3 list-decimal pl-5">
        <li>
          管理人は，本サービスに事実上または法律上の瑕疵がないことを保証しておりません。
        </li>
        <li>
          管理人は，本サービスに起因してユーザに生じたあらゆる損害について一切の責任を負いません。
        </li>
      </ol>
      <h3 class="mb-2 font-semibold">第6条（利用規約の変更）</h3>
      <p class="mb-3">
        管理人は，必要と判断した場合には，ユーザに通知することなくいつでも本規約を変更することができるものとします。
      </p>
      <p class="text-right">以上</p>
    </div>

    <template #footer>
      <UiButton color="secondary" variant="outline" size="sm" @click="close">
        閉じる
      </UiButton>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/ui/modal/Modal.vue'

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
