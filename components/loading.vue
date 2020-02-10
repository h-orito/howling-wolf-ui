<template>
  <div class="loading-bg" :class="fixed ? 'loading-fixed' : ''">
    <div class="loading-content">
      <img
        src="~/static/image/loading.gif"
        width="80px;"
        height="80px"
        alt="loading..."
      />
      <p>{{ message }}</p>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({})
export default class VillageCard extends Vue {
  @Prop({ type: String, default: '読み込み中' })
  private message?: string

  @Prop({ type: Boolean, default: false })
  private fixed?: boolean
}
</script>

<style>
.loading-bg {
  z-index: 50;
  position: absolute;
  background: #fff;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.6;
}
.loading-fixed {
  position: fixed;
  top: 3.25rem;
  left: 0;
  height: calc(100vh - 3.25rem);
}
.loading-content {
  position: absolute;
  width: 200px;
  height: 100px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
</style>
