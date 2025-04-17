<template>
  <div class="ad"></div>
</template>
<script>
import { defineComponent } from 'vue'
// import {
//   AdMob,
//   BannerAdOptions,
//   BannerAdSize,
//   BannerAdPosition,
//   BannerAdPluginEvents,
//   AdMobBannerSize,
// } from "@capacitor-community/admob";
export default defineComponent({
  name: 'Ad',
  data() {
    return {
      adId: '',
    }
  },
  props: {},
  created() {
    // AdMob.initialize({
    //   requestTrackingAuthorization: true,
    //   initializeForTesting: true,
    // });
    // AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size) => {
    //   this.$emit("ad-size", size);
    // });
    // if (this.$q.platform.is.ios) {
    //   this.adId = "ca-app-pub-9751935953292683/2151531091";
    // } else {
    //   this.adId = "ca-app-pub-9751935953292683/5263935708";
    // }
    // const options = {
    //   adId: this.adId,
    //   adSize: BannerAdSize.ADAPTIVE_BANNER,
    //   position: BannerAdPosition.BOTTOM_CENTER,
    //   margin: 0,
    //   // isTesting: true
    //   // npa: true
    // };
    // AdMob.showBanner(options);
  },
  beforeUnmount() {
    // AdMob.removeBanner();
  },
  methods: {},
})
</script>
<style lang="scss" scoped></style>
