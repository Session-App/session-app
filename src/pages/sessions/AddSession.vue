<template>
  <div class="main-wrapper">
    <div class="page-title">{{ $t("sessions.set_a_session") }}</div>
    <div class="spot-name">{{ $route.query.spotName }}</div>
    <div class="form">
      <div id="map" v-if="renderMap"></div>

      <q-btn class="date-button" icon="event" no-caps :label="
          selectedDate === null ? $t('sessions.select_date') : selectedDate
        " color="primary">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="selectedDate" :options="dateOptions">
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn :label="$t('others.ok')" no-caps color="primary" flat v-close-popup />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-btn>
      <q-btn icon="access_time" color="primary" :label="
          selectedTime === null ? $t('sessions.select_time') : selectedTime
        " no-caps class="time-button">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-time format24h v-model="selectedTime">
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn :label="$t('others.ok')" color="primary" flat v-close-popup />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-btn>
      <div class="hint-wrapper">
        <div class="hint">{{ $t("sessions.hint_description") }}</div>
      </div>
      <Input class="description" :label="$t('spots.description')" v-model="form.description" type="textarea" autogrow />
      <div class="toggle">
        <div class="explanation">{{ $t("sessions.private_session") }}</div>
        <q-toggle v-model="privateSession" color="primary" />
      </div>
      <q-btn :label="selectedGroup.name ?? $t('sessions.private_select_group')" v-if="privateSession" no-caps color="primary" @click="selectGroup" />
      <div class="toggle">
        <div class="explanation">{{ $t("sessions.limited_user_amount") }}</div>
        <q-toggle v-model="maxParticipants" color="primary" />
      </div>
      <Input :label="$t('sessions.user_amount')" v-model="form.maxParticipants" type="number" v-if="maxParticipants" />
      <q-btn class="submit-button" label-color="black" standout="bg-blue-1" input-style="color:black" :label="$t('sessions.send_session')" no-caps color="primary" @click="submitSession" />
    </div>

    <q-dialog class="bottom-sheet" v-model="selectGroupPopup" position="bottom">
      <SetGroupPrivateSession @group-selected="groupSelected" />
    </q-dialog>
  </div>
</template>
<script>
import Input from 'components/form/Input'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/leaflet.js'
import SetGroupPrivateSession from 'components/sessions/SetGroupPrivateSession'
import { notify } from 'boot/helpers'

export default {
  components: { Input, SetGroupPrivateSession },
  data() {
    return {
      todayRef: null,
      todayFormatted: null,
      cloudFrontUrl:
        'https://d1tqac1zek46ma.cloudfront.net/spots_' +
        this.$route.query.sportId,
      form: {
        description: null,
        spot: {
          id: null,
        },
        date: null,
        private: null,
        maxParticipants: null,
      },
      selectedTime: null,
      selectedDate: null,
      map: null,
      userLocation: { long: null, lat: null },
      tileLayer: null,
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
      marker: null,
      selectedMarker: null,
      arePicturesLoading: false,
      isDataLoading: false,
      errors: [],
      renderMap: true,
      privateSession: false,
      selectGroupPopup: false,
      selectedGroup: {},
      maxParticipants: false,
    }
  },
  beforeRouteLeave() {
    this.renderMap = false
  },
  mounted() {
    this.$store.commit('setLoading', true)
    this.initMap()
    this.selectedMarker = L.marker(
      [
        this.$route.query.comingFromSpotLat,
        this.$route.query.comingFromSpotLon,
      ],
      {
        icon: this.selectedSpotIcon,
      }
    )
    this.form.spot.id = Number(this.$route.query.spotId)
    this.$store.commit('setLoading', false)
    this.map.setView(
      [
        this.$route.query.comingFromSpotLat,
        this.$route.query.comingFromSpotLon,
      ],
      18
    )
    this.selectedMarker.addTo(this.map)

    var today = new Date()
    var month
    var day
    this.todayFormatted = today.getFullYear() + '/'
    if ((today.getMonth() + 1).toString().length === 1) {
      month = '0' + (today.getMonth() + 1)
    } else {
      month = today.getMonth() + 1
    }
    if (today.getDate().toString().length === 1) {
      day = '0' + today.getDate()
    } else {
      day = today.getDate()
    }
    this.todayFormatted += month + '/' + day
  },
  methods: {
    groupSelected(group) {
      this.selectedGroup = group
      this.selectGroupPopup = false
    },
    selectGroup() {
      this.selectGroupPopup = true
    },
    initMap() {
      this.map = L.map(
        'map',

        { zoomControl: false }
      ).setView([45.63, 2], 6)

      this.tileLayer = L.tileLayer(
        //"https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        //"https://tile.tracestrack.com/_/{z}/{x}/{y}.png?key=c0103ecabe0a5eef358ef11f361b3fab",

        'https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=e4yO0GWIpgrHOr8Xt6O9pQNig7CnC84m&tileSize=256',
        {
          attribution: this.$t('others.map_attribution'),
        }
      )

      this.tileLayer.addTo(this.map)
    },
    dateOptions(date) {
      return date >= this.todayFormatted.toString()
    },
    submitSession() {
      this.$store.commit('setLoading', true)
      if (this.form.description === null) {
        this.errors.push('missing_description')
      }
      if (this.form.spot.id === null) {
        this.errors.push('missing_spot')
      }
      if (this.selectedDate === null) {
        this.errors.push('missing_date')
      }
      if (this.selectedTime === null) {
        this.errors.push('missing_time')
      }
      if (this.privateSession && this.selectedGroup.id === undefined) {
        this.errors.push('missing_conversation_private_session')
      }
      if (
        this.maxParticipants &&
        [null, '0', '', 0].indexOf(this.form.maxParticipants) >= 0
      ) {
        this.errors.push('invalid_participants_amount')
      }
      if (this.errors.length !== 0) {
        this.$store.commit('setLoading', false)
        notify(this.errors)
        this.errors = []
        return null
      }
      this.form.date =
        this.selectedDate.replace(/\//g, '-') + 'T' + this.selectedTime + ':00'
      if (this.selectedGroup.id !== undefined) {
        this.form.private = { id: this.selectedGroup.id }
      }
      if (!this.maxParticipants) {
        this.form.maxParticipants = null
      } else {
        this.form.maxParticipants = parseInt(this.form.maxParticipants)
      }
      this.$store
        .dispatch('sessions/sendSession', {
          form: this.form,
        })
        .then((response) => {
          this.$store.commit('setLoading', false)
          this.$router.push({
            name: 'thank-you',
            query: {
              reason: 'added_session',
              sessionId: response.id,
              sportId: this.$route.query.sportId,
            },
          })
        })
        .catch((error) => {})
    },
  },
  watch: {
    privateSession(newVal) {
      if (!newVal) this.selectedGroup = {}
    },
  },
}
</script>

<style lang="scss" scoped>
.main-wrapper {
  height: var(--page-height);
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.back {
  width: 97vw;
  text-align: left;
}
.spot-name {
  font-size: 1.5em;
  margin-top: 20px;
  margin-bottom: -10px;
  text-align: center;
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

.pictures-upload {
  margin: 20px;
}

#map {
  height: 400px;
  width: 90vw;
  border-radius: 15px;
}
.date-button {
  margin-top: 20px;
}
.time-button {
  margin: 10px;
}

.thanks {
  text-align: center;
  margin-top: 25vh;
  font-size: 1.3em;
}
.toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
.submit-button {
  margin: 20px;
}
</style>
