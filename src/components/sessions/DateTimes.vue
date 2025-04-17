<template>
  <div class="dates-wrapper">
    <div class="dates" v-if="sessions === null">
      <DateTime v-for="i in [1, 2, 3]" :key="i" :loading="true" />
    </div>
    <div class="dates" v-else>
      <DateTime
        v-for="session in sessions"
        :key="session"
        @click="dateClicked(session.id)"
        :date="session.date"
      />
    </div>
    <div class="no-session" v-if="sessions && sessions.length === 0">
      {{ $t("others.no_upcoming_sessions") }}
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
    return {};
  },
  props: ["sessions"],
  methods: {
    dateClicked(sessionId) {
      this.$store.commit("sessions/setClickedSessionId", sessionId);
    },
  },
  created() {},
});
</script>
<style lang="scss" scoped>
.dates-wrapper {
  box-shadow: none;
  .dates {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  .no-session {
    display: flex;
    justify-content: center;
    margin: 30px 0px;
  }
}
</style>
