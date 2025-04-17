<template>
  <div class="picker-wrapper popup">
    <div class="sports-wrapper">
      <div v-for="(sports, letter) in sortedSports" :key="letter" class="sport-letter">
        <div class="letter" v-if="sports.length !== 0">{{ letter }}</div>
        <div class="sport-badges">
          <div v-for="sport in sports" :key="sport" :class="[
              'sport-badge',
              {
                selected: sport.isSelected,
              },
            ]" @click="selectSport(sport)">
            <img :src="'svg/all-sports/' + sport.id + '.svg'" />
            {{ $t("sports.sports." + sport.id) }}
          </div>
        </div>
      </div>
    </div>
    <div class="button-wrapper">
      <q-btn class="ok" color="primary" :label="$t('others.ok')" @click="updateSports" :loading="updatingSports" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SportsPicker',
  props: {
    alreadySelected: { type: Array },
    updateFavorites: { type: Boolean, default: false },
    method: { type: String, default: 'multiple' },
  },
  data() {
    return {
      updatingSports: false,
      selectedSports: [...this.alreadySelected],
      sortedSports: {
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        F: [],
        G: [],
        H: [],
        I: [],
        J: [],
        K: [],
        L: [],
        M: [],
        N: [],
        O: [],
        P: [],
        Q: [],
        R: [],
        S: [],
        T: [],
        U: [],
        V: [],
        W: [],
        X: [],
        Y: [],
        Z: [],
      },
    }
  },
  created() {
    let lang = localStorage.getItem('lang')
    let sports = { ...this.$i18n.messages[lang].sports.sports }
    var sport
    Object.entries(sports).forEach(([id, name]) => {
      sport = {
        name: name,
        id: id,
      }
      this.alreadySelected.forEach((favSport) => {
        if (parseInt(id) === parseInt(favSport)) {
          sport.isSelected = true
        }
      })
      this.sortedSports[sport.name.charAt(0)].push(sport)
    })
  },
  methods: {
    updateSports() {
      if (this.updateFavorites) {
        this.updatingSports = true
        this.$store
          .dispatch('user/editUser', {
            favoriteSports: this.selectedSports,
            bio: null,
          })
          .then(() => {
            this.updatingSports = false
            this.$emit('sports-selected', this.selectedSports)
          })
      } else {
        this.$emit('sports-selected', this.selectedSports)
      }
    },
    selectSport(sport) {
      if (this.method === 'multiple') {
        if (!sport.isSelected) {
          this.selectedSports.push(sport.id)
        } else {
          this.selectedSports.splice(this.selectedSports.indexOf(sport.id), 1)
        }
        sport.isSelected = !sport.isSelected
      } else if (this.method === 'single') {
        Object.entries(this.sortedSports).forEach(([letter, sports]) => {
          sports.forEach((s) => {
            s.isSelected = false
          })
        })
        sport.isSelected = true
        this.selectedSports = [sport.id]
      }
    },
  },
})
</script>

<style lang="scss" scoped>
@use '../../css/mixins.scss';

.picker-wrapper {
  text-align: right;
  margin-bottom: 15px;
  overflow-y: hidden;
  .sports-wrapper {
    overflow-y: scroll;
    height: 80vh;
    .sport-letter {
      margin-top: 10px;
      width: 100%;
      .letter {
        text-align: left;
        margin-left: 5vw;
        font-size: 1.2em;
      }
      .sport-badges {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        .sport-badge {
          margin: 5px;
          @include mixins.elevated-box;
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
  }
  .button-wrapper {
    display: flex;
    justify-content: center;
    .ok {
      margin: 7px;
    }
  }
}
</style>
