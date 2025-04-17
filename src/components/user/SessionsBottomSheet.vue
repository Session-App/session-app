<template>
  <div class="wrapper">
    <div class="close-sheet">
      <img src="svg/close.svg" @click="$emit('close-clicked')" />
    </div>
    <div class="sessions">
      <div
        class="session"
        v-for="session in sessions.sessions"
        :key="session"
        @click="displaySession(session)"
      >
        <div class="left">
          <div class="spot-name">
            {{ session.spot.name }}
          </div>
          <SportBadge :sportId="session.spot.sport" />
        </div>
        <div class="right">
          <DateTime :date="session.date" />
        </div>
      </div>
    </div>
    <div
      class="sessions"
      v-if="isDataLoading && sessions.sessions.length === 0"
    >
      <div class="session" v-for="i in [1, 2, 3]" :key="i">
        <div class="left">
          <q-skeleton class="spot-name" />
        </div>
        <div class="right">
          <DateTime :loading="true" />
        </div>
      </div>
    </div>
    <div
      class="load-more"
      v-if="amount > sessions.sessions.length && sessions.sessions.length !== 0"
      @click="getSessions"
    >
      <q-btn
        class="button"
        color="primary"
        :no-caps="true"
        :loading="isDataLoading"
      >
        {{ $t("others.load_more") }}
      </q-btn>
    </div>
    <div
      class="no-session"
      v-if="sessions.sessions.length === 0 && !isDataLoading"
    >
      <span
        v-html="
          this.userId !== null
            ? $t('account.no_session_foreign_' + sessionsType, [username])
            : $t('account.no_session_' + sessionsType)
        "
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import DateTime from "components/sessions/DateTime";
import SportBadge from "components/sports/SportBadge";

export default defineComponent({
  name: "SessionsBottomSheet",
  components: { DateTime, SportBadge },
  props: {
    sessionsType: {},
    amount: {},
    username: {},
    userId: { default: null },
  },
  data() {
    return {
      detailState: true,
      sessionDetailDialog: false,
      session: null,
      sessions: { sessions: [], page: 1 },
      isDataLoading: true,
    };
  },
  created() {
    this.getSessions();
  },
  methods: {
    getSessions() {
      if (this.amount == 0) {
        this.isDataLoading = false;
        return;
      }
      this.isDataLoading = true;
      this.$store
        .dispatch("user/getSessions", {
          page: this.sessions.page,
          sessionsTypes: this.sessionsType,
          userId:
            this.userId !== null ? this.userId : localStorage.getItem("userId"),
        })
        .then((data) => {
          this.sessions.sessions = [
            ...this.sessions.sessions,
            ...data.sessions,
          ];
          this.isDataLoading = false;
          this.sessions.page++;
        });
    },
    displaySession(session) {
      this.session = session;
      this.$store.commit("sessions/setClickedSessionId", session.id);
    },
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  width: 95vw !important;
  box-shadow: none;
  overflow-x: hidden;
  .close-sheet {
    margin-bottom: -10px;
    img {
      margin-top: 10px;
      margin-left: 2px;
      width: 15px;
    }
  }
  .session {
    display: flex;
    width: 93vw;
    margin: 10px 5px;
    padding-left: 10px;
    align-items: center;
    justify-content: space-between;
    border-radius: 15px;
    box-shadow: 0 0px 3px #080808;

    .spot-name {
      min-width: 200px;
    }
  }
  .no-session {
    text-align: center;
    margin: 35px 0px;
  }
  .load-more {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }
}
</style>
