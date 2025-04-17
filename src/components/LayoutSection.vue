<template>
  <q-btn class="button" :no-caps="true" flat>
    <div class="section">
      <div class="section-icon">
        <img :src="icon" :class="iconClass" />
      </div>
      <span class="section-name">{{ name }}</span>
    </div>
  </q-btn>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "LayoutSection",
  data() {
    return {
      isClicked: false,
    };
  },
  props: ["icon", "iconClass", "name", "iconSize"],
});
</script>

<style lang="scss" scoped>
.button {
  padding-right: 0px;
  padding-left: 0px;
  width: 20%;
  height: 100%;
  .section {
    display: flex;
    flex-direction: column;
    align-items: center;
    .section-icon {
      margin-bottom: -3px;
      margin-top: 3px;
      img {
        width: 35px;
        height: 35px;
      }
      .sessions-map {
        padding: 3px;
      }
    }
    .section-name {
      color: #171717;
      margin-top: -8px;
      font-size: 0.85em;
    }
  }
}
</style>
