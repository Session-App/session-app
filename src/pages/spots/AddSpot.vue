<template>
  <div class="main-wrapper">
    <div class="page-title">{{ $t("form.add_spot") }}</div>
    <SportCard :sportId="$route.query.sportId" />
    <div class="form">
      <Input :label="$t('form.spot_name')" v-model="form.name" />
      <div class="map-wrapper">
        <div class="search-location" @click="locationPickerPopup = true">
          <img src="svg/search-outline.svg" />
        </div>
        <div id="map" v-if="renderMap"></div>
        <LocalizeMe class="localize-me" @location-found="addUserLocation" />
      </div>
      <div class="spot-coordinates" v-if="form.lat !== null">
        <div class="coordinates-title">{{ $t("spots.spot_coordinates") }} :</div>
        <div class="coordinates">({{ form.lat.toFixed(5) }}, {{ form.lon.toFixed(5) }})</div>
      </div>
      <q-dialog class="tag-picker" v-model="tagPicker">
        <TagPicker :tags="$i18n.messages[lang].filters[$route.query.sportId]" :selectedTags="form.tags" @cancel-clicked="tagPicker = false" @validate-clicked="addTags" />
      </q-dialog>
      <div class="tags">
        <TagBadge v-for="tag in form.tags" :key="tag" :tagId="tag" :sportId="$route.query.sportId" />
      </div>
      <q-btn color="primary" :no-caps="true" class="add-tags-button" @click="tagPicker = true">{{ $t("spots.add_tags") }}</q-btn>
      <div class="hint-wrapper">
        <div class="hint">{{ $t("form.hint_description") }}</div>
      </div>
      <Input class="description" :label="$t('spots.description')" v-model="form.description" type="textarea" />
      <input id="pictures-upload" type="file" accept="image/*" name="pictures" @change="addPictures" multiple hidden />
      <div class="hint-wrapper">
        <div class="hint">{{ $t("form.hint_pictures") }}</div>
      </div>
      <div v-if="picsPreview[0] !== undefined" class="added-pics">
        <img v-for="picture in picsPreview" :key="picture" :src="picture" />
      </div>
      <q-btn class="pictures-upload" label-color="black" standout="bg-blue-1" input-style="color:black" :label="$t('form.add_pictures', [10])" color="primary" @click="pictureUpload" icon="img:svg/pictures.svg" no-caps />
      <q-btn class="submit-button" label-color="black" standout="bg-blue-1" input-style="color:black" :label="$t('form.add_my_spot')" color="primary" @click="submitSpot(false)" no-caps />
    </div>
    <q-dialog v-model="duplicateSpotPopup">
      <DuplicateSpotPopup :spot="possibleDuplicate" @resubmit-spot="
          duplicateSpotPopup = false;
          submitSpot(true);
        " />
    </q-dialog>
    <q-dialog v-model="locationPickerPopup" class="above-all">
      <SearchPlace @place-clicked="placeClicked" />
    </q-dialog>
  </div>
</template>
<script>
import Input from 'components/form/Input'
import SportCard from 'components/sports/SportCard'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/leaflet.js'
import LocalizeMe from 'components/map/LocalizeMe.vue'
import TagPicker from 'components/spots/TagPicker'
import TagBadge from 'components/spots/TagBadge'
import DuplicateSpotPopup from 'components/spots/DuplicateSpotPopup'
import SearchPlace from 'components/map/SearchPlace'
import { notify } from 'src/boot/helpers'

export default {
  components: {
    Input,
    SportCard,
    LocalizeMe,
    TagPicker,
    TagBadge,
    DuplicateSpotPopup,
    SearchPlace,
  },
  data() {
    return {
      form: {
        name: null,
        lon: null,
        lat: null,
        tags: [],
        description: null,
      },
      pictures: [],
      picsPreview: [],
      map: null,
      userLocation: { long: null, lat: null },
      tileLayer: null,
      pinIcon: L.icon({
        iconUrl: 'svg/pinMap.svg',
        iconSize: [35, 35],
        iconAnchor: [17.5, 35],
      }),
      userLocationIcon: L.icon({
        iconUrl: 'svg/user-location.svg',
        iconSize: [35, 35],
        iconAnchor: [17.5, 17.5],
      }),
      userLocation: null,
      marker: null,
      tagPicker: false,
      picturesSent: 0,
      errors: 0,
      lang: '',
      renderMap: true,
      duplicateSpotPopup: false,
      possibleDuplicate: null,
      locationPickerPopup: false,
    }
  },
  mounted() {
    this.initMap()
  },
  beforeRouteLeave() {
    this.renderMap = false
  },
  created() {
    this.lang = localStorage.getItem('lang')
  },
  methods: {
    placeClicked(place) {
      this.locationPickerPopup = false
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
    addTags(tags) {
      this.form.tags = tags
      this.tagPicker = false
    },
    initMap() {
      this.map = L.map('map', { minZoom: 3, zoomControl: false }).setView(
        [45.63, 2],
        6
      )

      this.tileLayer = L.tileLayer(
        //"https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        // "http://mt0.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}",
        //"https://tile.tracestrack.com/_/{z}/{x}/{y}.png?key=c0103ecabe0a5eef358ef11f361b3fab",
        'https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=e4yO0GWIpgrHOr8Xt6O9pQNig7CnC84m&tileSize=256',
        {
          attribution: this.$t('others.map_attribution'),
        }
      )

      this.tileLayer.addTo(this.map)

      this.map.on('click', (e) => {
        this.addMarker(e)
      })
    },
    addMarker(e) {
      if (this.marker !== null) {
        this.map.removeLayer(this.marker)
      }
      this.marker = L.marker([e.latlng.lat, e.latlng.lng], {
        icon: this.pinIcon,
      }).addTo(this.map)
      this.form.lat = e.latlng.lat
      this.form.lon = e.latlng.lng
    },
    pictureUpload() {
      document.getElementById('pictures-upload').click()
    },
    addPictures(event) {
      if (event.target.files.length > 10) {
        this.$q.notify(this.$t('notification.dont_choose_more_x_pics', [10]))
        return
      }
      this.pictures = event.target.files
      this.picsPreview = []
      for (let i = 0; i < this.pictures.length; i++) {
        this.picsPreview.push(URL.createObjectURL(event.target.files[i]))
      }
    },

    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showLocation)
      } else {
        this.error = 'Geolocation is not supported.'
      }
    },
    addLocationIcon(lat, lng) {
      if (this.marker !== null) {
        this.map.removeLayer(this.marker)
      }
      this.marker = L.marker([lat, lng], {
        icon: this.locationIcon,
      }).addTo(this.map)
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
      this.map.setView(this.userLocation, 10)
    },
    showLocation(position) {
      this.userLocation.lat = position.coords.latitude
      this.userLocation.long = position.coords.longitude
      this.addLocationIcon(position.coords.latitude, position.coords.longitude)
    },

    submitSpot(duplicateChecked) {
      this.$store.commit('setLoading', true)
      if (this.form.name === null) {
        this.$q.notify(this.$t('notification.missing_spot_name'))
        this.errors++
      }
      if (this.form.lon === null || this.form.lon === null) {
        this.$q.notify(this.$t('notification.missing_spot_coordinates'))
        this.errors++
      }
      if (this.form.description === null) {
        this.$q.notify(this.$t('notification.missing_description'))
        this.errors++
      }
      if (this.errors !== 0) {
        this.$store.commit('setLoading', false)
        this.errors = 0
        return null
      }

      this.$store
        .dispatch('spots/sendSpot', {
          sportId: this.$route.query.sportId,
          form: this.form,
          duplicateChecked: duplicateChecked,
        })
        .then((response) => {
          // c'est dégeu mais ça marche, merci
          if (this.pictures.length !== 0) {
            this.submitPictures(response).then(() => {})
          } else {
            this.$store.commit('setLoading', false)
            this.$router.push({
              name: 'thank-you',
              query: {
                reason: 'added_spot',
                spotId: response.id,
                sportId: this.$route.query.sportId,
              },
            })
          }
        })
        .catch((error) => {
          this.$store.commit('setLoading', false)
          if (error.errors.possibleDuplicate) {
            this.possibleDuplicate = error.errors.possibleDuplicate
            this.duplicateSpotPopup = true
          }
        })
    },
    submitPictures(spot) {
      if (this.pictures !== null) {
        this.$store.commit('setLoading', true)
        return new Promise((resolve) => {
          for (let i = 0; i < this.pictures.length; i++) {
            let pictureExtension = this.pictures[i].name.split('.').pop()
            let pictureName =
              ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
                (
                  c ^
                  (crypto.getRandomValues(new Uint8Array(1))[0] &
                    (15 >> (c / 4)))
                ).toString(16)
              ) +
              new Date()
                .toISOString()
                .slice(0, 19)
                .replace(/:/g, '-')
                .replace(/\s+/g, '') +
              '.' +
              pictureExtension
            this.$store
              .dispatch('spots/requestLink', {
                sportId: this.$route.query.sportId,
                pictureName: pictureName,
              })
              .then((response) => {
                var renamedPicture = new File([this.pictures[i]], pictureName, {
                  type: this.pictures[i].type,
                })
                this.$store
                  .dispatch('spots/sendPicture', {
                    renamedPicture: renamedPicture,
                    url: response.url,
                  })
                  .then((response) => {
                    this.$store.dispatch('spots/savePicture', {
                      spotId: spot.id,
                      pictureName: pictureName,
                    })
                  })
                  .then(() => {
                    this.picturesSent++
                    if (this.picturesSent === this.pictures.length) {
                      this.$store.commit('setLoading', false)
                      this.$router.push({
                        name: 'thank-you',
                        query: {
                          reason: 'added_spot',
                          spotId: spot.id,
                          sportId: this.$route.query.sportId,
                        },
                      })
                    }
                  })
              })
          }
        }).catch((error) => {})
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.main-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: var(--page-height);
  overflow-y: scroll;
  .sport-card {
    margin-top: 25px;
  }
}
.form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .input {
    margin-bottom: 20px;
  }
  .description {
    width: 80vw;
  }
}
.map-wrapper {
  text-align: right;
  margin-bottom: -15px;
  margin-top: 10px;
  .search-location {
    margin-bottom: -50px;
    margin-right: 10px;
    z-index: 500;
    position: relative;
    img {
      width: 40px;
      padding: 8px;
      border-radius: 15px;
      background-color: invert($primary);
      filter: invert(100%);
    }
  }
  #map {
    height: 400px;
    width: 90vw;
    border-radius: 15px;
    margin-bottom: -40px;
  }
  .localize-me {
    position: relative;
    z-index: 400;
    bottom: 35px;
    right: 10px;
  }
}
.spot-coordinates {
  padding: 12px;
  border-radius: 15px;
  text-align: center;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 10px 0px;
}

.pictures-upload {
  margin-bottom: 20px;
  margin-top: 10px;
}
.added-pics {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 14px;
  padding: 7px;
  width: 95vw;
  img {
    width: 41vw;
    height: auto;
    margin: 5px;
    border-radius: 14px;
  }
}

.thanks {
  text-align: center;
  margin-top: 25vh;
  font-size: 1.3em;
}
.submit-button {
  margin-bottom: 20px;
}
</style>
