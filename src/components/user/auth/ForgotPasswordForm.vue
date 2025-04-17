<template>
  <div class="forgot-password form">
    <div class="explanation">
      {{ $t('account.forgot_password_explanation') }}
    </div>
    <Input :label="$t('account.email')" v-model="form.email" dense />
    <div class="buttons">
      <q-btn
        class="submit-button"
        :label="$t('others.cancel')"
        color="primary"
        no-caps
        @click="$emit('cancel')"
      />
      <q-btn
        class="submit-button"
        :label="$t('account.submit')"
        color="primary"
        no-caps
        @click="submit"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Input from 'components/form/Input'

export default defineComponent({
  name: 'ForgotPasswordForm',
  components: { Input },
  props: {},
  data() {
    return {
      loading: false,
      form: {
        email: '',
      },
    }
  },
  created() {},
  methods: {
    submit() {
      if (this.form.email.length === 0) {
        this.$q.notify({
          message: this.$t('notification.invalid_email'),
          timeout: 1000,
        })
        return
      }
      this.loading = true
      this.$store
        .dispatch('auth/forgotPassword', this.form)
        .then((data) => {
          this.loading = false
          this.$q.notify({
            message: this.$t('account.email_sent'),
            color: 'green-3',
            timeout: 1500,
          })
          this.$emit('cancel')
        })
        .catch((e) => {
          this.loading = false
          e.data.errors.forEach((error) => {
            this.$q.notify({
              message: this.$t('notification.' + error),
              timeout: 1000,
            })
          })
        })
    },
  },
})
</script>

<style lang="scss" scoped>
.forgot-password {
  .explanation {
    margin-top: 20px;
  }
  .buttons {
    margin-top: 10px;
  }
}
</style>
