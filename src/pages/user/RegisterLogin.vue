<template>
  <div class="main-div">
    <img src="svg/register-login/sun.svg" class="sun" alt="sun" />
    <div class="paraglider-wrapper">
      <img
        class="animated-item paraglider"
        src="svg/register-login/paragliding.svg"
      />
    </div>
    <img class="logo" src="logo.png" />
    <!-- <h4 class="hbar"></h4>
    <h5 v-if="login === false" class="join-us">{{ $t("account.join_us") }}</h5>
    <h5 v-if="login === true" class="join-us">{{ $t("account.login") }}</h5>-->
    <div class="form-wrapper">
      <div class="form-left">
        <img
          class="animated-item kitesurf"
          src="svg/register-login/kitesurf.svg"
          width="50"
        />

        <img
          class="animated-item cliffjump"
          src="svg/register-login/cliffjump.png"
        />
      </div>
      <RegisterLoginForms />
      <div class="form-right">
        <img
          class="animated-item climbing"
          src="svg/register-login/climbing.svg"
        />
      </div>
    </div>
  </div>

  <div class="bottom" v-show="!isKeyboardOnScreen">
    <img class="animated-item scubadiving" src="svg/register-login/scuba.png" />
    <img class="waves" src="svg/register-login/bottom-sea-moutain.svg" />
  </div>
</template>

<script>
import { Keyboard } from '@capacitor/keyboard'
import RegisterLoginForms from 'components/user/auth/RegisterLoginForms'
import LanguageSwitcher from 'components/others/LanguageSwitcher'

export default {
  components: {
    LanguageSwitcher,
    RegisterLoginForms,
  },
  data() {
    return {
      isKeyboardOnScreen: false,
    }
  },
  mounted(){
    this.$store.commit('setLoading', false)
  },
  created() {
    if (this.$route.query.error !== undefined) {
      this.$q.notify(this.$t('notification.' + this.$route.query.error))
    }
    Keyboard.addListener('keyboardWillShow', () => {
      this.isKeyboardOnScreen = true
    })
    Keyboard.addListener('keyboardDidHide', () => {
      this.isKeyboardOnScreen = false
    })
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.main-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  .language-switcher {
    margin-top: 45px;
  }
}

.title {
  font-size: 4.5em;
  margin-top: 0px;
}
.problem {
  color: red;
  text-align: center;
  font-size: 0.9em;
  margin-bottom: -5px;
}

.form-wrapper {
  margin-top: 0px;
  display: flex;
}
.form-right {
  width: 22.5vw;
  display: flex;
  justify-content: flex-end;
}
.form-left {
  width: 22.5vw;
  display: flex;
  justify-content: flex-start;
}

.animated-item {
  animation: float 3s ease-out infinite;
}
.sun {
  position: fixed;
  width: 150px;
  left: 0px;
}
.kitesurf {
  width: 55px;
  position: absolute;
}
.paraglider-wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.paraglider {
  margin-right: 10px;
  margin-top: 15px;
  animation-delay: 0.5s;
  width: 70px;
}
.cliffjump {
  width: 60px;
  margin-left: 5vw;
  animation-delay: 1s;
  z-index: 500;
  position: absolute;
  margin-top: 40vh;
}
.scubadiving {
  width: 120px;
  margin-bottom: 5vh;
  margin-left: 35vw;
}
.climbing {
  width: 50px;
  position: absolute;
  animation-delay: 1.5s;
}
.bottom {
  width: 100%;
  position: fixed;
  bottom: -7px;
  left: 0px;
}
.waves {
  width: 100%;
  position: fixed;
  bottom: -7px;
  left: 0px;
}
.logo {
  width: 150px;
  margin-top: -40px;
}
@keyframes float {
  50% {
    transform: translate(0, 20px);
  }
}
.hbar {
  margin-bottom: 5px;
}
.login-button {
  position: relative;
  margin-bottom: 5px;
}
</style>
