<template>
  <div>
    <div class="main-wrapper">
      <div class="above-map top-card">
        <div class="top-line">
          <div>
            <input id="toggle-on" class="toggle toggle-left" name="toggle" value="false" type="radio" checked />
            <label @click="switchMode('list')" for="toggle-on" class="switch">{{ $t('spots.list') }}</label>
            <input id="toggle-off" class="toggle toggle-right" name="toggle" value="true" type="radio" />
            <label @click="switchMode('map')" for="toggle-off" class="switch">{{ $t('spots.map') }}</label>
          </div>
        </div>

        <!--<FiltersDialog :tags="tags" />-->
      </div>

      <SportSpotsList v-show="list" @spot-clicked="displaySpot" />
      <Map @moveend="moveEnd" @got-bounds="maybeLoadMoreSpots" @marker-clicked="displaySpot" @place-clicked="loadMoreSpots(currentCoordinates)" :userAmountInArea="userAmountInArea" :points="displayedSpots" :previouslySelectedMarker="previouslySelectedMarker" addMarkersMethod="add" v-if="mapAlreadyLoaded" v-show="!list" />
      <BottomCard @close-clicked="closeBottomCard" v-if="displayedSpotBrief.id !== undefined && !list" class="above-map">
        <template v-slot:spotName>
          <span>{{ displayedSpotBrief.name }}</span>
          <div class="distance" v-if="displayedSpotBrief.distance !== undefined">
            <span class="km" v-if="displayedSpotBrief.distance.km !== 0">{{ displayedSpotBrief.distance.km }}km</span>
            <span class="m" v-else>{{ displayedSpotBrief.distance.m }}m</span>
          </div>
        </template>

        <template v-slot:content>
          <div class="content-wrapper">
            <div class="pictures" v-if="!isExtraInfoLoading">
              <img :src="cloudFrontUrl + '/' + picture.name" v-for="picture in displayedSpotBrief.extraInfo.pictures.slice(
                  0,
                  2
                )" :key="picture" />
            </div>
            <div class="more-details" @click="goToNewSession(displayedSpotBrief)">{{ $t('sessions.set_a_session_here') }}</div>
            <div class="more-details" @click="goToNewSession(displayedSpotBrief)">{{ $t('sessions.set_a_session_here') }}</div>
          </div>
        </template>
      </BottomCard>
      <LoadMore :name="$t('spots.load_more')" @click="loadMoreSpots(currentCoordinates)" v-if="loadMoreButton && displayedSpotBrief.id === undefined && !list" class="above-map load-more"></LoadMore>
    </div>
    <q-dialog class="bottom-sheet big" v-model="spotDetailDialog" position="bottom">
      <SpotDetail :spotId="displayedSpot.id" @close-clicked="spotDetailDialog = false" />
    </q-dialog>
  </div>
</template>
<script>
import BottomCard from 'components/map/BottomCard'
import FiltersDialog from 'components/map/FiltersDialog'
import LoadMore from 'components/map/LoadMore'
import Button from 'components/form/Button'
import Map from 'components/map/Map'
import SportSpotsList from 'components/spots/SportSpotsList'
import SpotDetail from 'components/spots/SpotDetail'
import { addDistanceToSpots } from 'src/boot/helpers'
import { mapGetters } from 'vuex'
//this is a copy of the spots to display the spots again if the user is coming back from spotDetail
// var displayedSpots;
// var displayedSortedSpots;

export default {
  components: {
    BottomCard,
    LoadMore,
    Button,
    FiltersDialog,
    Map,
    SportSpotsList,
    SpotDetail,
  },
  data() {
    return {
      list: true,
      mapAlreadyLoaded: false,
      spots: [],
      userAmountInArea: 0,
      // displayedSortedSpots: [],
      displayedSpots: [],
      //to know at which index was the last added spot on the map
      markers: null,
      selectedTags: [],
      displayedSpotBrief: {},
      isExtraInfoLoading: false,
      cloudFrontUrl:
        'https://d1tqac1zek46ma.cloudfront.net/spots_' +
        this.$route.query.sportId,
      currentCoordinates: {},
      previouslySelectedMarker: null,
      loadMoreButton: false,
      userLocation: null,
      spotDetailDialog: false,
      displayedSpot: null,
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from
    })
  },
  computed: {
    ...mapGetters(['map/getUserLocation']),
    viewUserLocation() {
      return this['map/getUserLocation']
    },
  },
  watch: {
    spotDetailDialog(newVal) {
      if (!newVal) {
        //this.$store.commit("map/setBottomCardOpened", false);
      }
    },
    viewUserLocation(newValue) {
      if (/*this.displayedSortedSpots.length === 0 && */ !this.list) {
        this.userLocation = newValue
        this.displayedSpotBrief = {}
      }
    },
  },
  methods: {
    maybeLoadMoreSpots(mapBounds) {
      // if (
      //   this.prevRoute &&
      //   this.prevRoute.query.comingFromSpotLat !== undefined
      // ) {
      //   this.displayedSpots = displayedSpots;
      //   this.displayedSortedSpots = displayedSortedSpots;
      //   this.previouslySelectedMarker = {
      //     lat: this.prevRoute.query.comingFromSpotLat,
      //     lon: this.prevRoute.query.comingFromSpotLon,
      //   };
      // } else {
      this.loadMoreSpots(mapBounds)
      // }
    },
    closeBottomCard() {
      this.displayedSpotBrief = {}
    },
    moveEnd(mapBounds) {
      this.currentCoordinates = mapBounds
      this.loadMoreButton = true
    },
    loadMoreSpots(mapBounds) {
      this.$store.commit('setLoading', true)
      this.$store
        .dispatch('spots/getSpots', {
          sportId: this.$route.query.sportId,
          mapNorthEastLat: mapBounds._northEast.lat,

          mapNorthEastLng: mapBounds._northEast.lng,
          mapSouthWestLat: mapBounds._southWest.lat,
          mapSouthWestLng: mapBounds._southWest.lng,
        })
        .then((data) => {
          this.$store.commit('setLoading', false)
          this.userAmountInArea = data.userAmountInArea
          var ids = new Set(this.displayedSpots.map((d) => d.id))
          let previousDisplayedSpots = this.displayedSpots
          this.displayedSpots = [
            ...this.displayedSpots,
            ...data.spots.filter((d) => !ids.has(d.id)),
          ]
          if (this.viewUserLocation !== undefined) {
            this.displayedSpots = previousDisplayedSpots.concat(
              addDistanceToSpots(
                [...this.displayedSpots].splice(previousDisplayedSpots.length),
                this.viewUserLocation
              )
            )
            // this.displayedSortedSpots = insertInSortedSpotsList(
            //   [...this.displayedSortedSpots],
            //   [...this.displayedSpots].splice(this.displayedSortedSpots.length)
            // )
          }
          // displayedSpots = this.displayedSpots;
          // displayedSortedSpots = this.displayedSortedSpots;
          this.loadMoreButton = false
        })
    },
    switchMode(mode) {
      if (mode === 'map') {
        this.mapAlreadyLoaded = true
        this.list = false
      } else {
        this.list = true
      }
    },
    displaySpot(spot) {
      if (this.$route.query.action === 'new-session') {
        if (!this.list && this.displayedSpotBrief.id !== spot.id) {
          this.isExtraInfoLoading = true
          this.displayedSpotBrief = spot
          //this.$store.commit("map/setBottomCardOpened", true);
          this.$store
            .dispatch('spots/getSpotDetailBrief', spot.id)
            .then((data) => {
              this.displayedSpotBrief.extraInfo = data
              this.isExtraInfoLoading = false
            })
        } else if (this.list) {
          this.goToNewSession(spot)
        }
      } else if (this.$route.query.action !== 'new-session') {
        this.displayedSpot = spot
        this.spotDetailDialog = true
      }
    },
    goToNewSession(spot) {
      this.$router.push({
        name: 'add-session',
        query: {
          sportId: this.$route.query.sportId,
          spotId: spot.id,
          spotName: spot.name,
          comingFromSpotLon: spot.lon,
          comingFromSpotLat: spot.lat,
          action: this.$route.query.action,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../css/map.scss';

.main-wrapper {
  .load-more {
    box-shadow: 0 0px 3px #080808;
  }
  .top-line {
    display: flex;
    align-items: center;
    margin: 5px;

    .choose-spot {
      font-size: 1.5em;
      margin-top: 7px;
    }
    .switch {
      display: inline-block;
      padding: 10px;
      position: relative;
      text-align: center;
      transition: background 600ms ease, color 600ms ease;
    }
    input[type='radio'].toggle {
      display: none;
      & + label {
        cursor: pointer;
        min-width: 60px;

        &:after {
          background: $primary;
          border-radius: $button-border-radius;
          box-shadow: 0 0px 3px #080808;
          content: '';
          height: 100%;
          position: absolute;
          top: 0;
          transition: left 200ms cubic-bezier(0.77, 0, 0.175, 1);
          width: 100%;
          z-index: -1;
        }
      }
      &.toggle-left + label {
        border-right: 0;
        &:after {
          left: 100%;
        }
      }
      &.toggle-right + label {
        &:after {
          left: -100%;
        }
      }
      &:checked + label {
        cursor: default;
        color: #fff;
        transition: color 200ms;
        &:after {
          left: 0;
        }
      }
    }
  }

  .bottom-card {
    .distance {
      font-size: 0.8em;
      color: rgba(0, 0, 0, 0.8);
    }
    .pictures {
      img {
        vertical-align: middle;
        height: 75px;
        margin-right: 10px;
        margin-left: 10px;
        border-radius: 10px;
      }
    }
    .content-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;

      .more-details {
        margin: 5px;
        margin-top: 10px;
        background-color: $overlay-background;
        backdrop-filter: $overlay-blur;
        padding: 5px;
        border-radius: 7px;
      }
    }
  }
}
</style>
