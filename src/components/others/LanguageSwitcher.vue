<template>
  <div class="language-switcher">
    <div class="switcher-button">
      <q-btn color="primary" :no-caps="true" @click="languagePicker = true">{{ $t("languages." + currentLang[0]) + " " + currentLang[1] }}</q-btn>
    </div>
    <q-dialog class="language-picker" v-model="languagePicker">
      <LanguagePicker :languages="languages" @lang-clicked="switchLanguage" />
    </q-dialog>
  </div>
</template>

<script>
import LanguagePicker from 'components/others/LanguagePicker'
import { Device } from '@capacitor/device'

export default {
  name: 'LanguageSwitcher',
  components: { LanguagePicker },
  data() {
    return {
      currentLang: ['fr', '🇫🇷'],
      languagePicker: false,
      languages: [
        ['fr', '🇫🇷'],
        ['en', '🇬🇧'],
        ['es', '🇪🇸'],
      ],
    }
  },
  mounted() {
    if (this.$route.name === 'register-login') {
      if (!localStorage.getItem('lang')) {
        try {
          Device.getLanguageCode().then((lang) => {
            localStorage.setItem('lang', lang.value.slice(0, 2))
            this.$i18n.locale = lang.value.slice(0, 2)
          })
        } catch {
          localStorage.setItem('lang', 'en')
          this.$i18n.locale = 'en'
        }
      }
    }

    this.currentLang[0] = localStorage.getItem('lang') ?? 'fr'
    this.languages.forEach((lang) => {
      if (lang[0] === this.currentLang[0]) {
        this.currentLang[1] = lang[1]
      }
    })
  },
  methods: {
    switchLanguage(lang) {
      return new Promise((resolve) => {
        if (localStorage.getItem('token')) {
          this.$store.commit('setLoading', true)
          this.$store.dispatch('user/setLang', { lang: lang[0] }).then(() => {
            this.currentLang = lang
            this.$i18n.locale = lang[0]
            localStorage.setItem('lang', lang[0])
            this.$store.commit('setLoading', false)
            this.languagePicker = false
            resolve()
          })
        } else {
          // user is on login page
          this.currentLang = lang
          this.$i18n.locale = lang[0]
          localStorage.setItem('lang', lang[0])
          this.languagePicker = false
          resolve()
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.language-switcher {
  .switcher-button {
    display: flex;
    justify-content: center;
  }
}
</style>
