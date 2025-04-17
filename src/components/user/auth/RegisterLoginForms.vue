<template>
  <div class="form" id="register-login-forms">
    <LanguageSwitcher class="language-switcher" ref="languageSwitcher" />
    <div v-if="state === 'registered'" class="congrats">
      <div class="message">
        <div>{{ $t('account.congrats') }}</div>
        <br />
        {{ $t('account.you_are_now_signed_up') }}
      </div>
      <q-btn class="login-button above-all" label-color="black" standout="bg-blue-1" input-style="color:black" :label="$t('account.login')" color="primary" no-caps @click="state = 'login'" />
    </div>
    <LoginForm v-if="state === 'login'" @logged-in="loggedIn" @register="state = 'register'" @forgot-password="state = 'forgotPassword'" />
    <RegisterForm v-if="state === 'register'" @login="state = 'login'" @registered="state = 'registered'" />
    <ForgotPasswordForm @cancel="state = 'login'" v-if="state === 'forgotPassword'" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Input from 'components/form/Input'
import LanguageSwitcher from 'components/others/LanguageSwitcher'
import RegisterForm from 'components/user/auth/RegisterForm.vue'
import LoginForm from 'components/user/auth/LoginForm.vue'
import ForgotPasswordForm from 'components/user/auth/ForgotPasswordForm.vue'

export default defineComponent({
  name: 'VerificationsPopup',
  components: {
    Input,
    LanguageSwitcher,
    RegisterForm,
    LoginForm,
    ForgotPasswordForm,
  },
  data() {
    return {
      state: 'login',
    }
  },
  created() {},
  methods: {
    loggedIn() {
      this.$refs.languageSwitcher
        .switchLanguage([
          localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en',
          '',
        ])
        .then(() => {
          this.$store.commit('setSection', 'my-sports')
          this.$router.push('my-sports')
        })
    },
  },
})
</script>

<style lang="scss" scoped>
.congrats {
  margin-top: 5vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  .message {
    text-align: center;
    font-size: 1.5em;
    margin-bottom: 5vh;
  }
}
</style>
<style lang="scss">
#register-login-forms {
  .form {
    width: 55vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 40vh;
    z-index: 500;
    position: relative;
    .buttons {
      display: flex;
      justify-content: space-around;
      width: 100%;
    }
    label {
      display: flex;
      flex-direction: column;
      margin-top: 2vh;
      width: 100%;
    }
  }
  .clickable {
    position: relative;
    margin-top: 8px;
    text-align: center;
    font-size: 0.9em;
    &.forgot-password {
      width: 100%;
      text-align: right;
    }
    span {
      color: blue;
    }
  }
  .small-label {
    .q-field__label {
      font-size: 1em !important;
    }
  }
}
</style>
