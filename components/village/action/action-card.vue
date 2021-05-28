<template>
  <div>
    <b-collapse
      class="card action-card"
      :class="$store.getters.isDarkTheme ? 'dark-theme' : ''"
      animation="slide"
      :aria-id="id"
      :open="isOpen"
      @open="handleOpen"
      @close="handleClose"
    >
      <template #trigger="props">
        <header class="card-header action-card-header" :aria-controls="id">
          <p class="card-header-title action-card-header-title is-size-6">
            {{ title }}
          </p>
          <a class="card-header-icon">
            <b-icon
              pack="fas"
              :icon="props.open ? 'angle-down' : 'angle-right'"
            >
            </b-icon>
          </a>
        </header>
      </template>

      <div v-if="existsContent" class="card-content action-card-content">
        <slot name="content" />
      </div>
      <footer v-if="existsFooter" class="card-footer">
        <div class="card-footer-item action-card-footer-item">
          <slot name="footer" />
        </div>
      </footer>
    </b-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import villageUserSettings from '~/components/village/user-settings/village-user-settings'

@Component({
  components: {}
})
export default class ActionCard extends Vue {
  @Prop({ type: String })
  private id!: string

  @Prop({ type: Boolean, default: true })
  private isOpen!: boolean

  @Prop({ type: String })
  private title!: string

  @Prop({ type: Boolean, default: true })
  private existsContent?: boolean

  @Prop({ type: Boolean, default: true })
  private existsFooter?: boolean

  private handleOpen(): void {
    const cookie = villageUserSettings.getActionWindow(this)
    // @ts-ignore
    cookie.open_map![this.id] = true
    villageUserSettings.setActionWindow(this, cookie)
  }

  private handleClose(): void {
    const cookie = villageUserSettings.getActionWindow(this)
    // @ts-ignore
    cookie.open_map![this.id] = false
    villageUserSettings.setActionWindow(this, cookie)
  }
}
</script>

<style lang="scss" scoped>
.action-card {
  margin: 20px 5px;
  border-radius: 5px;

  .action-card-header {
    background-color: #eee;

    .action-card-header-title {
      color: $grey;
    }
  }

  .action-card-content {
    text-align: left;
    padding: 10px;
  }

  .action-card-footer-item {
    padding: 5px;
    justify-content: flex-end !important;
  }

  &.dark-theme {
    color: #fff;

    .action-card-header {
      background-color: $dark;

      .action-card-header-title {
        color: $white !important;
      }
    }

    .action-card-content {
      background-color: #444;
    }

    .field .label {
      color: $white;
    }
  }
}

.fixed .action-card {
  position: fixed;
  z-index: 10;
  width: 100%;
  bottom: $village-footer-height;
  max-height: 30vh;
  margin: 0 -10px;
  border-right: 0;
  border-left: 0;
  border-bottom: 0;
  overflow-y: scroll;
}

@media screen and (min-width: 768px) {
  .fixed .action-card {
    width: calc(100vw - 280px);
  }
}
</style>
