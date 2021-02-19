<template functional>
  <div
    class="hw-message-card"
    :class="[
      props.message.is_anchor_message ? 'anchor-message' : '',
      props.isDarkTheme ? 'dark-theme' : ''
    ]"
  >
    <div class="hw-message-name-area">
      <span v-if="props.message.is_disp_anchor">
        <a
          href="javascript:void(0);"
          @click="listeners['copy-anchor-string']"
          >{{ props.message.anchor_string }}</a
        >.&nbsp;</span
      >
      <p class="hw-message-name">{{ props.message.chara_name }}</p>
      <p v-if="props.comingout" class="coming-out">
        {{ props.message.comingout }}
      </p>
      <p class="hw-message-player" v-if="props.message.twitter_user_name">
        [<a
          :href="'https://twitter.com/' + props.message.twitter_user_name"
          target="_blank"
          >{{ props.message.twitter_user_name }}</a
        >]
      </p>
      <p
        class="hw-message-datetime"
        :class="props.isDarkTheme ? 'dark-theme' : ''"
      >
        {{ props.message.is_anchor_message ? props.message.day + 'd' : '' }}
        {{
          props.message.current_count && props.message.max_count
            ? `(${props.message.current_count}/${props.message.max_count})`
            : ''
        }}
        {{ props.message.datetime }}
      </p>
    </div>
    <div class="hw-message-content-area">
      <div class="hw-message-face-area">
        <img
          class="hw-message-chara-image"
          :src="
            props.message.chara.face_list.find(
              face => face.type === props.message.face_type_code
            ).image_url
          "
          :alt="props.message.chara_name"
          :width="
            props.message.chara.display.width * (props.isImgLarge ? 1.5 : 1)
          "
          :height="
            props.message.chara.display.height * (props.isImgLarge ? 1.5 : 1)
          "
        />
      </div>
      <div
        class="hw-message-text-area"
        :class="[
          props.message.message_class,
          props.isDarkTheme ? 'dark-theme' : ''
        ]"
      >
        <p class="hw-message-text">
          <span v-for="line in props.message.message_lines" :key="line.id"
            ><span v-for="sentence in line.sentences" :key="sentence.id">
              <a
                v-if="sentence.is_anchor"
                @click="listeners['click-anchor'](sentence.text)"
                v-html="sentence.text"
                href="javascript:void(0);"
              ></a
              ><span v-else v-html="sentence.text"></span>
            </span>
            <br
          /></span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { SayMessage } from '~/components/village/message/message-converter'

@Component({})
export default class MessageSay extends Vue {
  @Prop({ type: Object })
  private message!: SayMessage

  @Prop({ type: Boolean })
  private isDarkTheme!: boolean

  @Prop({ type: Boolean })
  private isImgLarge!: boolean
}
</script>

<style lang="scss" scoped>
.hw-message-card {
  margin-bottom: 5px;

  &.anchor-message {
    margin-left: 50px;
    margin-bottom: 5px;
  }

  .hw-message-name-area {
    padding-bottom: 5px;
    display: flex;

    p {
      margin-bottom: 0;
    }

    .hw-message-name {
      text-align: left;
      font-weight: bold;
    }
    .coming-out {
      font-size: 11px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-left: 5px;
      padding: 1px 3px;
    }
    .hw-message-player {
      margin-left: 5px;
      text-align: left;
    }
    .hw-message-datetime {
      margin-left: auto;
      text-align: right;
      color: #aaaaaa;

      &.dark-theme {
        color: #ddd;
      }
    }
  }
  .hw-message-content-area {
    display: flex;

    .hw-message-face-area {
      padding-right: 5px;

      img {
        border-radius: 5px;
        vertical-align: bottom;
      }

      .hw-message-chara-image {
        vertical-align: bottom;
        border-radius: 5px;
      }
    }

    .hw-message-text-area {
      flex: 1;
      border: 1px solid #dddddd;
      border-radius: 5px;
      padding: 5px;
      font-family: sans-serif;

      .hw-message-text {
        text-align: left;
        word-break: break-word;
      }

      &.normal-say {
        background-color: $normal-say;
        color: $black;
      }
      &.werewolf-say {
        background-color: $werewolf-say;
        color: $black;

        &.dark-theme {
          background-color: $werewolf-say-dark;
          border: 1px solid $werewolf-say-dark;
        }
      }
      &.monologue-say {
        background-color: $monologue-say;
        color: $black;

        &.dark-theme {
          background-color: $monologue-say-dark;
          border: 1px solid $monologue-say-dark;
        }
      }
      &.grave-say {
        background-color: $grave-say;
        color: $black;

        &.dark-theme {
          background-color: $grave-say-dark;
          border: 1px solid $grave-say-dark;
        }
      }
      &.spectate-say {
        background-color: $spectate-say;
        color: $black;
      }
    }
  }
}
</style>

<style lang="scss">
.hw-message-text {
  a:not(.button):not(.is-current) {
    color: $primary !important;
    font-weight: bold;
  }
}
</style>
