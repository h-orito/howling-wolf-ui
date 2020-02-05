<template>
  <div class="loading-bg">
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
<script>
export default {
  props: {
    message: { type: String, default: '読み込み中', required: false }
  },
  data: () => ({}),
  computed: {},
  created() {},
  methods: {}
}
</script>

<style>
.loading-bg {
  background: #ffffff;
  width: 100%;
  height: calc(100vh - 52px);
  opacity: 0.6;
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
