<template>
  <div class="main-wrapper" @click="clicked">
    <transition appear enter-active-class="animated fadeIn">
      <div :style="categoryBg" class="category-name">
        {{ categoryName }}
      </div>
    </transition>
    <div class="sports-wrapper" :style="clickedStyle">
      <div
        v-for="sport in sports"
        :key="sport"
        @click.stop="openSportPopup(sport.id)"
      >
        <SportCard :sportId="sport.id" />
      </div>
    </div>
    <q-dialog v-model="sportPopup"
      ><SportFeatures :sportId="selectedSport" class="popup"
    /></q-dialog>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import SportCard from "./SportCard";
import SportFeatures from "components/sports/SportFeatures";

export default defineComponent({
  name: "SportCategory",
  components: { SportCard, SportFeatures },
  data() {
    return {
      isClicked: false,
      clickedStyle: "max-height:0px;",
      sportPopup: false,
      selectedSport: null,
      user: {
        favoriteSports: [],
      },
    };
  },
  created() {
    this.favoriteSports = localStorage.getItem("favoriteSports").split(",");
  },
  props: {
    backgroundImage: {
      type: String,
    },
    categoryName: {
      type: String,
    },
    sports: {
      type: Object,
    },
  },

  methods: {
    openSportPopup(sport) {
      this.selectedSport = sport;
      this.sportPopup = true;
    },
    clicked() {
      this.isClicked = !this.isClicked;
      this.isClicked
        ? (this.clickedStyle =
            "max-height:2999px;transition:max-height ease-in 0.8s;")
        : (this.clickedStyle = "max-height:0px;");
    },
  },
  computed: {
    categoryBg() {
      return "background-image: url(" + this.backgroundImage + ");";
    },
  },
});
</script>

<style lang="scss" scoped>
.main-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 15px;
  margin-bottom:10px ;
  margin-right: 10px;
  margin-left:10px;
  font-size: 3.4em;
  color: white;
  text-shadow: black 2px 0 5px;
  min-height: 150px;
  background-color: $light-white;
}
.category-name {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25px;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 15px;
  width: 100%;
  height: 150px;
}
.sports-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  /*transition: max-height 0.2s ease-out;*/
  overflow: hidden;
  .star-wrapper {
    text-align: right;
    height: 0px;
    .star {
      width: 20px;
      margin-bottom: -7px;
      margin-right: -75px;
    }
  }
  .sport-card {
    font-size: 0.3em;
    margin: 3vw;
    margin-top: 10px;
  }
}
</style>
