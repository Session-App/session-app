<template>
  <div class="login-form form">
    <Input :label="$t('account.username_or_email')" v-model="form.username" class="small-label" />

    <q-input :type="clearPswd ? 'text' : 'password'" :label="$t('account.password')" label-color="black" v-model="form.password" input-style="color:black" borderless class="custom-input small-label">
      <template v-slot:append>
        <q-icon :name="clearPswd ? 'visibility' : 'visibility_off'" class="cursor-pointer" @click="clearPswd = !clearPswd" />
      </template>
    </q-input>
    <div class="clickable forgot-password">
      <span @click="$emit('forgot-password')">
        {{
        $t("account.forgot_password")
        }}
      </span>
    </div>

    <q-btn class="submit-button" :label="$t('account.submit')" color="primary" no-caps @click="submit" />
    <div class="clickable">
      {{ $t("account.no_account") }}
      <span @click="$emit('register')">{{ $t("account.register") }}</span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { notify } from 'boot/helpers'
import Input from 'components/form/Input'

export default defineComponent({
  name: 'LoginForm',
  components: { Input },
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      errors: [],
      clearPswd: false,
    }
  },
  methods: {
    submit() {
      this.$store.commit('setLoading', true)
      this.$store
        .dispatch('auth/login', this.form)
        .then((data) => {
          this.$store.dispatch('user/getUser').then(() => {
            this.$store.dispatch('auth/afterLogin').then(() => {
              this.$emit('logged-in')
              this.$store.commit('setLoading', false)
            })
          })
        })
        .catch((error) => {
          this.$store.commit('setLoading', false)
          if (error.response && error.response.data.code === 401) {
            notify(['invalid_credentials'])
          } else {
            notify(['error_happened'])
          }
        })
    },
  },
  props: {},
})
</script>

<style lang="scss" scoped>
.login-form {
  .forgot-password {
    margin-bottom: 15px;
  }
}
</style>
