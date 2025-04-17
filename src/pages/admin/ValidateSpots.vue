<template>
  <div class="main-wrapper">
    <q-dialog v-model="explanationPopup">
      <div class="explanation-popup">
        <div class="explanation">
          {{ $t("verification.explanation_spots") }}
        </div>
        <div class="ok">
          <q-btn
            :label="$t('others.ok')"
            color="primary"
            @click="explanationPopup = false"
          />
        </div>
      </div>
    </q-dialog>
    <q-dialog v-model="noPicture">
      <div class="explanation-popup">
        <div class="explanation">
          {{ $t("verification.explanation_no_spot") }}
        </div>
        <div class="ok">
          <q-btn
            :label="$t('others.ok')"
            color="primary"
            @click="$router.go(-1)"
          />
        </div>
      </div>
    </q-dialog>

    <div id="map" v-if="!noPicture"></div>
    <div
      class="spot-info"
      v-if="unvalidatedSpots.length !== 0 && !explanationPopup"
    >
      <SportCard :sportId="currentlyValidatedSpot.sport" />
      <Input
        class="spot-name"
        v-model="currentlyValidatedSpot.name"
        :label="$t('form.spot_name')"
      />
      <div class="new-pics" v-if="noSpot">
        {{ $t("verification.new_pics") }}
      </div>
      <div class="added-by">
        <div class="small-title">{{ $t("spots.added_by") }} :</div>
        <div
          class="user-info"
          @click="goToUser(currentlyValidatedSpot.addedBy.id)"
        >
          <img
            class="pp-small"
            :src="
              cloudfrontUrlPP + currentlyValidatedSpot.addedBy.profilePicture
            "
          />
          <span>{{ currentlyValidatedSpot.addedBy.username }}</span>
        </div>
      </div>
      <div class="spot-pictures">
        <img
          v-for="picture in currentlyValidatedSpot.pictures"
          :key="picture"
          :src="`${cloudFrontUrl}/${picture.name}`"
          :class="[
            'spot-picture',
            {
              valid: picture.valid,
              invalid: !picture.valid,
            },
          ]"
          @click="changePictureValidation(picture)"
        />
      </div>
      <q-dialog class="tag-picker" v-model="tagPicker">
        <TagPicker
          :tags="$i18n.messages[lang].filters[currentlyValidatedSpot.sport]"
          :selectedTags="currentlyValidatedSpot.tags"
          @cancel-clicked="tagPicker = false"
          @validate-clicked="editTags"
        />
      </q-dialog>
      <div class="tags">
        <TagBadge
          v-for="tag in currentlyValidatedSpot.tags"
          :key="tag"
          :tagId="tag"
          :sportId="currentlyValidatedSpot.sport"
        />
      </div>
      <q-btn
        color="primary"
        :no-caps="true"
        class="add-tags-button"
        @click="tagPicker = true"
        >{{ $t("spots.edit_tags") }}</q-btn
      >
      <Input
        class="spot-description"
        v-model="currentlyValidatedSpot.description"
        :label="$t('spots.description')"
        type="textarea"
        autogrow
      />

      <div class="validate-buttons" v-if="!noSpot">
        <q-btn
          class="button"
          :label="$t('verification.reject')"
          :no-caps="true"
          color="negative"
          @click="validateSpot(false, null)"
        />
        <q-btn
          class="button"
          :label="$t('verification.validate')"
          :no-caps="true"
          color="positive"
          @click="validateSpot(false, true)"
        />
        <q-btn
          class="button"
          :label="$t('verification.validate_as_secret')"
          :no-caps="true"
          color="primary"
          @click="validateSpot(true, true)"
        />
      </div>
      <div class="validate-buttons" v-else>
        <q-btn
          class="button"
          :label="$t('verification.validate_modifications')"
          :no-caps="true"
          color="positive"
          @click="validateSpot(null, true)"
        />
      </div>
    </div>
  </div>
</template>
<script charset="utf-8">
import Input from "components/form/Input";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import TagBadge from "components/spots/TagBadge";
import TagPicker from "components/spots/TagPicker";
import SportCard from "components/sports/SportCard";

export default {
  components: {
    Input,
    TagBadge,
    TagPicker,
    SportCard,
  },
  data() {
    return {
      currentlyValidatedSpot: null,
      unvalidatedSpots: [],
      cloudfrontUrlPP:
        "https://d1tqac1zek46ma.cloudfront.net/profile_pictures/",
      map: null,
      tileLayer: null,
      marker: null,
      spotIcon: L.icon({
        iconUrl: "svg/selectedSpot.svg",
        iconSize: [35, 35],
        iconAnchor: [17.5, 35],
      }),
      explanationPopup: true,
      tagPicker: false,
      noSpot: false,
      noPicture: false,
      lang: "",
    };
  },
  computed: {
    cloudFrontUrl() {
      return (
        "https://d1tqac1zek46ma.cloudfront.net/spots_" +
        this.currentlyValidatedSpot.sport
      );
    },
  },
  watch: {
    explanationPopup(newVal) {
      if (!newVal) {
        this.loadMoreSpots();
        this.initMap();
      }
    },
    currentlyValidatedSpot(newVal) {
      if (this.currentlyValidatedSpot !== null) {
        this.currentlyValidatedSpot.pictures.forEach((picture) => {
          picture.valid = true;
        });
      }
    },
  },
  created() {
    this.lang = localStorage.getItem("lang");
  },
  methods: {
    goToUser(userId) {
      this.$store.commit("user/setClickedUserId", userId);
    },
    changePictureValidation(picture) {
      if (picture.valid) {
        picture.valid = null;
      } else {
        picture.valid = true;
      }
    },
    editTags(tags) {
      this.currentlyValidatedSpot.tags = tags;
      this.tagPicker = false;
    },
    validateSpot(secret, validated) {
      this.$store.commit("setLoading", true);
      this.$store
        .dispatch("admin/validateSpot", {
          secret: secret,
          validated: validated,
          spot: this.currentlyValidatedSpot,
          sportId: this.currentlyValidatedSpot.sport,
          onlyPictures: this.noSpot,
        })
        .then(() => {
          this.nexSpot();
        });
    },
    nexSpot() {
      this.unvalidatedSpots.shift();
      if (this.unvalidatedSpots.length === 0) {
        this.loadMoreSpots();
      } else {
        this.currentlyValidatedSpot = this.unvalidatedSpots[0];
        this.displayMarkerOnMap();
        this.$store.commit("setLoading", false);
      }
    },

    loadMoreSpots() {
      this.$store.commit("setLoading", true);
      this.$store.dispatch("admin/getUnvalidatedSpots", {}).then((data) => {
        if (data.length === 0) {
          this.noSpot = true;
          this.currentlyValidatedSpot = null;
          this.$store.commit("setLoading", false);
          this.loadMorePictures();
          return;
        }
        this.unvalidatedSpots = data;
        this.currentlyValidatedSpot = this.unvalidatedSpots[0];
        this.displayMarkerOnMap();
        this.$store.commit("setLoading", false);
      });
    },
    loadMorePictures() {
      this.$store.commit("setLoading", true);
      this.$store
        .dispatch("admin/getSpotsWithUnvalidatedPictures", {})
        .then((data) => {
          if (data.length === 0) {
            this.noPicture = true;
            this.currentlyValidatedSpot = null;
            this.$store.commit("setLoading", false);
            return;
          }
          this.unvalidatedSpots = data;
          this.currentlyValidatedSpot = this.unvalidatedSpots[0];
          this.displayMarkerOnMap();
          this.$store.commit("setLoading", false);
        });
    },
    displayMarkerOnMap() {
      if (this.marker !== null) {
        this.map.removeLayer(this.marker);
      }
      this.marker = L.marker(
        [this.currentlyValidatedSpot.lat, this.currentlyValidatedSpot.lon],
        {
          icon: this.spotIcon,
        }
      );
      this.map.setView(
        [this.currentlyValidatedSpot.lat, this.currentlyValidatedSpot.lon],
        18
      );
      this.marker.addTo(this.map);
    },

    initMap() {
      this.map = L.map("map", { zoomControl: false }).setView([45.63, 2], 6);

      this.tileLayer = L.tileLayer(
        "https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        //"https://tile.tracestrack.com/_/{z}/{x}/{y}.png?key=c0103ecabe0a5eef358ef11f361b3fab",
        {
          attribution: this.$t("others.map_attribution"),
        }
      );

      this.tileLayer.addTo(this.map);
    },
  },
};
</script>
<style lang="scss" scoped>
.explanation-popup {
  background-color: white;
  border-radius: 14px;
  padding: 10px;

  .explanation {
    text-align: justify;
  }
  .ok {
    margin-top: 10px;
    text-align: center;
  }
}
.main-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: var(--page-height);
  overflow-y: scroll;
  #map {
    height: 200px;
    min-height: 200px;
    width: 90vw;
    border-radius: 15px;
    margin-top: 10px;
  }
  .spot-info {
    margin-top: 15px;
    width: 95vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    .spot-name {
      text-align: center;
      width: 95vw;
      margin: 10px 0px;
    }
    .added-by {
      background-color: white;
      padding: 7px;
      .small-title {
        margin-top: 0px;
      }
      .user-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
    .spot-pictures {
      display: flex;
      flex-direction: column;
      .spot-picture {
        width: 300px;
        border-radius: 14px;
        margin-top: 10px;
        &.valid {
          border: 5px green solid;
        }
        &.invalid {
          border: 5px red solid;
        }
      }
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;
      margin-bottom: 10px;
    }

    .spot-description {
      margin-top: 10px;
      width: 95vw;
    }
    .validate-buttons {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      margin-top: 10px;
      .button {
        margin-bottom: 5px;
      }
    }
  }
}
</style>
