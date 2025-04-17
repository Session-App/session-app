<template>
  <div class="trick-detail-wrapper">
    <div class="top">
      <img src="svg/close.svg" class="close" @click="$emit('close')" />
    </div>
    <div class="trick">
      <q-skeleton v-if="loading" class="name skeleton" />
      <div class="name" v-else>{{ trick.name }}</div>
      <q-skeleton v-if="previewLoading && !noPreview" class="skeleton preview" />
      <img v-if="trick.preview === 'image'" v-show="!previewLoading" @error="noPreview = true" @load="previewLoading = false" :src="bucketUrl + 'tricks/' + trickId + '.jpg'" class="preview" />
      <video v-if="trick.preview === 'video'" :src="bucketUrl + 'tricks/' + trickId + '.mp4'" autoplay muted loop playsinline class="preview" v-show="!previewLoading" @error="noPreview = true" @loadeddata="previewLoading = false"></video>
      <div class="no-preview-yet preview" v-if="noPreview">{{$t('tricks.no_preview_yet')}}</div>
      <div class="misc-info">
        <div class="xp info">
          <div class="amount">
            <q-skeleton v-if="loading" class="skeleton" />
            {{ trick.points }}
            <img src="svg/xp.svg" />
          </div>
          {{ $t('tricks.points') }}
        </div>
        <div class="amount-learning info">
          <div class="amount">
            <q-skeleton v-if="loading" class="skeleton" />
            {{ trick.amountLearning }}
            <img src="svg/learning.svg" />
          </div>
          {{ $t('tricks.learning') }}
        </div>
        <div class="amount-mastered info">
          <div class="amount">
            <q-skeleton v-if="loading" class="skeleton" />
            {{ trick.amountMastered }}
            <img src="svg/tricks.svg" />
          </div>
          {{ $t('tricks.mastered') }}
        </div>
      </div>
      <div class="user-progression">
        <div class="title">{{ $t('tricks.my_progression') }}</div>
        <div class="buttons">
          <div class="button">
            <q-checkbox v-model="learning" @click="learnTrick" />
            <div class="label">{{ $t('tricks.learning') }}</div>
          </div>
          <div class="button">
            <q-checkbox v-model="mastered" @click="masterTrick" />
            <div class="label">{{ $t('tricks.mastered') }}</div>
          </div>
        </div>
      </div>
      <q-btn
        color="primary"
        no-caps
        :label="$t('tricks.add_media')"
        @click="addMediaPopup = true"
        v-if="false"
      />
      <a
        v-if="trick.video"
        :href="trick.video"
        target="_blank"
        class="video-tutorial"
      >
        <q-btn no-caps color="primary" class="btn">
          <div class="content">
            {{ $t('tricks.video_tutorial') }}
            <img src="svg/play-video.svg" class="invert" />
          </div>
        </q-btn>
      </a>
      <div class="variations" v-if="variationsAmount !== 0">
        <div class="title">{{ $t('tricks.variations') }}</div>
        <q-btn
          v-if="variations.length === 0"
          :label="$t('tricks.see_variations', [variationsAmount])"
          no-caps
          color="primary"
          @click="getVariations"
          :loading="variationsLoading"
        />
        <TrickListItem
          class="trick-list-item"
          v-for="trick in variations"
          :key="trick.id"
          :trick="trick"
          @click.stop="displayVariation(trick.id)"
          :mastered="tricksMastered.indexOf(trick.id) >= 0"
          :learning="tricksLearning.indexOf(trick.id) >= 0"
        />
      </div>
      <div class="section description">
        <!-- <ul class="content" v-if="loading">
          <li v-for="i in [1,2,3,4]" :key="i">
            <q-skeleton class="skeleton" />
          </li>
        </ul>-->
        <ul class="content">
          <li v-for="item in trick.description" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
    <q-dialog
      class="bottom-sheet big"
      v-model="variationDetailDialog"
      position="bottom"
    >
      <component
        :is="'TrickDetail'"
        v-if="!isVariation"
        :trickId="displayedVariationId"
        :tricksMastered="tricksMastered"
        :tricksLearning="tricksLearning"
        :isVariation="true"
        @close="variationDetailDialog = false"
        @updated-status="variationStatusUpdated"
      />
    </q-dialog>
    <q-dialog class="add-media-popup" v-model="addMediaPopup"
      ><AddMediaPopup :trickId="trickId" :mediaType="trick.preview" />
    </q-dialog>
  </div>
</template>
<script>
import { notify } from 'src/boot/helpers'
import { defineComponent } from 'vue'
import TrickListItem from 'components/tricks/TrickListItem'
import AddMediaPopup from 'components/tricks/AddMediaPopup'

export default defineComponent({
  components: { TrickListItem, AddMediaPopup },
  name: 'TrickDetail',
  props: {
    trickId: { type: Number },
    tricksMastered: { type: Array },
    tricksLearning: { type: Array },
    isVariation: { type: Boolean, default: false },
  },
  data() {
    return {
      loading: true,
      previewLoading: true,
      trick: {},
      variationsAmount: 0,
      variationsLoading: false,
      variations: [],
      mastered: false,
      learning: false,
      variationDetailDialog: false,
      displayedVariationId: 0,
      noPreview: false,
      addMediaPopup: false,
      bucketUrl: process.env.BUCKET_URL,
    }
  },
  created() {
    if (this.tricksLearning.indexOf(this.trickId) >= 0) {
      this.learning = true
    }
    if (this.tricksMastered.indexOf(this.trickId) >= 0) {
      this.mastered = true
    }
    this.$store
      .dispatch('tricks/getTrick', { trickId: this.trickId })
      .then((data) => {
        this.trick = data.trick
        this.variationsAmount = data.variationsAmount
        if (this.trick.preview === '') this.noPreview = true
        this.loading = false
      })
  },
  methods: {
    getVariations() {
      this.variationsLoading = true
      this.$store
        .dispatch('tricks/getTrickVariations', { trickId: this.trickId })
        .then((data) => {
          this.variations = data.tricks
          this.variationsLoading = false
        })
    },
    displayVariation(id) {
      this.displayedVariationId = id
      this.variationDetailDialog = true
    },
    variationStatusUpdated(data) {
      this.$emit('updated-status', data)
    },
    masterTrick() {
      this.$store.commit('setLoading', true)
      this.$store
        .dispatch('tricks/masterTrick', {
          trickId: this.trickId,
          mastered: this.mastered,
        })
        .then((data) => {
          this.$emit('updated-status', data)
          this.trick.amountLearning = data.amountLearning
          this.trick.amountMastered = data.amountMastered
          this.learning = false
          notify(['trick_status_applied'], 'green-3')
        })
        .catch((e) => {
          this.mastered = !this.mastered
          notify([e.errors])
        })
        .finally(() => {
          this.$store.commit('setLoading', false)
        })
    },
    learnTrick() {
      this.$store.commit('setLoading', true)
      this.$store
        .dispatch('tricks/learnTrick', {
          trickId: this.trickId,
          learning: this.learning,
        })
        .then((data) => {
          this.$emit('updated-status', data)
          this.trick.amountLearning = data.amountLearning
          notify(['trick_status_applied'], 'green-3')
        })
        .catch((e) => {
          console.log(e)
          this.learning = !this.learning
          notify([e.errors[0]])
        })
        .finally(() => {
          this.$store.commit('setLoading', false)
        })
    },
  },
})
</script>

<style lang="scss" scoped>
@use '../../css/mixins.scss';
.trick-detail-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  .top {
    width: 100%;
    .close {
      width: 17px;
      margin-top: 8px;
      margin-left: 10px;
    }
  }
  .trick {
    margin-top: -10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 95vw;
    .name {
      font-size: 1.8em;
      margin-bottom: 10px;
      text-align: center;
      &.skeleton {
        width: 200px;
      }
    }
    .preview {
      width: 95vw;
      border-radius: 15px;
      height: 95vw;
      &.no-preview-yet {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5em;
        text-align: center;
        @include mixins.elevated-box;
      }
    }
    .misc-info {
      display: flex;
      justify-content: space-around;
      width: 100%;
      margin-top: 15px;
      .info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .amount {
          color: $primary;
          font-size: 1.5em;
          font-weight: bold;
          display: flex;
          align-items: center;
          .skeleton {
            width: 55px;
          }
          img {
            width: 22px;
            margin-left: 5px;
          }
        }
      }
    }
    .user-progression {
      @include mixins.elevated-box;
      padding: 4px;
      border-radius: 15px;
      margin-top: 15px;
      width: 100%;
      text-align: center;
      .title {
        color: $primary;
      }
      .buttons {
        margin-top: 5px;
        display: flex;
        justify-content: space-around;
        .button {
          text-align: center;
        }
      }
    }

    .video-tutorial {
      text-decoration: none;
      border-radius: 10px;
      margin-top: 10px;
      .btn {
        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          img {
            width: 25px;
            margin: 2px;
          }
        }
      }
    }
    .variations {
      margin-top: 15px;
      width: 95vw;
      text-align: center;
      .title {
        font-weight: bold;
      }
      .trick-list-item {
        margin-bottom: 10px;
      }
    }
    .description {
      width: 100%;
      margin-top: 10px;
      li {
        margin-top: 5px;
        margin-left: -20px;
        .skeleton {
          height: 40px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.add-media-popup {
  z-index: 999999;
}
</style>
