<template>
  <div class="wrapper" id="spots-bottom-sheet">
    <div class="close-sheet">
      <img src="svg/close.svg" @click="$emit('close-clicked')" />
    </div>
    <SpotsList
      :sportBadge="true"
      :tagBadges="false"
      :spots="spots.spots"
      :loadMore="amount > spots.spots.length"
      :loadingMore="isDataLoading"
      :loading="isDataLoading"
      @spot-clicked="displaySpot"
      @load-more="getSpots"
      class="spots-list"
      v-if="amount !== 0 && !isDataLoading"
    />
    <div class="no-spot" v-if="amount === 0 && !isDataLoading">
      <span
        v-html="
          this.userId !== null
            ? $t('account.no_spot_foreign_' + spotsType, [username])
            : $t('account.no_spot_' + spotsType)
        "
      />
    </div>
    <q-dialog
      class="bottom-sheet big"
      v-model="spotDetailDialog"
      position="bottom"
    >
      <SpotDetail :spotId="spot.id" @close-clicked="spotDetailDialog = false" />
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import SpotDetail from 'components/spots/SpotDetail'
import SportBadge from 'components/sports/SportBadge'
import SpotsList from 'components/others/SpotsList'
import { formatDateFromBack } from 'boot/helpers'

export default defineComponent({
  name: 'spotssBottomSheet',
  components: { SpotDetail, SportBadge, SpotsList },
  props: { spotsType: {}, amount: {}, username: {}, userId: { default: null } },
  data() {
    return {
      detailState: true,
      spotDetailDialog: false,
      spot: null,
      spots: { spots: [], page: 1 },
      isDataLoading: true,
    }
  },
  created() {
    this.getSpots()
    this.formatDateFromBack = formatDateFromBack
  },
  methods: {
    getSpots() {
      if (this.amount == 0) {
        this.isDataLoading = false
        return
      }
      this.isDataLoading = true
      var link
      if (this.spotsType === 'added') {
        link = 'getAddedSpots'
      } else if (this.spotsType === 'favorite') {
        link = 'getFavoriteSpots'
      }
      this.$store
        .dispatch('user/' + link, {
          page: this.spots.page,
          userId:
            this.userId !== null ? this.userId : localStorage.getItem('userId'),
        })
        .then((data) => {
          this.spots.spots = [...this.spots.spots, ...data.spots]
          this.isDataLoading = false
          this.spots.page++
        })
    },
    displaySpot(spot) {
      this.spot = spot
      this.spotDetailDialog = true
    },
  },
})
</script>

<style lang="scss" scoped>
.wrapper {
  box-shadow: none;
  overflow: hidden;
  .spots-list {
    padding-bottom: 20px;
  }
  .close-sheet {
    img {
      margin-top: 10px;
      margin-left: 2px;
      width: 16px;
      margin-left: 8px;
      margin-top: 13px;
    }
  }
  .no-spot {
    text-align: center;
    margin: 0px 5px;
    margin-top: 15px;
    margin-bottom: 30px;
  }
}
</style>
