<template>
  <div class="all-sports-wrapper">
    <SportCategory
      v-for="category in sportTypes"
      :key="category"
      :backgroundImage="category.image"
      :categoryName="category.name"
      :sports="category.sports"
      @click="maybeComingSoon(category)"
    ></SportCategory>
  </div>
</template> 

<script charset="utf-8">
import SportCategory from "components/sports/SportCategory";
export default {
  components: {
    SportCategory,
  },
  methods: {
    maybeComingSoon(category) {
      if (!category.sports[1]) {
        this.$q.notify({
          message: this.$t("others.coming_soon"),
          color: "green-3",
          timeout: 1500,
        });
      }
    },
  },
  data() {
    return {
      sportTypes: [
        {
          name: this.$t("sports.Water"),
          image: "images/water.jpg",
          sports: {
            5: { id: "1", name: this.$t("sports.1") },
            2: { id: "2", name: this.$t("sports.2") },
            3: { id: "7", name: this.$t("sports.7") },
            4: { id: "8", name: this.$t("sports.8") },
            1: { id: "72", name: this.$t("sports.72") },
            6: { id: "19", name: this.$t("sports.19") },

            7: { id: "16", name: this.$t("sports.16") },
            8: { id: "21", name: this.$t("sports.21") },

            9: { id: "10", name: this.$t("sports.10") },
            10: { id: "69", name: this.$t("sports.69") },
            11: { id: "13", name: this.$t("sports.13") },
            12: { id: "14", name: this.$t("sports.14") },
            //13: { id: "11", name: this.$t("sports.11") },
            //14: { id: "20", name: this.$t("sports.20") },

            //15: { id: "17", name: this.$t("sports.17") },
            //16: { id: "18", name: this.$t("sports.18") },
            //17: { id: "15", name: this.$t("sports.15") },
            //18: { id: "9", name: this.$t("sports.9") },
            //19: { id: "70", name: this.$t("sports.70") },
          },
        },

        {
          name: this.$t("sports.Air"),
          image: "images/air.jpg",
          sports: {
            1: { id: "25", name: this.$t("sports.25") },
            2: { id: "23", name: this.$t("sports.23") },
            //3: { id: "22", name: this.$t("sports.22") },
            //4: { id: "24", name: this.$t("sports.24") },
            //5: { id: "28", name: this.$t("sports.28") },
            //6: { id: "26", name: this.$t("sports.26") },
            //7: { id: "27", name: this.$t("sports.27") },
          },
        },
        {
          name: this.$t("sports.Land"),
          image: "images/land.jpg",
          sports: {
            1: { id: "6", name: this.$t("sports.6") },

            2: { id: "5", name: this.$t("sports.5") },
            3: { id: "3", name: this.$t("sports.3") },
            4: { id: "39", name: this.$t("sports.39") },

            5: { id: "40", name: this.$t("sports.40") },
            6: { id: "41", name: this.$t("sports.41") },
            7: { id: "4", name: this.$t("sports.4") },
            8: { id: "57", name: this.$t("sports.57") },
            9: { id: "47", name: this.$t("sports.47") },
            10: { id: "48", name: this.$t("sports.48") },
            11: { id: "42", name: this.$t("sports.42") },
            //12: { id: "43", name: this.$t("sports.43") },

            //13: { id: "46", name: this.$t("sports.46") },

            //14: { id: "49", name: this.$t("sports.49") },
            //15: { id: "67", name: this.$t("sports.67") },
            16: { id: "50", name: this.$t("sports.50") },
            //17: { id: "45", name: this.$t("sports.45") },

            //18: { id: "51", name: this.$t("sports.51") },
            //19: { id: "52", name: this.$t("sports.52") },
            //20: { id: "53", name: this.$t("sports.53") },
            //21: { id: "54", name: this.$t("sports.54") },
            //22: { id: "55", name: this.$t("sports.55") },
            23: { id: "56", name: this.$t("sports.56") },

            //24: { id: "59", name: this.$t("sports.59") },
            //25: { id: "60", name: this.$t("sports.60") },

            //26: { id: "35", name: this.$t("sports.35") },
            //27: { id: "71", name: this.$t("sports.71") },
            //28: { id: "58", name: this.$t("sports.58") },
            //29: { id: "44", name: this.$t("sports.44") },
          },
        },

        {
          name: this.$t("sports.Winter"),
          image: "images/winter.jpg",
          sports: {
            /*
            1: { id: "29", name: this.$t("sports.29") },
            2: { id: "30", name: this.$t("sports.30") },
            3: { id: "36", name: this.$t("sports.36") },
            4: { id: "31", name: this.$t("sports.31") },
            5: { id: "32", name: this.$t("sports.32") },
            6: { id: "35", name: this.$t("sports.35") },
            7: { id: "33", name: this.$t("sports.33") },
            8: { id: "34", name: this.$t("sports.34") },
            9: { id: "37", name: this.$t("sports.37") },
            10: { id: "38", name: this.$t("sports.38") },
						*/
          },
        },
        {
          name: this.$t("sports.Motor"),
          image: "images/motor.jpg",
          sports: {
            /*
            1: { id: "61", name: this.$t("sports.61") },
            2: { id: "62", name: this.$t("sports.62") },
            3: { id: "63", name: this.$t("sports.63") },
            4: { id: "64", name: this.$t("sports.64") },
            5: { id: "65", name: this.$t("sports.65") },
            6: { id: "66", name: this.$t("sports.66") },
						*/
          },
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.all-sports-wrapper {
  background: $background-gradient;
  height: var(--page-height);
  overflow-y: scroll;
}
</style>
