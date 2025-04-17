<template>
  <div class="component-wrapper">
    <div class="spot-name">
      {{ spot.name }}
    </div>
    <div class="dates-wrapper">
      <div class="dates" v-if="sessions.length === 0">
        <DateTime :loading="true" />
        <DateTime :loading="true" />
        <DateTime :loading="true" />
      </div>
      <div class="dates" v-if="sessions !== null">
        <DateTime
          v-for="session in sessions"
          :key="session"
          @click="displaySessionDetail(session)"
          :date="session.date"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import DateTime from "./DateTime";

export default defineComponent({
  name: "DateTimes",
  components: { DateTime },
  data() {
    return {
      session: null,
    };
  },
  props: ["sessions", "spot"],
  methods: {
    displaySessionDetail(session) {
      this.session = session;
      this.$store.commit("sessions/setClickedSessionId", session.id);
    },
    goToSession(id) {
      this.$router.push({
        name: "session-detail",
        query: {
          sportId: this.$route.query.sportId,
          sessionId: id,
          lat: this.spot.lat,
          lon: this.spot.lon,
        },
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.component-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  .spot-name {
    font-size: 1.3em;
    margin: 10px 0px;
  }
  .dates {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
