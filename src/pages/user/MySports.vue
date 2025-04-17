<template>
  <div class="main-wrapper" id="favorite-sports-page">
    <div class="sports-wrapper" v-if="user.favoriteSports.length !== 0">
      <div class="favorite-sport" v-for="sport in user.favoriteSports" :key="sport" @click="openSportPopup(sport)">
        <div class="sport-name" :style="
            'background-image: url(images/sport-specific/' + sport + '.jpg);'
          ">{{ $t("sports.sports." + sport) }}</div>
      </div>
      <div class="favorite-sport" @click="openSportPopup('favoriteSports')">
        <div class="sport-name all-favorite-sports">{{ $t("sports.all_favorite_sports") }}</div>
      </div>
    </div>
    <div class="no-sports" v-else>{{ $t("sports.no_favorite_sports_add") }}</div>
    <q-btn color="primary" :label="$t('account.edit_favorite_sports')" :no-caps="true" class="select-fav-sports-btn" @click="favoriteSportsDialog = true" />
    <q-dialog class="picker-popup" v-model="favoriteSportsDialog" style="z-index: 999999">
      <SportsPicker :alreadySelected="user.favoriteSports" :updateFavorites="true" @sports-selected="updateFavoriteSports" />
    </q-dialog>
    <q-dialog v-model="sportPopup">
      <SportFeatures :sportId="selectedSport" class="popup" />
    </q-dialog>
  </div>
</template>

<script charset="utf-8">
import { getFavoriteSports } from 'boot/helpers'
import SportFeatures from 'components/sports/SportFeatures'
import SportsPicker from 'components/sports/SportsPicker'

export default {
  components: { SportFeatures, SportsPicker },
  data() {
    return {
      user: {
        favoriteSports: [],
      },
      sportPopup: false,
      selectedSport: null,
      favoriteSportsDialog: false,
    }
  },
  created() {
    this.user.favoriteSports = getFavoriteSports()
  },
  methods: {
    updateFavoriteSports(sports) {
      this.user.favoriteSports = sports
      localStorage.setItem('favoriteSports', sports)
      this.favoriteSportsDialog = false
    },
    openSportPopup(sport) {
      this.selectedSport = sport
      this.sportPopup = true
    },
  },
}
</script>

<style lang="scss" scoped>
.main-wrapper {
  height: var(--page-height);
  background: $background-gradient;
  position: fixed;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.choose-sport-title {
  margin-top: 10px;
  text-align: center;
  font-size: 1.8em;
  color: white;
}
.sports-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.favorite-sport {
  .sport-name {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 2.5em;
    color: white;
    text-shadow: black 2px 0 5px;
    min-height: 150px;
    width: 95vw;
    border-radius: 15px;
    margin: 10px;
    background-size: cover;
    &.all-favorite-sports {
      background-color: $secondary;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
      background-origin: content-box;
      padding: 20px;
    }
  }
}
.select-fav-sports-btn {
  margin-bottom: 10px;
}
.no-sports {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 30vh;
  margin-bottom: 5vh;
  color: white;
  font-size: 1.5em;
}
</style>
