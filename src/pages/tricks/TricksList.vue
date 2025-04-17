<template>
  <div class="tricks-list">
    <div class="tag">
      <div class="name">{{ $route.query.tagName }}</div>
      <div class="progress">
        {{ $t('tricks.progress') }}
        <q-circular-progress
          :value="tagProgress"
          show-value
          size="55px"
          color="primary"
          track-color="grey-3"
        >
          <div class="value">{{ tagProgress.toFixed(0) }}%</div>
        </q-circular-progress>
      </div>
    </div>
    <TrickListItem
      v-for="trick in tricks"
      :key="trick.id"
      :trick="trick"
      @click.stop="displayTrick(trick.id)"
      :mastered="tricksMastered.indexOf(trick.id) >= 0"
      :learning="tricksLearning.indexOf(trick.id) >= 0"
    />
    <q-dialog
      class="bottom-sheet big"
      v-model="trickDetailDialog"
      position="bottom"
    >
      <TrickDetail
        :trickId="displayedTrickId"
        :tricksMastered="tricksMastered"
        :tricksLearning="tricksLearning"
        @close="trickDetailDialog = false"
        @updated-status="trickStatusUpdated"
      />
    </q-dialog>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import TrickDetail from 'components/tricks/TrickDetail'
import TrickListItem from 'components/tricks/TrickListItem'

export default defineComponent({
  name: 'TricksList',
  components: {
    TrickDetail,
    TrickListItem,
  },
  data() {
    return {
      tricks: [],
      page: 1,
      size: 1000,
      trickDetailDialog: false,
      displayedTrickId: null,
      tricksMastered: [],
      tricksLearning: [],
      tagProgress: 0,
    }
  },
  created() {
    this.tricksMastered = localStorage.getItem('tricksMastered')
      ? localStorage.getItem('tricksMastered').split(',').map(Number)
      : []
    this.tricksLearning = localStorage.getItem('tricksLearning')
      ? localStorage.getItem('tricksLearning').split(',').map(Number)
      : []
    this.$store
      .dispatch('tricks/getTricks', {
        sportId: this.$route.query.sportId,
        page: this.page,
        size: this.size,
        tagId: this.$route.query.tagId,
      })
      .then((data) => {
        this.tricks = data.tricks
        this.updateTagProgress()
        // this.page++
      })
  },
  methods: {
    updateTagProgress() {
      const masteredTags =
        JSON.parse(localStorage.getItem('masteredTags')) ?? {}
      this.tagProgress =
        100 *
        (parseInt(
          masteredTags[this.$route.query.sportId][this.$route.query.tagId] ?? 0
        ) /
          parseInt(this.$route.query.totalAmount))
    },
    trickStatusUpdated(payload) {
      this.tricksLearning = payload.tricksLearning.map(Number)
      localStorage.setItem('tricksLearning', this.tricksLearning)
      if (payload.tricksMastered) {
        this.tricksMastered = payload.tricksMastered.map(Number)
        localStorage.setItem('tricksMastered', this.tricksMastered)
      }
      if (payload.sportXP) {
        localStorage.setItem('sportXP', JSON.stringify(payload.sportXP))
        localStorage.setItem(
          'masteredTags',
          JSON.stringify(payload.masteredTags)
        )
        this.updateTagProgress()
      }
    },
    displayTrick(trickId) {
      this.displayedTrickId = trickId
      this.trickDetailDialog = true
    },
  },
})
</script>
<style lang="scss" scoped>
@use '../../css/mixins.scss';
.tricks-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  height: var(--page-height);
  overflow-y: scroll;
  .tag {
    @include mixins.elevated-box;
    padding: 10px;
    border-radius: 15px;
    margin: 10px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .name {
      font-size: 1.5em;
    }
    .progress {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .value {
        color: $primary;
      }
    }
  }
}
</style>
