<template>
  <div class="sport-spots-list">
    <div class="close-spots" v-if="spots.length !== 0"></div>
    <div class="close-spot" v-else>
      {{ $t("spots.enable_location_for_list") }}
      <div>
        <LocalizeMe
          @location-found="locationFound"
          class="localize-me"
          v-if="spots.length === 0"
          :getLocationOnMounted="true"
        />
      </div>
    </div>
    <SpotsList
      :spots="spots"
      :loadingMore="loadingMore"
      :loadMore="true"
      :sportBadge="$route.query.sportId === 'favoriteSports'"
      :tagBadges="true"
      @load-more="getClosestSpots"
      class="spots-list"
      @spot-clicked="spotClicked"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import SpotsList from "components/others/SpotsList";
import LocalizeMe from "components/map/LocalizeMe.vue";
import { addDistanceToSpots } from "src/boot/helpers";

export default defineComponent({
  name: "SportSpotsList",
  components: { LocalizeMe, SpotsList },
  data() {
    return {
      page: 1,
      loadingMore: false,
      userLocation: null,
      listMarginTop: "75px",
      spots: [],
    };
  },
  created() {
    if (this.$route.query.action === "new-session") {
      this.listMarginTop = "120px";
    }
  },
  methods: {
    locationFound(location) {
      this.userLocation = location;
      this.getClosestSpots();
    },
    getClosestSpots() {
      if (!this.userLocation) {
        return;
      }
      if (this.spots.length === 0) {
        this.$store.commit("setLoading", true);
      }
      this.loadingMore = true;
      this.$store
        .dispatch("spots/getClosestSpots", {
          sportId: this.$route.query.sportId,
          page: this.page,
          userLocation: {
            lat: this.userLocation.coords.latitude,
            lon: this.userLocation.coords.longitude,
          },
        })
        .then((data) => {
          this.spots = this.spots.concat(
            addDistanceToSpots(data, this.userLocation)
          );
          this.$store.commit("setLoading", false);
          this.loadingMore = false;
          this.page += 1;
        });
    },
    spotClicked(spot) {
      this.$emit("spot-clicked", spot);
    },
  },
});
</script>

<style lang="scss" scoped>
.sport-spots-list {
  margin-top: v-bind("listMarginTop");
  height: var(--page-height);
  .localize-me {
    margin-top: 10vh;
    margin-bottom: 5px;
  }
  .spots-list {
    height: calc(var(--page-height) - v-bind("listMarginTop"));
  }
}
</style>
