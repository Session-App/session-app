<template>
  <div :style="style" class="main-wrapper" @click="clicked">
    <div class="category-name">
      {{ partnerName }}
      <img :src="backgroundImage" alt="" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PartnersShow",
  data() {
    return {
      isClicked: false,
    };
  },
  props: {
    backgroundImage: {
      type: String,
    },
    partnerName: {
      type: String,
    },
  },

  methods: {
    clicked() {
      this.isClicked = !this.isClicked;
    },
  },
  computed: {
    style() {
      return "background-image: url(" + this.backgroundImage + ");";
    },
  },
});
</script>

<style lang="scss" scoped>
.main-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  border-radius: 15px;
  background-size: cover;
  background-repeat: no-repeat;
  margin: 10px;
  font-size: 3.4em;
  color: white;
  text-shadow: black 3px 0 10px;
  min-height: 150px;
}
</style>
