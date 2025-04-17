<template>
  <div id="q-app">
    <router-view></router-view>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { App } from '@capacitor/app'
import { SplashScreen } from '@capacitor/splash-screen'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'App',
  data() {
    return {}
  },
  methods: {},
  beforeCreate() {
    if (
      localStorage.getItem('token') === null &&
      this.$route.path !== '/register-login'
    ) {
      this.$router.push('register-login')
    }
  },
  created() {
    if (localStorage.getItem('token')) {
      this.$store.commit('setSection', 'my-sports')
      this.$router.push('my-sports')
    }
    App.addListener('backButton', ({ canGoBack }) => {
      if (window.history.state.back !== '/register-login') {
        this.$router.push(window.history.state.back)
      } else {
        App.exitApp()
      }
    })
  },
  mounted() {
    SplashScreen.hide()
  },
  computed: {
    ...mapGetters(['auth/getLogout']),
    getLogout() {
      return this['auth/getLogout']
    },
  },
  watch: {
    getLogout(newVal) {
      if (newVal.loggingOut) {
        // this.$router.push({ name: 'register-login', query: newVal.query })
        // this.$store.commit('auth/setLogout', { loggingOut: false })
        // this.$store.commit('setLoading', false)
      }
    },
  },
})
</script>

<style lang="scss">
@import './css/apple-devices.scss';
</style>
