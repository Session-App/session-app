<template>
  <div class="duplicate-spot-popup popup">
    <div class="explanation">
      {{ $t("spots.possible_duplicate_explanation", ["300m"]) }}
    </div>
    <div class="spot-detail">
      <div class="name">
        {{ spot.name }}
      </div>
      <div class="pictures">
        <img
          v-for="picture in spot.pictures"
          :key="picture.name"
          :src="cloudfrontUrl + picture.name"
        />
      </div>
    </div>
    <div class="options">
      <q-btn
        color="primary"
        :label="$t('spots.see_spot_detail')"
        :no-caps="true"
        class="button"
        @click="spotDetailDialog = true"
      />
      <q-btn
        color="primary"
        :label="$t('spots.my_spot_is_different')"
        :no-caps="true"
        class="button"
        @click="$emit('resubmit-spot')"
      />
    </div>
    <q-dialog
      class="bottom-sheet big"
      v-model="spotDetailDialog"
      position="bottom"
    >
      <SpotDetail :spotId="spot.id" @close-clicked="spotDetailDialog = false" />
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import SpotDetail from "components/spots/SpotDetail";

export default defineComponent({
  name: "DuplicateSpotPopup",
  components: { SpotDetail },
  props: {
    spot: {},
  },
  data() {
    return {
      spotDetailDialog: false,
    };
  },
  created() {},
  computed: {
    cloudfrontUrl() {
      return (
        "https://d1tqac1zek46ma.cloudfront.net/spots_" +
        this.$route.query.sportId +
        "/"
      );
    },
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
.duplicate-spot-popup {
  padding: 10px;
  .explanation {
    text-align: justify;
  }
  .spot-detail {
    background-color: $light-grey;
    border-radius: 15px;
    padding: 7px;
    margin-top: 10px;
    .name {
      text-align: center;
      font-size: 1.5em;
      margin-bottom: 10px;
    }
    .pictures {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      img {
        max-width: 130px;
        max-height: 130px;
        border-radius: 10px;
        margin: 5px;
      }
    }
    .description {
      margin-top: 10px;
    }
  }
  .options {
    display: flex;
    flex-direction: column;
    align-items: center;
    .button {
      margin-top: 15px;
    }
  }
}
</style>
