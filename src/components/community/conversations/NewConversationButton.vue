<template>
  <div class="new-conversation-button">
    <q-btn
      class="button"
      color="primary"
      dense
      @click="$emit('clicked')"
    >
      <img class="invert" src="svg/pencil.svg" />
    </q-btn>
  </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "NewConversationButton",
  data() {
    return {
      showOptions: false,
    };
  },
  props: [],
  created() {},
  mounted() {},

  methods: {
    optionClicked(type) {
      this.$emit("clicked", type);
      this.showOptions = false;
    },
  },
});
</script>
<style lang="scss" scoped>
.new-conversation-button {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .button {
    border-radius: 100px;
    width: 45px;
    height: 45px;
    img {
      width: 28px;
      margin-right: -2px;
    }
  }
}
</style>
