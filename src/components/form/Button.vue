<template>
  <q-btn
    class="custom-button"
    :label="label"
    :color="color"
    label-color="black"
    :no-caps="true"
  />
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Button",
  data() {
    return {
      isClicked: false,
    };
  },
  props: {
    label: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  methods: {
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    inputState(value) {
      if (value === true) {
        this.$store.commit("setInputState", value);
      } else {
        this.$store.commit("setInputState", value);
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.custom-button {
  border-radius: $button-border-radius;
}
</style>
