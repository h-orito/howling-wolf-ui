<template>
  <div class="content has-text-left">
    <div class="myself-area">
      <div class="myself-name-area">
        <p class="myself-name">{{ myself.chara.chara_name.full_name }}</p>
      </div>
      <notification v-if="!isAlive" type="info" class="m-b-5">
        あなたは死亡しました。
      </notification>
      <div class="myself-content-area">
        <div class="myself-face-area">
          <chara-image :chara="myself.chara" />
        </div>
        <div class="myself-health-area">
          <notification v-if="myself.skill == null" type="default">
            <span style="white-space: pre-line;"
              >1日目になると役職情報がここに表示されます。
            </span>
          </notification>
          <notification v-if="myself.skill" type="default">
            <span style="white-space: pre-line;">{{ skillDescription }}</span>
          </notification>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// type
import SituationAsParticipant from '~/components/type/situation-as-participant'
import VillageParticipant from '~/components/type/village-participant'
const charaImage = () => import('~/components/village/chara-image.vue')
const notification = () =>
  import('~/components/village/village-notification.vue')

@Component({
  components: { charaImage, notification }
})
export default class Participate extends Vue {
  private get situation(): SituationAsParticipant {
    return this.$store.getters.getSituation!
  }

  private get myself(): VillageParticipant {
    return this.situation.participate.myself!
  }

  private get isAlive(): boolean {
    return this.myself.dead == null
  }

  private get skillDescription(): string {
    return this.myself.skill!.description.replace('。', '。\n')
  }
}
</script>

<style lang="scss" scoped>
.myself-area {
  .myself-name-area {
    padding-bottom: 5px;
    display: flex;

    .myself-name {
      flex: 1;
      text-align: left;
      font-weight: bold;
    }
  }
  .myself-content-area {
    display: flex;

    .myself-face-area {
      padding-right: 5px;
    }

    .myself-health-area {
      flex: 1;
    }
  }
}
</style>
