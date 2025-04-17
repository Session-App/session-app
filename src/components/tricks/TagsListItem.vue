<template>
  <div class="tags-list">
    <q-skeleton v-if="loading" class="tag skeleton" />
    <div v-else class="tag">
      <div class="content">
        <div class="left">
          {{ tag.name }}
          <div class="tricks-amount">
            {{ tag.tricksAmount }} {{ $t('tricks.tricks') }}
            <span v-if="tag.variationsAmount"
              >, {{ tag.variationsAmount }} {{ $t('tricks.variations') }}</span
            >
          </div>
        </div>
        <div class="right">
          <q-circular-progress
            :value="progress"
            show-value
            size="55px"
            color="primary"
            track-color="grey-3"
            class="progress"
          >
            <div class="value">{{ progress.toFixed(0) }}%</div>
          </q-circular-progress>
        </div>
      </div>
      <!-- <q-linear-progress size="6px" :value="tag.progress" /> -->
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TagsListItem',
  components: {},
  props: { tag: { type: Object }, loading: { type: Boolean, default: false } },
  data() {
    return {
      progress: 0,
    }
  },
  created() {
    this.sleep(200).then(() => {
      if (!this.loading) {
        this.progress = this.tag.progress
      }
    })
  },
  methods: {
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
  },
})
</script>
<style lang="scss" scoped>
@use '../../css/mixins.scss';
.tags-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  .tag {
    @include mixins.elevated-box;
    border-radius: 15px;
    margin: 5px 0px;
    width: 95vw;
    overflow: hidden;
    height: 75px;
    .content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      padding: 0px 10px;
      .left {
        .tricks-amount {
          font-size: 0.9em;
        }
      }
      .right {
        .value {
          color: $primary;
          font-size: 1.1em;
        }
      }
    }
  }
}
</style>
