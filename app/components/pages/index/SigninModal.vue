<template>
  <Modal v-model="isOpen" title="ログイン" @close="close">
    <div class="text-sm">
      <p>いずれかのアカウントと連携してログインしてください。</p>
      <UiFeedbackAlert type="warning" class="my-4 text-sm">
        <ul class="list-disc">
          <li>
            既存のアカウントに別のログイン方法を紐付けたい場合は、まず既存のアカウントでログインしてください。
          </li>
          <li>
            ログインしたことがあるアカウントは後から追加で紐付けることができないので、ご注意ください。
          </li>
        </ul>
      </UiFeedbackAlert>

      <div class="mt-6 mb-6">
        <hr class="mb-3" />
        <UiButton color="primary" @click="signin('twitter')">
          <Icon name="twitter" class="mr-2" />
          Twitterログイン
        </UiButton>
        <UiFeedbackAlert class="my-4 text-sm">
          <ul class="list-disc">
            <li>エピローグでニックネームおよびTwitterのIDが公開されます。</li>
            <li>ニックネームはマイページで変更することができます。</li>
          </ul>
        </UiFeedbackAlert>
      </div>

      <div class="my-6">
        <hr class="mb-3" />
        <UiButton color="primary" @click="signin('google')">
          <Icon name="google" class="mr-2" />
          Googleログイン
        </UiButton>
        <UiFeedbackAlert class="my-4 text-sm">
          <ul class="list-disc">
            <li>エピローグでニックネームが公開されます。</li>
            <li>メールアドレスが表示されることはありません。</li>
          </ul>
        </UiFeedbackAlert>
      </div>
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
import Icon from '~/components/ui/icon/Icon.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  signin: [provider: 'twitter' | 'google']
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const signin = (provider: 'twitter' | 'google') => {
  emit('signin', provider)
  close()
}

const close = () => {
  isOpen.value = false
}
</script>
