<template>
  <div class="register-form form">
    <div class="personal" v-if="form.type === 'personal'">
      <Input :label="$t('account.email')" v-model.trim="form.email" dense />
      <Input :label="$t('account.username')" maxlength="22" v-model="form.username" dense />
      <q-input v-model="form.password" :type="clearPswd ? 'text' : 'password'" :label="$t('account.password')" label-color="black" input-style="color:black" borderless dense class="custom-input">
        <template v-slot:append>
          <q-icon :name="clearPswd ? 'visibility' : 'visibility_off'" class="cursor-pointer" @click="clearPswd = !clearPswd" />
        </template>
      </q-input>
      <q-input type="text" label-color="black" input-style="color:black" borderless class="custom-input" :label="$t('account.referral_code')" v-model.trim="form.referredBy" dense>
        <template v-slot:append>
          <span @click="referralExplanationPopup = true">?</span>
        </template>
      </q-input>

      <div class="accept-terms">
        <q-checkbox size="35px" v-model="acceptTerms" />
        <div>
          {{ $t("account.terms.accept")
          }}
          <span class="terms">
            <a href="https://app-session.com/Sessionterms.html" target="_blank">{{ $t("account.terms.terms") }}</a>
          </span>
        </div>
      </div>
      <q-btn class="submit-button" label-color="black" standout="bg-blue-1" input-style="color:black" :label="$t('account.submit')" color="primary" no-caps @click="submit" />
      <div class="clickable">
        {{ $t("account.already_have_account") }}
        <span @click="$emit('login')">{{ $t("account.login") }}</span>
      </div>
      <q-dialog v-model="referralExplanationPopup">
        <ReferralExplanationPopup @ok="referralExplanationPopup = false" />
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { passwordDifficultyCheck, notify } from 'boot/helpers'
import { App } from '@capacitor/app'
import Input from 'components/form/Input'
import ReferralExplanationPopup from 'components/user/ReferralExplanationPopup'

export default defineComponent({
  name: 'RegisterForm',
  components: { Input, ReferralExplanationPopup },
  data() {
    return {
      form: {
        username: '',
        email: '',
        referredBy: null,
        password: '',
        platform: '',
        version: 0,
        type: 'personal',
        lang: 'fr',
      },
      acceptTerms: false,
      clearPswd: false,
      errors: [],
      referralExplanationPopup: false,
    }
  },
  methods: {
    submit() {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,3}$/
      if (this.form.username === '') {
        this.errors.push('missing_username')
      } else if (/\s/.test(this.form.username)) {
        this.errors.push('no_space_username')
      }
      if (this.form.username.length > 22) {
        this.errors.push('username_too_long')
      }
      if (passwordDifficultyCheck(this.form.password) < 3) {
        this.errors.push('weak_password')
      }
      if (this.form.email === '') {
        this.errors.push('missing_email')
      } else if (!emailPattern.test(this.form.email)) {
        this.errors.push('invalid_email')
      }
      if (!this.acceptTerms) {
        this.errors.push('accept_terms')
      }
      if (this.errors.length !== 0) {
        this.$store.commit('setLoading', false)
        notify(this.errors)
        this.errors = []
        return null
      }
      this.$store.commit('setLoading', true)
      this.form.platform = this.$q.platform.is.ios ? 'ios' : 'android'
      App.getInfo().then((info) => {
        this.form.version = parseInt(info.build)
      })
      this.form.lang = localStorage.getItem('lang')
        ? localStorage.getItem('lang')
        : 'en'
      this.$store
        .dispatch('auth/register', this.form)
        .then(() => {
          this.$store.commit('setLoading', false)
          this.$emit('registered')
        })
        .catch((error) => {
          this.$store.commit('setLoading', false)
          console.log(error)
          notify(error.errors)
        })
    },
  },
  props: {},
})
</script>

<style lang="scss" scoped>
.register-form {
  .personal {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .submit-button {
    margin-top: 20px;
  }
  .accept-terms {
    display: flex;
    align-items: center;
    font-size: 0.8em;
    margin-top: 5px;
    margin-bottom: -7px;
    position: relative;
    .terms {
      color: blue;
      a {
        text-decoration-line: none;
      }
    }
  }
}
</style>
