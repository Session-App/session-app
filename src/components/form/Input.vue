<template>
  <q-input
    :label="label"
    label-color="black"
    input-style="color:black"
    borderless
    :type="type"
    class="custom-input"
    @focus="inputState(true)"
    @focusout="inputState(false)"
    ><slot></slot
  ></q-input>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Input",
  data() {
    return {
      isClicked: false,
    };
  },
  props: {
    label: {
      type: String,
    },
    type: {
      type: String,
      default: "text",
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
<style lang="scss" >
@use "../../css/mixins.scss";

.custom-input {
  @include mixins.elevated-box;
  border-radius: 15px;
  padding-right: 15px;
  padding-left: 15px;
}
</style>
