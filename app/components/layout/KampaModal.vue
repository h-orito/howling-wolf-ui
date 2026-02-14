<template>
  <Modal v-model="isOpen" title="投げ銭について" @close="close">
    <div class="text-sm">
      <p>
        開発を応援してくださりありがとうございます。<br />
        投げ銭いただける方は以下のいずれかの方法でお願いします。
      </p>
      <h2 class="mt-4 mb-2 font-semibold">Amazonほしいものリスト</h2>
      <div>
        Amazonほしいものリストから選んで開発者に送ることができます。<br />
        <UiButton
          href="https://www.amazon.jp/hz/wishlist/ls/1KZSJAJS1ETW4?ref_=wl_share"
          target="_blank"
          size="xs"
          class="mt-2"
        >
          Amazonほしいものリスト
        </UiButton>
      </div>
      <h2 class="mt-4 mb-2 font-semibold">Amazonアソシエイト経由でお買い物</h2>
      <div>
        下記からAmazonに遷移してカートに追加＆購入すると、管理人に若干の紹介料が入ります。<br />
        <UiButton
          href="https://amzn.to/48auG7Q"
          target="_blank"
          size="xs"
          class="mt-2"
        >
          Amazonに遷移
        </UiButton>
      </div>
      <h4 class="mt-4 mb-2 font-semibold">補足</h4>
      <ul class="list-disc pl-5 text-sm">
        <li>
          頂いた改善提案、ご要望については投げ銭の有無に関係なく積極的に取り入れていくので、Twitter
          <a
            href="https://twitter.com/ort_dev"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-400 underline"
            >@ort_dev</a
          >までお願いします。
        </li>
      </ul>
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
