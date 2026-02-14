<template>
  <BaseModal :model-value="isOpen" title="画像から選択" @close="handleClose">
    <p id="modal-description" class="sr-only">
      キャラクター一覧から選択してください
    </p>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      <button
        v-for="chara in charas"
        :key="chara.id"
        type="button"
        class="hover:border-primary-500 focus:ring-primary-500 flex flex-col items-center rounded-lg border border-gray-300 p-3 transition-all hover:font-semibold focus:ring-2 focus:outline-none"
        @click="selectChara(chara)"
      >
        <CharaImage :chara="chara" is-small class="mb-2" />
        <p class="text-center text-xs">{{ chara.chara_name.name }}</p>
      </button>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import BaseModal from '~/components/ui/modal/Modal.vue'
import CharaImage from '~/components/pages/village/CharaImage.vue'
import type { Chara } from '~/lib/api/types'

type ReadonlyChara = DeepReadonly<Chara> | Chara
type CharaList = ReadonlyChara[] | readonly ReadonlyChara[]

interface Props {
  isOpen: boolean
  charas: CharaList
}

defineProps<Props>()

const emit = defineEmits<{
  select: [chara: ReadonlyChara]
  close: []
}>()

const selectChara = (chara: ReadonlyChara) => {
  emit('select', chara)
}

const handleClose = () => {
  emit('close')
}
</script>
