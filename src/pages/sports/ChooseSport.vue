<template>
  <div class="main-wrapper" id="choose-sport-page">
    <div class="choose-sport-title">
      <div>
        {{
          $route.query.action === "new-session"
            ? $t("sessions.new_session")
            : $t("spots.new_spot")
        }}
      </div>
      <q-separator color="primary" class="separator" inset />
      <div>
        {{ $t("sports.choose_sport") }}
      </div>
    </div>
    <div class="subtitle" v-if="user.favoriteSports.length !== 0">
      {{ $t("account.favorite_sports") }}
    </div>
    <div class="sports-wrapper" v-if="user.favoriteSports.length !== 0">
      <div
        class="sport-badge"
        v-for="sport in user.favoriteSports"
        :key="sport"
        @click="goToSportPage(sport)"
      >
        <img :src="'svg/all-sports/' + sport + '.svg'" />
        {{ $t("sports.sports." + sport) }}
      </div>
    </div>
    <div class="subtitle other-sports" v-if="user.favoriteSports.length !== 0">
      {{ $t("others.other_sports") }}
    </div>
    <div
      v-for="(sports, letter) in sortedSports"
      :key="letter"
      class="sport-letter"
    >
      <div class="letter" v-if="sports.length !== 0">
        {{ letter }}
      </div>
      <div class="sports-wrapper">
        <div
          v-for="sport in sports"
          :key="sport"
          class="[ sport-badge"
          @click="goToSportPage(sport.id)"
        >
          <img :src="'svg/all-sports/' + sport.id + '.svg'" />
          {{ $t("sports.sports." + sport.id) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script charset="utf-8">
import { getFavoriteSports } from "boot/helpers";

export default {
  data() {
    return {
      user: {
        favoriteSports: [],
      },
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
    };
  },
  created() {
    this.user.favoriteSports = getFavoriteSports();
    this.sortSports();
  },
  methods: {
    sortSports() {
      let lang = localStorage.getItem("lang");
      let sports = { ...this.$i18n.messages[lang].sports.sports };
      var sport;
      Object.entries(sports).forEach(([id, name]) => {
        sport = {
          name: name,
          id: id,
        };
        this.sortedSports[sport.name.charAt(0)].push(sport);
      });
    },

    goToSportPage(sport) {
      var name;
      var query = { sportId: sport };
      if (this.$route.query.action === "new-spot") {
        name = "add-spot";
        query.action = this.$route.query.action;
      } else if (this.$route.query.action === "new-session") {
        name = "spots-map";
        query.action = this.$route.query.action;
      }
      this.$router.push({
        name: name,
        query: query,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-wrapper {
  height: var(--page-height);
  background: $background-gradient;
  position: fixed;
  overflow-y: scroll;
  width: 100vw;
  .choose-sport-title {
    margin-top: 10px;
    text-align: center;
    font-size: 2em;
    color: $primary;
    font-weight: bold;
    background-color: $overlay-background;
    backdrop-filter: $overlay-blur;
    width: 85vw;
    margin-left: 7.5vw;
    border-radius: 15px;
    .separator {
      margin: 3px 15vw;
    }
  }
  .subtitle {
    color: white;
    font-size: 1.2em;
    text-align: center;
    margin-top: 15px;
    margin-bottom: 10px;
  }
  .sports-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 5px;
    .sport-badge {
      margin: 5px;
      background-color: $light-white;
      box-shadow: 0 0px 3px #080808;
      display: flex;
      align-items: center;
      padding: 7px;
      border-radius: 7px;
      img {
        width: 30px;
        margin-right: 3px;
      }
    }
  }
  .other-sports {
    margin-top: 45px;
    margin-bottom: 15px;
  }
  .sport-letter {
    .letter {
      color: white;
      margin-left: 10px;
    }
  }
}
</style>
