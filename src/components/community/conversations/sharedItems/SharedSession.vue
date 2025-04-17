<template>
  <div class="shared-session">
    <div class="title" v-if="!isLoading">{{ session?.spot.name }}</div>
    <q-skeleton v-else class="title" />
    <DateTime :loading="isLoading" :date="session.date" class="date-time" />
    <q-btn
      :no-caps="true"
      :label="$t('sessions.see_session_detail')"
      color="primary"
      dense
      class="button"
      @click="showSessionDetail"
    />
  </div>
</template>
<script>
import { defineComponent } from "vue";
import DateTime from "components/sessions/DateTime";

export default defineComponent({
  name: "SharedSession",
  components: { DateTime },
  data() {
    return {
      session: {},
      isLoading: true,
      cloudfrontUrlPP:
        "https://d1tqac1zek46ma.cloudfront.net/profile_pictures/",
    };
  },
  props: { sessionId: {} },
  created() {
    this.$store
      .dispatch("sessions/getSessionDetail", {
        sessionId: this.sessionId,
        brief: true,
      })
      .then((data) => {
        this.session = data;
        this.isLoading = false;
      });
  },
  mounted() {},
  methods: {
    showSessionDetail() {
      this.$store.commit("sessions/setClickedSessionId", this.session.id);
    },
  },
});
</script>
<style lang="scss" scoped>
@use "../../../../css/mixins.scss";
.shared-session {
  @include mixins.elevated-box;
  border-radius: 15px;
  padding: 7px;
  width: 80vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    text-align: center;
    width: 100%;
  }

  .button {
    margin-top: 7px;
  }
}
</style>
