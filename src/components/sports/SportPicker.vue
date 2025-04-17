<template>
  <div class="picker-wrapper">
    <div class="sport-picker">
      <div v-for="sport in sports" :key="sport" :class="[
          'sport-badge',
          {
            selected: sport.isSelected,
            disabled: sport.isDisabled,
          },
        ]" @click="selectSport(sport)" :no-caps="true">
        <img :src="'svg/all-sports/' + sport.id + '.svg'" />
        {{ $t("sports.sports." + sport.id) }}
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SportPicker',
  props: ['sportIds', 'disabledSports', 'method'],
  data() {
    return {
      selectedSports: [],
      selectedSport: null,
      sports: [],
    }
  },
  created() {
    //adding attributes to the sportIds
    this.sportIds.forEach((sportId) => {
      this.sports.push({
        id: sportId,
        isSelected: false,
        isDisabled: false,
      })
    })
    //disabling disabled sports
    if (this.disabledSports !== undefined) {
      this.sports.forEach((sport) => {
        this.disabledSports.forEach((disabledSport) => {
          if (parseInt(sport.id) === disabledSport) {
            sport.isDisabled = true
          }
        })
      })
    }
  },
  methods: {
    selectSport(sport) {
      if (sport.isDisabled) {
        this.$emit('disabled-sport-clicked', sport.id)
        return
      }
      if (this.method === 'single') {
        this.sports.forEach((s) => {
          s.id !== sport.id ? (s.isSelected = false) : (s.isSelected = true)
        })
        this.$emit('sport-selected', sport.id)
      } else {
        sport.isSelected = !sport.isSelected
        //todo: retirer ou ajouter le sport à la liste selectedSports et faire un $emit avec la liste
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.picker-wrapper {
  text-align: right;
  .sport-picker {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .sport-badge {
      margin: 5px;
      background-color: $light-grey;
      display: flex;
      align-items: center;
      padding: 7px;
      border-radius: 7px;
      img {
        width: 30px;
        margin-right: 3px;
      }
      &.selected {
        background-color: $primary;
        color: white;
      }
    }
  }
}
</style>
