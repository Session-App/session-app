<template>
  <transition enter-active-class="animated fadeInUp">
    <div class="bottom-card">
      <div class="close-button" @click="closeBottomCard">
        <img src="svg/cancel.svg" />
      </div>
      <div class="title-wrapper">
        <div class="spot-name">
          <slot name="spotName"></slot>
        </div>
      </div>
      <div class="content">
        <slot name="content"></slot>
      </div>
    </div>
  </transition>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "BottomCard",
  data() {
    return {};
  },
  props: {},
  methods: {
    closeBottomCard() {
      this.$emit("close-clicked");
      //this.$store.commit("map/setBottomCardOpened", false);
    },
  },
});
</script>
<style lang="scss" scoped>
.bottom-card {
  height: auto;
  position: fixed;
  bottom: $bottom-map-element;
  padding-top: 10px;
  width: 95vw;
  .title-wrapper {
    text-align: center;
    .spot-name {
      display: inline-block;
      background-color: $overlay-background;
      padding: 5px;
      margin-right: 35px;
      margin-left: 35px;
      margin-top: 10px;
      border-radius: 5px;
      font-size: 1.3em;
    }
  }
  .content {
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
    height: auto;
  }
  .close-button {
    z-index: 99999;
    position: fixed;
    right: 0;
    img {
      margin-right: 10px;
      width: 15px;
    }
  }
}
</style>
