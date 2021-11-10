<template>
  <div>
    <action-card
      :title="ability.type.name"
      :id="id"
      :is-open="isOpen"
      :exists-footer="false"
    >
      <template v-slot:content>
        <div class="content has-text-left">
          <notification v-if="!isAlive" type="info" class="m-b-5">
            あなたは死亡しました。
          </notification>
          <notification type="default" class="m-b-5">
            <span style="white-space: pre-line;">{{ skillDescription }}</span>
          </notification>
          <div v-if="ability.usable && ability.attacker_list.length > 0">
            <p>現在の襲撃担当者: {{ currentAttackerName }}</p>
            <b-collapse :open="false" aria-id="contentIdForA11y1">
              <template #trigger>
                <p style="font-weight: 700; margin-bottom: 6px;">
                  襲撃担当者
                  <a aria-controls="contentIdForA11y1">
                    <b-icon
                      pack="fas"
                      icon="question-circle"
                      size="is-small"
                    ></b-icon>
                  </a>
                </p>
              </template>
              <div class="notification">
                <div class="content">
                  <p>猫又を襲撃した場合、襲撃担当者が道連れとなります。</p>
                </div>
              </div>
            </b-collapse>
            <b-field>
              <b-select v-model="attackerId" expanded size="is-small">
                <option
                  v-for="participant in ability.attacker_list"
                  :value="participant.id.toString()"
                  :key="participant.id.toString()"
                  >{{ participant.chara.chara_name.full_name }}</option
                >
              </b-select>
            </b-field>
            <hr />
          </div>
          <p>{{ `現在の${ability.type.name}先: ${currentTargetName}` }}</p>
          <p style="font-weight: 700; margin-bottom: 6px;">対象</p>
          <b-field>
            <b-select
              v-model="participantId"
              :disabled="!ability.usable || ability.target_list.length === 0"
              expanded
              size="is-small"
            >
              <option v-if="ability.available_no_target" value="">
                なし
              </option>
              <option
                v-for="participant in ability.target_list"
                :value="participant.id.toString()"
                :key="participant.id.toString()"
                >{{ participant.chara.chara_name.full_name }}</option
              >
            </b-select>
          </b-field>
        </div>
        <div class="action-button-area">
          <b-button
            :disabled="!canSubmit || submitting"
            @click="setAbility"
            type="is-primary"
            size="is-small"
            >{{ ability.type.name + 'セットする' }}</b-button
          >
        </div>
      </template>
    </action-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// components
import actionCard from '~/components/village/action/action-card.vue'
// type
import SituationAsParticipant from '~/components/type/situation-as-participant'
import VillageAbilitySituation from '~/components/type/village-ability-situation'
import VillageParticipant from '~/components/type/village-participant'
import api from '~/components/village/village-api'
import toast from '~/components/village/village-toast'
import villageUserSettings from '~/components/village/user-settings/village-user-settings'
// dynamic import
const notification = () =>
  import('~/components/village/village-notification.vue')

@Component({
  components: { actionCard, notification }
})
export default class Ability extends Vue {
  @Prop({ type: Object })
  private ability!: VillageAbilitySituation

  private submitting: boolean = false
  private attackerId: number | null =
    this.ability.attacker == null ? null : this.ability.attacker.id

  private participantId: number | null =
    this.ability.target == null ? null : this.ability.target.id

  private id: string = `${this.ability.type.code}-aria-id`
  private isOpen: boolean =
    villageUserSettings.getActionWindow(this).open_map![this.id] == null
      ? true
      : villageUserSettings.getActionWindow(this).open_map![this.id]

  private get villageId(): number {
    return this.$store.getters.getVillageId!
  }

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
    return this.myself.skill!.description.replaceAll('。', '。\n')
  }

  private get currentAttackerName(): string {
    if (!this.ability.attacker) return 'なし'
    return this.ability.attacker.chara.chara_name.full_name
  }

  private get currentTargetName(): string {
    if (!this.ability.target) return 'なし'
    return this.ability.target.chara.chara_name.full_name
  }

  private get canSubmit(): boolean {
    if (this.submitting) return false
    if (this.ability.available_no_target) {
      return this.ability.usable && this.ability.target_list.length !== 0
    } else {
      return (
        this.ability.usable &&
        this.ability.target_list.length !== 0 &&
        this.participantId != null
      )
    }
  }

  private resetTarget(): void {
    this.participantId =
      this.ability.target == null ? null : this.ability.target.id
  }

  private async setAbility(): Promise<void> {
    this.submitting = true
    await api.postAbility(
      this,
      this.villageId,
      this.attackerId,
      this.participantId,
      this.ability.type.code
    )
    this.submitting = false
    toast.success(this, 'セットしました')
    this.$emit('reload')
  }
}
</script>
