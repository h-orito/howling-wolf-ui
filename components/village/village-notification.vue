<template>
  <div class="village-notification" :class="className">
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({
  components: {}
})
export default class VillageNotification extends Vue {
  @Prop({ type: String })
  private type!: string

  private get className(): string[] {
    const classNames: string[] = []
    classNames.push(`is-${this.type}`)
    if (this.$store.getters.isDarkTheme) classNames.push('dark-theme')
    return classNames
  }
}
</script>

<style lang="scss" scoped>
.village-notification {
  background-color: transparent;
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 15px 15px;
  text-align: left;

  &.is-default {
    border: 1px solid #eee;
    background-color: #eee;

    &.dark-theme {
      background-color: rgba(0, 0, 0, 0.2);
      border: 1px solid $normal-say;
    }
  }
  &.is-danger {
    border: 1px solid $werewolf-say;
    background-color: $werewolf-say;

    &.dark-theme {
      background-color: rgba(255, 0, 0, 0.2);
      border: 1px solid $werewolf-system-border;
    }
  }
  &.is-warning {
    border: 1px solid $spectate-say;
    background-color: $spectate-say;

    &.dark-theme {
      background-color: rgba(255, 255, 0, 0.2);
      border: 1px solid $spectate-say;
    }
  }
  &.is-info {
    border: 1px solid $grave-say;
    background-color: $grave-say;

    &.dark-theme {
      background-color: rgba(0, 0, 255, 0.2);
      border: 1px solid $psychic-system-border;
    }
  }
}
</style>
