<template>
  <div class="content has-text-left">
    <div class="myself-area">
      <div class="myself-name-area">
        <p class="myself-name">{{ myself.chara.chara_name.full_name }}</p>
      </div>
      <b-message v-if="!isAlive" size="is-small" type="is-info">
        あなたは死亡しました。
      </b-message>
      <div class="myself-content-area">
        <div class="myself-face-area">
          <chara-image :chara="myself.chara" />
        </div>
        <div class="myself-health-area">
          <b-message v-if="myself.skill == null" size="is-small">
            <span style="white-space: pre-line;"
              >1日目になると役職情報がここに表示されます。
            </span>
          </b-message>
          <b-message v-if="myself.skill" size="is-small">
            <span style="white-space: pre-line;">{{ skillDescription }}</span>
          </b-message>
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

@Component({
  components: { charaImage }
})
export default class Participate extends Vue {
  @Prop({ type: Object })
  private situation!: SituationAsParticipant

  private get myself(): VillageParticipant {
    return this.situation.participate.myself!
  }

  private get isAlive(): boolean {
    return this.myself.dead == null
  }

  private get imageUrl(): string {
    return this.myself.chara.face_list.find(face => face.type === 'NORMAL')!
      .image_url
  }

  private get imageWidth(): number {
    return this.myself.chara.display.width
  }

  private get imageHeight(): number {
    return this.myself.chara.display.height
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
