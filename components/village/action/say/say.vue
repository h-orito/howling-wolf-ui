<template>
  <action-card :title="'発言する'">
    <template v-slot:content>
      <div class="content has-text-left">
        <div class="say-area">
          <div class="say-name-area">
            <p class="myself-name">{{ myself }}</p>
          </div>
          <b-field>
            <b-radio-button
              v-for="messageTypeSituation in situation.say
                .selectable_message_type_list"
              :key="messageTypeSituation.message_type.code"
              v-model="messageType"
              :native-value="messageTypeSituation.message_type.code"
              type="is-primary"
              size="is-small"
            >
              <span>{{ messageTypeSituation.message_type.name }}</span>
            </b-radio-button>
          </b-field>

          <div class="say-content-area">
            <div class="say-face-area">
              <img
                :src="imageUrl"
                :width="imageWidth"
                :height="imageHeight"
                class="say-chara-image"
              />
            </div>
            <div class="say-input-area">
              <message-input
                v-model="message"
                :message-type="messageType"
                :situation="situation.say"
                ref="messageInput"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <b-button @click="say" type="is-primary" size="is-small">
        発言する
      </b-button>
    </template>
  </action-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import actionCard from '~/components/village/action/action-card.vue'
import messageInput from '~/components/village/action/message-input.vue'
import SituationAsParticipant from '~/components/type/situation-as-participant'

@Component({
  components: { actionCard, messageInput }
})
export default class Say extends Vue {
  @Prop({ type: Object })
  private situation!: SituationAsParticipant

  private messageType: string = this.situation.say.default_message_type!.code
  private message: string = ''

  private get myself(): string {
    const self = this.situation.participate.myself!
    const charaName = self.chara.chara_name.name
    const skill = self.skill == null ? null : self.skill.name
    if (skill == null) {
      return charaName
    } else {
      return `${charaName}（${skill}）`
    }
  }

  private get imageUrl(): string {
    return this.situation.participate.myself!.chara.face_list.find(
      face => face.type === 'NORMAL'
    )!.image_url
  }

  private get imageWidth(): number {
    return this.situation.participate.myself!.chara.display.width
  }

  private get imageHeight(): number {
    return this.situation.participate.myself!.chara.display.height
  }

  private say(): void {}
}
</script>

<style lang="scss">
.say-area {
  .say-name-area {
    padding-bottom: 5px;
    display: flex;

    .myself-name {
      flex: 1;
      text-align: left;
      font-weight: bold;
    }
  }
  .say-content-area {
    display: flex;

    .say-face-area {
      padding-right: 5px;

      .say-chara-image {
        border-radius: 5px;
      }
    }

    .say-input-area {
      flex: 1;
    }
  }
}
</style>
