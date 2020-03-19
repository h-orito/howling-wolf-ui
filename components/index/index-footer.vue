<template>
  <div>
    <div class="menu-area">
      <div class="m-b-50">
        <p class="is-size-5 spotlight-shadow">
          その他情報
        </p>
      </div>
      <div class="columns">
        <div class="column is-6">
          <b-button
            tag="a"
            :target="'_blank'"
            :href="'https://twitter.com/ort_dev'"
            type="is-white"
            icon-pack="fab"
            icon-left="twitter"
            outlined
            expanded
            class="spotlight-shadow"
          >
            <strong>要望、改善提案、不具合報告</strong>
          </b-button>
        </div>
        <div class="column is-6">
          <b-button
            type="is-white"
            outlined
            expanded
            icon-pack="fas"
            icon-left="donate"
            class="spotlight-shadow"
            @click="openKampaModal"
          >
            <strong>投げ銭</strong>
          </b-button>
        </div>
      </div>
      <div class="columns">
        <div class="column is-6">
          <b-button
            type="is-white"
            outlined
            expanded
            icon-pack="fas"
            icon-left="book"
            class="spotlight-shadow"
            @click="openTermModal"
          >
            <strong>利用規約</strong>
          </b-button>
        </div>
        <div class="column is-6">
          <b-button
            type="is-white"
            outlined
            expanded
            icon-pack="fas"
            icon-left="book"
            class="spotlight-shadow"
            @click="openPolicyModal"
          >
            <strong>プライバシーポリシー</strong>
          </b-button>
        </div>
      </div>
    </div>
    <kampa-modal :is-open="isKampaModalOpen" @close-modal="closeKampaModal" />
    <term-modal :is-open="isTermModalOpen" @close-modal="closeTermModal" />
    <policy-modal
      :is-open="isPolicyModalOpen"
      @close-modal="closePolicyModal"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
const kampaModal = () => import('~/components/index/modal-kampa.vue')
const termModal = () => import('~/components/index/modal-term.vue')
const policyModal = () => import('~/components/index/modal-policy.vue')

@Component({
  components: {
    kampaModal,
    termModal,
    policyModal
  }
})
export default class IndexFooter extends Vue {
  private isKampaModalOpen: boolean = false
  private isTermModalOpen: boolean = false
  private isPolicyModalOpen: boolean = false

  private openKampaModal(): void {
    this.isKampaModalOpen = true
  }

  private closeKampaModal(): void {
    this.isKampaModalOpen = false
  }

  private openTermModal(): void {
    this.isTermModalOpen = true
  }

  private closeTermModal(): void {
    this.isTermModalOpen = false
  }

  private openPolicyModal(): void {
    this.isPolicyModalOpen = true
  }

  private closePolicyModal(): void {
    this.isPolicyModalOpen = false
  }
}
</script>

<style lang="scss" scoped></style>
