<template>
  <div class="button-wrapper load-more">
    <div class="load-more-button">
      {{ $t("spots.load_more") }}
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoadMore",
  data() {
    return {};
  },
  props: {
    name: {
      type: String,
    },
  },
});
</script>
<style lang="scss" scoped>
.button-wrapper {
  position: fixed;
  bottom: $bottom-map-element;
  z-index: 2147483647;
  display: flex;
  justify-content: center;
  background-color: $primary !important;
  color: white;
  .load-more-button {
    padding: 7px;
  }
}
</style>
