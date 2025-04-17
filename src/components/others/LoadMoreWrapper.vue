<template>
  <div class="load-more-wrapper">
    <slot name="content" @scroll="handleScroll"></slot>
    <div class="spinner" v-if="displaySpinner">
      <q-spinner color="primary" size="3em" />
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoadMoreWrapper',
  data() {
    return {
      adId: '',
    }
  },
  props: { displaySpinner: { type: Boolean } },
  created() {},
  methods: {
    handleScroll(e) {
      const { scrollTop, offsetHeight, scrollHeight } = e.target
      if (scrollTop === 0) {
        this.$emit('reached-end')
      }
    },
  },
})
</script>
<style lang="scss" scoped>
.load-more-wrapper {
  height: 100% !important;
  overflow-y: scroll;
}
</style>
