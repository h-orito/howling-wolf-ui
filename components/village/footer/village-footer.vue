<template>
  <div class="village-footer">
    <button class="village-footer-item" @click="$emit('toggle-slider')">
      <b-icon pack="fas" icon="bars" size="is-small" type="is-white" />
    </button>
    <button class="village-footer-item" @click="refresh">
      <b-icon
        pack="fas"
        icon="sync-alt"
        size="is-small"
        :type="existsNewMessages ? 'is-info' : 'is-white'"
        :custom-class="existsNewMessages ? 'rotate' : ''"
      />
    </button>
    <b-button
      class="village-footer-item flex"
      icon-pack="fas"
      icon-left="long-arrow-alt-down"
      type="is-dark"
      size="is-small"
      @click="toBottom"
    >
      最下部
    </b-button>
    <div class="village-footer-item footer-timer">
      <p>更新まで 23:59:59</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import scrollTo from 'vue-scrollto'
// type
import Village from '~/components/type/village'

@Component({
  components: {}
})
export default class VillageFooter extends Vue {
  @Prop({ type: Object })
  private village?: Village | null

  @Prop({ type: Boolean })
  private existsNewMessages!: boolean

  // 発言更新
  private refresh(): void {
    this.$emit('refresh')
  }

  private toBottom(): void {
    this.$emit('to-bottom')
  }
}
</script>

<style lang="scss">
.village-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1.8rem;
  display: flex;
  z-index: 10;

  .village-footer-item {
    height: 100%;
    justify-content: center;
    align-content: center;
    cursor: pointer;
    background-color: $dark;
    border: 0;
    border-radius: 0;
    min-width: 60px;

    i.rotate {
      animation: rotate1 2s linear infinite;
    }

    @keyframes rotate1 {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }

  .footer-timer {
    color: $white;
    width: 120px;
    cursor: default;

    p {
      line-height: 1.8rem;
    }
  }

  .flex {
    flex: 1;
  }
}
</style>
