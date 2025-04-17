<template>
  <div>
    <q-btn
      class="localize-me"
      color="primary"
      round
      @click.prevent="localizeUser"
      :loading="retrievingLocation"
      v-if="renderButton"
    >
      <img src="svg/localize-me.svg" />
    </q-btn>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { Geolocation } from "@capacitor/geolocation";

export default defineComponent({
  name: "LocalizeMe",
  data() {
    return {
      retrievingLocation: false,
    };
  },
  props: {
    getLocationOnMounted: {},
    renderButton: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    if (this.getLocationOnMounted) {
      this.localizeUser();
    }
  },
  methods: {
    localizeUser() {
      this.retrievingLocation = true;
      this.checkLocationPermission().then((val) => {
        if (val.coarseLocation === "granted") {
          this.tryGetLocation();
        } else if (this.$q.platform.is.chrome) {
          this.tryGetLocation();
        } else {
          this.requestLocationPermission().then((val) => {
            this.tryGetLocation();
          });
        }
      });
    },
    getLocation: async (iOS) => {
      return Geolocation.getCurrentPosition({ enableHighAccuracy: !iOS });
    },
    checkLocationPermission: async () => {
      return Geolocation.checkPermissions();
    },
    requestLocationPermission: async () => {
      return Geolocation.requestPermissions(["location"]);
    },
    tryGetLocation() {
        this.getLocation(this.$q.platform.is.ios)
          .then((location) => {
            this.$emit("location-found", location);
            this.retrievingLocation = false;
            this.$store.commit("map/setUserLocation", location);
          })
          .catch((e) => {
            this.retrievingLocation = false;
            this.$emit("location-found", null);
          });
    },
  },
});
</script>
<style lang="scss" scoped>
.localize-me {
  img {
    width: 48px;
    padding: 8px;
  }
}
</style>
