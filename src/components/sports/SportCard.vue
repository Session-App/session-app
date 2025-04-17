<template>
  <div class="sport-card">
    <img :src="'svg/all-sports/' + sportId + '.svg'" />
    {{
      sportId === "favoriteSports"
        ? $t("sports." + sportId)
        : $t("sports.sports." + sportId)
    }}
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "SportCategory",
  props: ["sportId"],
});
</script>

<style lang="scss" scoped>
.sport-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 40vw;
  border-radius: 7px;
  justify-content: center;
  color: white;
  text-shadow: 1px 2px black;
  background-color: #4d9fcc;
  img {
    width: 70px;
  }
}
</style>
