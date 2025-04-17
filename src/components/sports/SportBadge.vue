<template>
  <div class="sport-badge">
    <img :src="'svg/all-sports/' + sportId + '.svg'" />
    <span>{{ $t("sports.sports." + sportId) }}</span>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "SportBadge",
  props: ["sportId"],
});
</script>

<style lang="scss" scoped>
.sport-badge {
  display: flex;
  align-items: center;
  text-align: center;
  border-radius: 7px;
  justify-content: center;
  color: white;
  background-color: $secondary;
  padding: 5px;
  font-size: 0.9em;
  width: fit-content;
  img {
    width: 20px;
    margin-right: 5px;
  }
}
</style>
