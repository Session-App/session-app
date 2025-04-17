<template>
  <div class="tricks-list-item">
    <div class="left">
      <div class="trick-name">{{ trick.name }}</div>
    </div>
    <div class="right">
      <div class="status" v-if="learning || mastered">
        <img :src="'svg/' + (mastered ? 'tricks' : 'learning') + '.svg'" />
        {{$t('tricks.' + (mastered ? 'mastered' : 'learning'))}}
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TrickListItem',
  components: {},
  props: {
    trick: {},
    mastered: { type: Boolean },
    learning: { type: Boolean },
  },
  data() {
    return {}
  },
  created() {},
  methods: {},
})
</script>
<style lang="scss" scoped>
.tricks-list-item {
  min-height: 71px;
  padding-left: 10px;
  width: 95vw;
  margin: 5px;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 0px 3px #080808;
  border-radius: 15px;
  .left {
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 10px 0px;
    .trick-name {
      font-weight: bold;
    }
  }
  .right {
    .status {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      margin-right: 10px;
      color: $primary;
      img {
        width: 30px;
        margin-bottom: 2px;
      }
    }
  }
}
</style>
