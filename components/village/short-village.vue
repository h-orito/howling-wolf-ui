<template>
  <div>
    <div class="w4b-main">
      <div class="w4b-chat-area">
        <p class="w4b-chat-message">
          00:01 [楽]: 人狼なんているわけないじゃん。みんな大げさだなあ
        </p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [長]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
        <p class="w4b-chat-message">00:01 [宿]: おはようございます</p>
      </div>
    </div>
    <div class="w4b-lefttime">
      <p class="is-size-7">
        残り
        <span class="has-text-weight-bold">{{ leftTime }}</span> 秒
      </p>
      <progress
        :class="
          leftTime < 30
            ? 'is-danger'
            : leftTime < 60
            ? 'is-warning'
            : 'is-success'
        "
        :value="leftTime"
        :max="120"
        class="progress is-small"
      ></progress>
    </div>
    {{ villageId }}
    <div class="w4b-footer-info-area buttons are-small">
      <div>生存 7/13</div>
      <button class="button w4b-footer-button">CO</button>
      <button class="button w4b-footer-button">定型文</button>
      <button class="button w4b-footer-button">発言する</button>
    </div>
    <div class="w4b-footer-member-skill-area">
      <div class="w4b-footer-skill-area">
        <p class="is-size-2">占</p>
      </div>
      <div class="w4b-footer-member-area">
        <div class="w4b-icon-area">
          <div class="w4b-icon">楽</div>
          <p class="w4b-icon-status has-text-danger">2d▲</p>
        </div>
        <div class="w4b-icon-area">
          <div class="w4b-icon">長</div>
        </div>
        <div class="w4b-icon-area">
          <div class="w4b-icon">羊</div>
        </div>
        <div class="w4b-icon-area">
          <div class="w4b-icon">修</div>
        </div>
        <div class="w4b-icon-area">
          <div class="w4b-icon">書</div>
        </div>
        <div class="w4b-icon-area">
          <div class="w4b-icon">樵</div>
        </div>
        <div class="w4b-icon-area">
          <div class="w4b-icon">青</div>
        </div>
        <div class="w4b-icon-area">
          <div class="w4b-icon">旅</div>
        </div>
        <div class="w4b-icon-area">
          <div class="w4b-icon">商</div>
        </div>
        <div class="w4b-icon-area">
          <div class="w4b-icon">農</div>
        </div>
      </div>
    </div>
    <div class="w4b-footer-menu buttons are-small">
      <button class="button w4b-footer-button">メニュー</button>
      <button class="button w4b-footer-button">ルール</button>
      <button class="button w4b-footer-button">フィルタ</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Village from '~/components/type/village/village'

@Component({})
export default class ShortVillage extends Vue {
  @Prop({ type: Object })
  private village!: Village
}
</script>
