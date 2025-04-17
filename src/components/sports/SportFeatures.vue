<template>
  <div class="sport-features">
    <SportCard class="sport-card" :sportId="sportId" />
    <div class="features">
      <div
        class="feature"
        v-for="feature in features"
        :key="feature"
        @click="goTo(feature.link)"
      >
        <img :src="feature.icon" class="icon" />
        <div class="name">{{ $t('features.' + feature.name) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import SportCard from 'components/sports/SportCard'

export default defineComponent({
  name: 'SportFeatures',
  components: { SportCard },
  props: ['sportId'],
  data() {
    return {
      features: [
        {
          name: 'spots_map',
          link: 'spots-map',
          icon: 'svg/pin.svg',
        },
        //{
        //  name: 'sessions',
        //  link: 'sessions-map',
        //  icon: 'svg/sessions-calendar.svg',
        //},
      ],
    }
  },
  created() {
    if (['1','2','5','6','7','30','73'].indexOf(this.sportId) >= 0) {
      this.features.push({
        name: 'tricks',
        link: 'tricks',
        icon: 'svg/tricks.svg',
      })
    }
  },
  methods: {
    goTo(link) {
      let query = { sportId: this.sportId }
      this.$router.push({
        name: link,
        query: query,
      })
    },
  },
})
</script>

<style lang="scss" scoped>
.sport-features {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  .sport-card {
    margin-bottom: 20px;
    margin-top: 7px;
  }
  .features {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .feature {
      display: flex;
      align-items: center;
      color: black;
      box-shadow: 0 0px 5px #080808;
      padding: 5px;
      border-radius: 7px;
      margin: 5px;
      .icon {
        width: 40px;
        margin-right: 5px;
      }
    }
  }
}
</style>
