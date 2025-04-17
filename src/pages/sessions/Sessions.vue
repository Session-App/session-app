<template>
  <div class="main-wrapper">
    <!--
    <div class="above-map top-card">
      <div class="switch-wrapper">
        <input
          id="toggle-on"
          class="toggle toggle-left"
          name="toggle"
          value="false"
          type="radio"
          checked
        />
        <label @click="switchMode('map')" for="toggle-on" class="switch">{{
          $t("spots.map")
        }}</label>
        <input
          id="toggle-off"
          class="toggle toggle-right"
          name="toggle"
          value="true"
          type="radio"
        />
        <label @click="switchMode('list')" for="toggle-off" class="switch">{{
          $t("spots.list")
        }}</label>
      </div>
      <q-btn
        class="period-button"
        icon="event"
        :no-caps="true"
        :label="prettySelectedPeriod"
        color="primary"
        @click="showPeriodPicker = true"
      />
      <q-dialog v-model="showPeriodPicker">
        <div class="period-picker">
          <div class="select-period-hint">
            {{ $t("sessions.select_period_hint") }}
          </div>
          <q-tabs
            v-model="datePickerTab"
            dense
            active-color="white"
            indicator-color="white"
            class="bg-primary text-white tabs"
            align="justify"
            narrow-indicator
          >
            <q-tab
              name="quickPicker"
              :label="$t('date.quick_picker')"
              :no-caps="true"
            />
            <q-tab
              name="calendar"
              :label="$t('date.calendar')"
              :no-caps="true"
              @click="selectedQuickDateOption = null"
            />
          </q-tabs>
          <div class="quick-picker" v-show="datePickerTab === 'quickPicker'">
            <div
              :class="
                option.name === selectedQuickDateOption
                  ? 'quick-date-option selected'
                  : 'quick-date-option'
              "
              v-for="option in quickDateOptions"
              :key="option"
              @click="selectQuickDate(option)"
            >
              {{ $t("date." + option.name) }}
            </div>
          </div>

          <q-date
            range
            v-model="selectedPeriod"
            v-show="datePickerTab === 'calendar'"
          >
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn
                :label="$t('others.ok')"
                :no-caps="true"
                color="primary"
                flat
                v-close-popup
                @click="getSessions()"
              />
            </div>
          </q-date>
        </div>
      </q-dialog>
    </div>
    -->

    <Map @got-bounds="maybeLoadMoreSessions" @marker-clicked="displayDates" :points="displayedSpots" :userAmountInArea="userAmountInArea" :previouslySelectedMarker="previouslySelectedMarker" :initialZoom="8" addMarkersMethod="replace" v-show="!list"></Map>
    <q-dialog class="bottom-sheet" v-model="sessionDatesDialog" position="bottom">
      <SessionDates :spot="displayedSpot" :sessions="displayedDates" />
    </q-dialog>
  </div>
</template>
<script>
import DateTimes from 'components/sessions/DateTimes'
import Map from 'components/map/Map'
import SessionDates from 'components/sessions/SessionDates'
import { removeIsoTimeZone } from 'src/boot/helpers'
import {
  nextSunday,
  isSunday,
  endOfTomorrow,
  isSaturday,
  nextSaturday,
  nextMonday,
} from 'date-fns'

// var displayedSpots;
// var selectedPeriod;
// var selectedQuickDateOption;

export default {
  components: { DateTimes, Map, SessionDates },
  data() {
    return {
      list: false,
      showPeriodPicker: false,
      datePickerTab: 'quickPicker',
      displayedSpots: [],
      userAmountInArea: 0,
      displayedSpot: {},
      selectedPeriod: { from: null, to: null },
      areDatesLoading: false,
      displayedDates: [],
      quickDateOptions: {
        all: { name: 'all', period: { from: '' } },
        today: { name: 'today', period: { from: '', to: '' } },
        tomorrow: { name: 'tomorrow', period: { from: '', to: '' } },
        this_weekend: { name: 'this_weekend', period: { from: '', to: '' } },
        this_week: { name: 'this_week', period: { from: '', to: '' } },
        next_week: { name: 'next_week', period: { from: '', to: '' } },
      },
      selectedQuickDateOption: 'all',
      previouslySelectedMarker: null,
      sessionDatesDialog: false,
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   next((vm) => {
  //     vm.prevRoute = from;
  //   });
  // },
  mounted() {
    this.initPeriods()
  },
  computed: {
    prettySelectedPeriod() {
      if (this.selectedQuickDateOption !== null) {
        return this.$t('date.' + this.selectedQuickDateOption)
      } else {
        let result = this.selectedPeriod.from.substring(0, 10) + ' - '
        result +=
          this.selectedPeriod.to === null
            ? ''
            : this.selectedPeriod.to.substring(0, 10)
        return result
      }
    },
  },
  watch: {
    sessionDatesDialog(newVal) {
      if (!newVal) {
        //this.$store.commit("map/setBottomCardOpened", false);
        this.displayedSpot = {}
        this.displayedDates = []
      }
    },
    '$route.query.sportId'(newVal) {
      if (newVal) {
        this.getSessions()
      }
    },
  },
  methods: {
    initPeriods() {
      var today = new Date()
      var todayISO = removeIsoTimeZone(today.toISOString())

      // all time
      this.quickDateOptions.all.period.from = todayISO

      // tomorrow
      var tomorrow = removeIsoTimeZone(endOfTomorrow().toISOString())
      this.quickDateOptions.tomorrow.period.from = tomorrow
      this.quickDateOptions.tomorrow.period.to = tomorrow

      // today
      this.quickDateOptions.today.period.from = todayISO
      this.quickDateOptions.today.period.to = todayISO

      // this week
      this.quickDateOptions.this_week.period.from = todayISO
      isSunday(today)
        ? (this.quickDateOptions.this_week.period.to = todayISO)
        : (this.quickDateOptions.this_week.period.to = removeIsoTimeZone(
            nextSunday(today).toISOString()
          ))

      // this weekend
      if (isSunday(today)) {
        this.quickDateOptions.this_weekend.period.from = todayISO
        this.quickDateOptions.this_weekend.period.to = todayISO
      } else if (isSaturday(today)) {
        this.quickDateOptions.this_weekend.period.from = todayISO
        this.quickDateOptions.this_weekend.period.to = removeIsoTimeZone(
          nextSunday(today).toISOString()
        )
      } else {
        this.quickDateOptions.this_weekend.period.from = removeIsoTimeZone(
          nextSaturday(today).toISOString()
        )
        this.quickDateOptions.this_weekend.period.to = removeIsoTimeZone(
          nextSunday(today).toISOString()
        )
      }

      // next week
      this.quickDateOptions.next_week.period.from = removeIsoTimeZone(
        nextMonday(today).toISOString()
      )
      isSunday(today)
        ? (this.quickDateOptions.next_week.period.to = removeIsoTimeZone(
            nextSunday(today).toISOString()
          ))
        : (this.quickDateOptions.next_week.period.to = removeIsoTimeZone(
            nextSunday(nextSunday(today)).toISOString()
          ))
    },
    maybeLoadMoreSessions(mapBounds) {
      // if (this.prevRoute.query.comingFromSpotLat !== undefined) {
      //   this.displayedSpots = displayedSpots;
      //   this.selectedPeriod = selectedPeriod;
      //   this.selectedQuickDateOption = selectedQuickDateOption;
      //   this.previouslySelectedMarker = {
      //     lat: this.prevRoute.query.comingFromSpotLat,
      //     lon: this.prevRoute.query.comingFromSpotLon,
      //   };
      // } else {
      // all time when landing on page
      var today = new Date()
      var todayISO = removeIsoTimeZone(today.toISOString())
      this.selectedPeriod.from = todayISO
      this.getSessions()
      // selectedQuickDateOption = this.selectedQuickDateOption;
      // selectedPeriod = this.selectedPeriod;
      // }
    },
    selectQuickDate(option) {
      this.selectedQuickDateOption = option.name
      this.selectedPeriod = { ...option.period }
      this.getSessions()
      this.showPeriodPicker = false
      // selectedQuickDateOption = this.selectedQuickDateOption;
      // selectedPeriod = this.selectedPeriod;
    },
    // formatSelectedPeriod(period) {
    //   period.from += " 00:00";
    //   if (period.to !== null) {
    //     period.to += " 23:59";
    //   }
    //   return period;
    // },
    getSessions() {
      this.$store.commit('setLoading', true)
      this.$store
        .dispatch('sessions/getSessions', {
          sportId: this.$route.query.sportId,
          period: this.selectedPeriod,
        })
        .then((data) => {
          this.displayedSpots = data.spots
          this.$store.commit('setLoading', false)
          // displayedSpots = this.displayedSpots;
        })
        .catch((e) => {
          this.$q.notify(this.$t('account.error_happened'))
          this.$store.commit('setLoading', false)
        })
    },
    switchMode(mode) {
      if (mode === 'map') {
        this.list = false
      } else {
        this.list = true
      }
    },
    displayDates(spot) {
      this.sessionDatesDialog = true
      if (this.displayedSpot.id !== spot.id) {
        this.isExtraInfoLoading = true
        this.displayedSpot = spot
        this.$store
          .dispatch('spots/getSpotSessions', {
            spotId: spot.id,
            period: this.selectedPeriod,
          })
          .then((response) => {
            this.displayedDates = response
            this.areDatesLoading = false
          })
          .catch((error) => {
            this.$q.notify(this.$t('notification.error_happened'))
          })
        this.areDatesLoading = true
        this.displayedSpot = spot
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../css/map.scss';
.switch-wrapper {
  display: flex;
  justify-content: center;
  margin: 5px;
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
      border-radius: 10px;
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
.period-button {
  margin-bottom: 5px;
}

.period-picker {
  display: flex;
  align-items: center;
  flex-direction: column;
  box-shadow: none;
  .select-period-hint {
    background-color: white;
    width: 70vw;
    padding: 7px;
    text-align: center;
    margin-bottom: 10px;
    border-radius: $button-border-radius;
  }
  .tabs {
    width: 100%;
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
  }
  .quick-picker {
    background-color: white;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 10px 0px;
    .quick-date-option {
      background-color: $light-grey;
      padding: 7px;
      border-radius: 7px;
      margin: 4px;
      &.selected {
        background-color: $primary;
        color: white;
      }
    }
  }
}

.list {
  display: flex;
  flex-direction: column;
  align-items: center;
  .list-item {
    background-color: #76a0bb;
    padding: 10px;
    border-radius: 12px;
    width: 90vw;
    margin: 5px;
  }
}
</style>
