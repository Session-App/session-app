<template>
  <div class="tutorial-popup">
    <div v-html="$t('others.tutorial_text')"></div>
    <div class="button-wrapper">
      <q-btn
        @click="$emit('ok')"
        :label="$t('others.ok') + '!'"
        :no-caps="true"
        color="primary"
      />
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Comment",
  data() {
    return {};
  },
  props: {},
  methods: {},
});
</script>
<style lang="scss" scoped>
.tutorial-popup {
  background-color: white;
  padding: 15px;
  border-radius: 14px;
  .button-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 15px;
  }
}
</style>
