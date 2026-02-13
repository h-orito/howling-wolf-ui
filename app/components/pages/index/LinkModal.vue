<template>
  <UiModalModal v-model="isOpen" title="他SNSアカウント連携" @close="close">
    <div class="text-sm">
      <p>
        追加でログインすると、現在ログインしているアカウントに紐付けることができます。<br />
        例えば、Twitter連携＋Google連携にしておくと、Twitter連携できなくなった場合もGoogleアカウントでログインすることができます。
      </p>
      <UiFeedbackAlert type="warning" class="my-4 text-sm">
        <ul class="list-disc">
          <li>
            ログインしたことがあるアカウントで追加ログインすることはできません。
          </li>
        </ul>
      </UiFeedbackAlert>

      <div class="mt-6 mb-6">
        <hr class="mb-3" />
        <UiButton
          color="primary"
          :disabled="isAlreadyTwitterLinked"
          @click="link('twitter')"
        >
          <UiIconIcon name="twitter" class="mr-2" />
          Twitterログイン
        </UiButton>
        <UiFeedbackAlert v-if="!isAlreadyTwitterLinked" class="my-4 text-sm">
          <ul class="list-disc">
            <li>エピローグでニックネームおよびTwitterのIDが公開されます。</li>
            <li>ニックネームはマイページで変更することができます。</li>
          </ul>
        </UiFeedbackAlert>
        <p v-else class="mt-2 text-sm text-gray-600">既に連携済みです。</p>
      </div>

      <div class="my-6">
        <hr class="mb-3" />
        <UiButton
          color="primary"
          :disabled="isAlreadyGoogleLinked"
          @click="link('google')"
        >
          <UiIconIcon name="google" class="mr-2" />
          Googleログイン
        </UiButton>
        <UiFeedbackAlert v-if="!isAlreadyGoogleLinked" class="my-4 text-sm">
          <ul class="list-disc">
            <li>エピローグでニックネームが公開されます。</li>
            <li>ニックネームはマイページで変更することができます。</li>
            <li>メールアドレスが表示されることはありません。</li>
          </ul>
        </UiFeedbackAlert>
        <p v-else class="mt-2 text-sm text-gray-600">既に連携済みです。</p>
      </div>
    </div>

    <template #footer>
      <UiButton color="secondary" variant="outline" size="sm" @click="close">
        閉じる
      </UiButton>
    </template>
  </UiModalModal>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  link: [provider: 'twitter' | 'google']
}>()

const authStore = useAuthStore()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isAlreadyTwitterLinked = computed(() => {
  const user = authStore.user
  if (!user) return false
  return (
    user.providerData?.some(
      (providerData) => providerData.providerId === 'twitter.com'
    ) ?? false
  )
})

const isAlreadyGoogleLinked = computed(() => {
  const user = authStore.user
  if (!user) return false
  return (
    user.providerData?.some(
      (providerData) => providerData.providerId === 'google.com'
    ) ?? false
  )
})

const link = (provider: 'twitter' | 'google') => {
  emit('link', provider)
  close()
}

const close = () => {
  isOpen.value = false
}
</script>
