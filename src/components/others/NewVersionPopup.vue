<template>
  <div class="new-version popup">
    <div class="explanation">{{ $t("others.new_version") }}</div>
    <a :href="storeLink" target="_blank" class="store-link">
      <q-btn :no-caps="true" :label="$t('others.update')" color="primary" />
    </a>
  </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "NewVersionPopup",
  data() {
    return {};
  },
  computed: {
    storeLink() {
      return this.$q.platform.is.ios
        ? "https://apps.apple.com/fr/app/session/id1636197557"
        : "https://play.google.com/store/apps/details?id=app.sports.session";
    },
  },
  methods: {},
});
</script>
<style lang="scss" scoped>
.new-version {
  padding: 15px;
  text-align: center;
  .explanation {
    margin-bottom: 15px;
  }
  .store-link {
    text-decoration: none;
  }
}
</style>
