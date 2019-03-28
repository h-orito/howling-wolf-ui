<template>
  <div class="column is-half-tablet">
    <div class="card">
      <header class="card-header">
        <nuxt-link
          :to="{ path: 'village', query: { id: village.id } }"
          class="card-header-title has-text-grey"
          >{{ village.name }}</nuxt-link
        >
      </header>
      <div class="card-content">
        <div class="content has-text-left">
          <b-tag rounded>{{ village.status }}</b-tag>
          <b-tag rounded>{{ village.talkType + '形式' }}</b-tag>
          <b-tag rounded>{{ village.progress }}</b-tag>
        </div>
        <div class="content has-text-left">
          <p class="has-text-left is-size-7">作成者: {{ village.creator }}</p>
          <p class="has-text-left is-size-7">
            参加人数:
            {{
              village.parcicipateNum +
                '/' +
                village.participateCapacity +
                ' (見学 ' +
                village.spectateNum +
                '名)'
            }}
          </p>
        </div>
      </div>
      <footer class="card-footer">
        <div class="card-footer-item has-text-left">
          <p class="content has-text-left is-size-7">{{ village.comment }}</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    village: {
      type: Object,
      required: true
    }
  }
}
</script>
