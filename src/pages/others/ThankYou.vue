<template>
  <div class="thanks">
    <div class="message">
      <div class="thanks-message">{{ $t("thanks." + $route.query.reason + "_thanks") }}</div>
      <div class="info-message">{{ $t("thanks." + $route.query.reason + "_info") }}</div>
    </div>
    <img src="logo-thanks.png" class="logo-thanks" />
    <br />
    <div class="buttons">
      <q-btn v-if="$route.query.reason === 'added_session'" class="share-session button" color="primary" no-caps @click="shareSession">
        {{$t('sessions.share_session')}}
        <q-icon size="18px" class="share-icon" name="content_share" />
      </q-btn>
      <q-btn class="see-contribution button" color="primary" no-caps :label="$t('thanks.back_to_profile')" @click="goToContribution" />
    </div>
  </div>
</template>
<script >
import confetti from 'canvas-confetti'

export default {
  components: {},
  data() {
    return {
      confettiInterval: null,
    }
  },
  mounted() {
    const colors = ['#105494', '#ece9e9', '#f02444']
    function confettiEnter() {
      confetti({
        particleCount: 150,
        angle: 60,
        spread: 50,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      })
      confetti({
        particleCount: 75,
        angle: 120,
        spread: 50,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      })
      confetti({
        particleCount: 75,
        angle: 120,
        spread: 50,
        origin: { x: 1, y: 1 },
        colors: colors,
      })
    }
    // function confettiAfter() {
    //   confetti({
    //     particleCount: 20,
    //     angle: 60,
    //     spread: 50,
    //     origin: { x: 0, y: 0.7 },
    //     colors: colors,
    //   });
    //   confetti({
    //     particleCount: 20,
    //     angle: 120,
    //     spread: 50,
    //     origin: { x: 1, y: 0.7 },
    //     colors: colors,
    //   });
    // }
    confettiEnter()
    // this.confettiInterval = setInterval(() => {
    //   confettiAfter();
    // }, 3000);
  },
  beforeRouteLeave() {
    clearInterval(this.confettiInterval)
  },
  methods: {
    shareSession() {
      this.$store.commit(
        'conversations/setSharedSessionId',
        this.$route.query.sessionId
      )
    },
    goToContribution() {
      this.$store.commit('setSection', 'profile')
      this.$router.push('profile')
    },
  },
}
</script>
<style lang="scss" scoped>
.thanks {
  height: var(--page-height);
  background: linear-gradient(180deg, $primary, #fbfcff);
  text-align: center;
  overflow: hidden;
  color: white;
  .message {
    padding-top: 8vh;
    .thanks-message {
      font-size: 1.5em;
    }
    .info-message {
      margin-top: 25px;
    }
  }
  .logo-thanks {
    width: 150px;
    margin-top: 12vh;
  }
  .buttons {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .button {
      margin-top: 20px;
    }
    .share-session {
      .share-icon {
        margin-right: 65px;
        margin-left: -65px;
      }
    }
  }
}
</style>
