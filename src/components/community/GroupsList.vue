<template>
  <div class="groups">
    <div v-if="loading" class="list">
      <q-skeleton class="group" v-for="i in [1, 2, 3, 4]" :key="i" />
    </div>
    <div
      v-else
      class="group"
      v-for="group in groups"
      :key="group.id"
      @click="$emit('group-clicked', group)"
    >
      <img src="svg/community-outline.svg" class="pp-small picture" />
      <div class="name">{{ group.name }}</div>
    </div>
    <div class="no-result" v-if="groups.length === 0 && !loading">
      {{ $t("others.no_result") }}
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "GroupsList",
  data() {
    return {};
  },
  props: {
    groups: {},
    loading: {
      default: false,
    },
  },
  methods: {},
});
</script>
<style lang="scss" scoped>
@use "../../css/mixins.scss";
.groups {
  height: 100%;
  overflow-y: scroll;
  .group {
    @include mixins.elevated-box;
    border-radius: 10px;
    margin: 10px;
    padding: 5px;
    display: flex;
    min-height: 50px;
    align-items: center;
    .picture {
      padding: 3px;
      margin-right: 5px;
    }
  }
  .no-result {
    text-align: center;
    margin: 10px;
  }
}
</style>