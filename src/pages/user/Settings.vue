<template>
  <div class="main-wrapper">
    <div class="card">
      {{ $t('account.referral_code') }} :
      <div class="referral-code">
        <ShareReferralCode />
      </div>
    </div>

    <div class="card">
      {{ $t('account.language') }} :
      <LanguageSwitcher />
    </div>
    <div class="card">
      {{ $t('account.terms_of_use') }} :
      <div class="terms-of-use">
        <q-btn color="primary" :no-caps="true" href="https://app-session.com/Sessionterms.html">{{ $t('account.terms_of_use') }}</q-btn>
      </div>
    </div>
    <q-btn class="logout" :no-caps="true" color="red" @click="logout">
      {{
      $t('account.logout')
      }}
    </q-btn>

    <q-btn class="delete-account" :no-caps="true" color="red" @click="deleteAccountModel = true">{{ $t('account.delete_account') }}</q-btn>

    <q-dialog v-model="deleteAccountModel">
      <DeleteAccountPopup @no="deleteAccountModel = false" @yes="deleteAccount" />
    </q-dialog>
  </div>
</template>

<script charset="utf-8">
import { Clipboard } from '@capacitor/clipboard'
import LanguageSwitcher from 'components/others/LanguageSwitcher'
import DeleteAccountPopup from 'components/user/DeleteAccountPopup'
import ShareReferralCode from 'components/community/ShareReferralCode'

export default {
  components: {
    Clipboard,
    LanguageSwitcher,
    DeleteAccountPopup,
    ShareReferralCode,
  },
  data() {
    return {
      deleteAccountModel: false,
    }
  },

  created() {},
  methods: {
    logout() {
      this.$store.commit('setLoading', true)
      this.$store.dispatch('auth/logout')
    },
    deleteAccount() {
      this.$store.commit('setLoading', true)
      this.$store.dispatch('auth/deleteAccount').then(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        this.$store.commit('setLoading', false)
        this.$router.replace('register-login')
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@use '../../css/mixins.scss';
@import '../../css/popup.scss';

.main-wrapper {
  height: var(--page-height);
  width: 100vw;
  background: $background-gradient;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  .card {
    @include mixins.elevated-box;
    border-radius: 14px;
    width: 95vw;
    padding: 10px;
    margin-top: 10px;
    .terms-of-use {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.2em;
      margin-top: 10px;
    }
    .referral-code {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.2em;
      margin-top: 10px;
    }
  }
  .logout {
    margin-top: 50px;
  }
  .delete-account {
    margin-top: 40px;
  }
}
</style>
