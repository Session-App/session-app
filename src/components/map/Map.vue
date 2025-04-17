<template>
  <div class="map-wrapper">
    <div class="user-amount above-map" v-if="userAmountInArea !== 0">
      <div class="value">{{userAmountInArea}}</div>
      {{$t('others.user_amount_in_area')}}
    </div>
    <div id="map" class="spots-map" v-if="renderMap"></div>
    <div class="above-map search-location" @click="searchingPlace = true">
      <img src="svg/search-outline.svg" />
    </div>
    <LocalizeMe class="localize-me" :getLocationOnMounted="true" @location-found="locationFound" />
    <q-dialog v-model="progressBar">
      <AddPointsProgress :progress="progress" />
    </q-dialog>
    <q-dialog v-model="searchingPlace">
      <SearchPlace @place-clicked="placeClicked" />
    </q-dialog>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/leaflet.js'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster/dist/leaflet.markercluster.js'
import 'leaflet.tilelayer.pouchdbcached/L.TileLayer.PouchDBCached.js'
import { mapGetters } from 'vuex'
import { getFavoriteSports } from 'boot/helpers'
import LocalizeMe from 'components/map/LocalizeMe.vue'
import SearchPlace from 'components/map/SearchPlace'
import AddPointsProgress from 'components/map/AddPointsProgress'

export default defineComponent({
  name: 'Map',
  components: { LocalizeMe, SearchPlace, AddPointsProgress },
  data() {
    return {
      searchingPlace: false,
      renderMap: true,
      map: null,
      tiles: null,
      markerList: [],
      markers: null,
      selectedMarker: null,
      spots: [],
      amountPointsToAdd: 0,
      progress: 0,
      progressBar: false,
      // displayedSpots: [],
      pointsIndex: 0,
      userLocation: null,
      pinIcon: L.icon({
        iconUrl: 'svg/pinMap.svg',
        iconSize: [35, 35],
        iconAnchor: [17.5, 35],
      }),
      selectedSpotIcon: L.icon({
        iconUrl: 'svg/selectedSpot.svg',
        iconSize: [35, 35],
        iconAnchor: [17.5, 35],
      }),
      userLocationIcon: L.icon({
        iconUrl: 'svg/user-location.svg',
        iconSize: [35, 35],
        iconAnchor: [17.5, 17.5],
      }),
    }
  },
  props: {
    points: {},
    previouslySelectedMarker: {},
    addMarkersMethod: {},
    initialZoom: { default: 10 },
    userAmountInArea: { type: Number, default: 0 },
  },
  mounted() {
    this.$store.commit('setLoading', true)
    if (this.previouslySelectedMarker !== null) {
      this.selectMarker(
        this.previouslySelectedMarker.lat,
        this.previouslySelectedMarker.lon
      )
    }
  },
  computed: {
    ...mapGetters(['map/getBottomCardOpened']),
    viewBottomCardOpened() {
      return this['map/getBottomCardOpened']
    },
  },
  watch: {
    points(newValue) {
      this.addMarkers()
    },
    previouslySelectedMarker(newValue) {
      this.selectMarker(newValue.lat, newValue.lon)
    },
    viewBottomCardOpened: function (newValue) {
      if (newValue === false) {
        this.backToClassicIcon()
      }
    },
  },
  beforeRouteLeave() {
    this.renderMap = false
  },
  methods: {
    placeClicked(place) {
      console.log(place)
      this.searchingPlace = false
      if (place.boundingBox) {
        this.map.fitBounds(
          [
            [
              place.boundingBox.btmRightPoint.lat,
              place.boundingBox.btmRightPoint.lon,
            ],
            [
              place.boundingBox.topLeftPoint.lat,
              place.boundingBox.topLeftPoint.lon,
            ],
          ],
          this.map.getZoom(),
          {
            animated: true,
          }
        )
      } else {
        this.map.setView(
          [place.position.lat, place.position.lon],
          this.map.getZoom(),
          {
            animated: true,
          }
        )
      }
      this.$emit('place-clicked')
    },
    locationFound(location) {
      if (this.map === null) {
        if (location !== null) {
          this.initMap([location.coords.latitude, location.coords.longitude])
          this.addUserLocation(location)
        } else {
          this.initMap(null)
        }
      }
      if (location !== null) {
        this.addUserLocation(location)
      }
    },
    updateProgressBar(amount) {
      amount === this.amountPointsToAdd
        ? (this.progressBar = false)
        : (this.progress = amount / this.amountPointsToAdd)
    },
    initMap(mapCenter) {
      this.tiles = L.tileLayer(
        //"https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        //"http://{s}.tile.osm.org/{z}/{x}/{y}.png",
        //"https://tile.tracestrack.com/_/{z}/{x}/{y}.png?key=c0103ecabe0a5eef358ef11f361b3fab",
        'https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=e4yO0GWIpgrHOr8Xt6O9pQNig7CnC84m&tileSize=256',
        //"https://api.tomtom.com/map/1/tile/sat/main/{z}/{x}/{y}.jpg?key=e4yO0GWIpgrHOr8Xt6O9pQNig7CnC84m",
        {
          attribution:
            "<div class='custom-attribution'>" +
            this.$t('others.map_attribution') +
            '</div>',
        }
      )
      // this.map = null;
      this.map = L.map('map', {
        minZoom: 3,
        zoomControl: false,
        layers: this.tiles,
        center: mapCenter === null ? [48.85341, 2.3488] : mapCenter,
        zoom: this.initialZoom,
        useCache: true,
        cacheMaxAge: 31536000000, // 1 year
        crossOrigin: true,
      }).on('moveend', () => this.$emit('moveend', this.map.getBounds()))
      //sometimes an error is thrown "L.markerClusterGroup is not a function"
      try {
        this.markers = L.markerClusterGroup({
          chunkedLoading: true,
          chunkInterval: 200,
          chunkProgress: this.updateProgressBar,
        })
      } catch {
        //this.$router.go(0);
      }
      this.$emit('got-bounds', this.map.getBounds())
    },
    addMarkers() {
      this.progressBar = true
      this.markerList = []
      let pointsToAdd
      if (this.addMarkersMethod === 'add') {
        pointsToAdd = this.points.slice(this.pointsIndex)
      } else if (this.addMarkersMethod === 'replace') {
        this.markers.clearLayers()
        pointsToAdd = this.points
      }
      if (this.$route.query.sportId === 'favoriteSports') {
        let favoriteSports = getFavoriteSports()
        favoriteSports.forEach((sport) => {})
      }
      this.amountPointsToAdd = pointsToAdd.length
      if (
        ['favoriteSports', 'allSports'].indexOf(this.$route.query.sportId) >= 0
      ) {
        pointsToAdd.forEach((spot) => {
          let marker = L.marker(L.latLng(spot.lat, spot.lon), {
            icon: L.icon({
              iconUrl: 'svg/all-sports/' + spot.sport + '.svg',
              iconSize: [35, 35],
              iconAnchor: [17.5, 35],
            }),
          }).on('click', () => this.markerClicked(spot, marker))
          this.markerList.push(marker)
          this.spots.push(spot)
        })
      } else {
        pointsToAdd.forEach((spot) => {
          const marker = L.marker(L.latLng(spot.lat, spot.lon), {
            icon: this.pinIcon,
          }).on('click', () => this.markerClicked(spot, marker))
          this.markerList.push(marker)
          this.spots.push(spot)
        })
      }
      // this.pointsIndex = this.points.length
      this.markers.addLayers(this.markerList)
      this.map.addLayer(this.markers)
      this.pointsIndex = this.points.length
      this.$store.commit('setLoading', false)
    },
    markerClicked(spot, marker) {
      this.$emit('marker-clicked', spot)
      //this.backToClassicIcon();
      this.selectedMarker = marker
      //marker.setIcon(this.selectedSpotIcon);
      this.map.setView(
        [spot.lat, spot.lon],
        this.map.getZoom(), // < 10 ? 10 : this.map.getZoom(),
        {
          animated: true,
        }
      )
    },
    backToClassicIcon() {
      if (this.selectedMarker !== null) {
        this.selectedMarker.setIcon(this.pinIcon)
      }
    },
    addUserLocation(location) {
      if (this.userLocation === null) {
        this.userLocation = [
          location.coords.latitude,
          location.coords.longitude,
        ]
        L.marker(this.userLocation, {
          icon: this.userLocationIcon,
        }).addTo(this.map)
      }
      this.map.setView(
        this.userLocation,
        this.map.getZoom() !== this.initialZoom && this.map.getZoom() < 10
          ? this.initialZoom
          : this.map.getZoom()
      )
    },
    selectMarker(lat, lon) {
      this.$store.commit('setLoading', false)
      this.markerList.forEach((marker) => {
        var latlng = marker.getLatLng()
        if (latlng.lat.toString() === lat && latlng.lng.toString() === lon) {
          marker.fireEvent('click')
        }
      })
    },
  },
})
</script>
<style lang="scss" scoped>
@import '../../css/map.scss';

.map-wrapper {
  .user-amount {
    position: fixed;
  }
  #map {
    width: 100vw;
    height: var(--page-height);
    z-index: 0 !important;
    background-color: $light-grey;
  }
  .search-location {
    right: 2vw;
    top: 50px;
    margin-top: calc(20px + env(safe-area-inset-top));
    width: 40px;
    padding: 8px;
    padding-bottom: 4px;
    background-color: $primary;
    border-radius: 15px;
    img {
      filter: invert(100%);
    }
  }
  .localize-me {
    position: fixed;
    bottom: calc(#{$bottom-map-element} - 5px);
    right: 10px;
  }
}
</style>
