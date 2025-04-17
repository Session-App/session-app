<template>
  <div class="layouts-wrapper">
    <q-layout view="lHh Lpr lFf">
      <q-header class="header">
        <q-toolbar>
          <img src="svg/back-arrow.svg" class="back-arrow" @click="$router.go(-1)" v-if="
              [
                'sessions',
                'my-sports',
                'profile',
                'conversations',
                'thank-you',
                'edit-profile',
              ].indexOf($route.name) < 0 || $route.query.userId !== undefined
            " />
          <img src="logo-no-text.png" class="logo" v-else />
          <q-toolbar-title>{{ $t("header.title") }}</q-toolbar-title>
          <img src="svg/settings.svg" class="logo invert" @click="goTo('settings')" v-if="
              $route.name === 'profile' && $route.query.userId === undefined
            " />
          <img src="svg/community-search-outline.svg" class="logo invert" @click="goTo('community')" v-if="'conversations' === $route.name" />
        </q-toolbar>
      </q-header>
      <q-page-container>
        <router-view />
      </q-page-container>
      <q-footer class="footer" v-show="!isKeyboardOnScreen">
        <LayoutSection icon="logo-no-text.png" :iconClass="
            currentSection === 'my-sports'
              ? 'pp-small-filled'
              : 'pp-small-outline'
          " iconSize="35px" :name="$t('footer.favorite_sports')" @click="
            $store.commit('setSection', 'my-sports');
            goTo('my-sports');
          " />
        <LayoutSection :icon="
            currentSection === 'sessions'
              ? 'svg/sessions-map-filled.svg'
              : 'svg/sessions-map-outline.svg'
          " iconClass="sessions-map" :name="$t('footer.home')" @click="
            $store.commit('setSection', 'sessions');
            goTo('sessions', { sportId: 'allSports' });
          " />
        <LayoutSection :icon="
            currentSection === 'add'
              ? 'svg/add-filled.svg'
              : 'svg/add-outline.svg'
          " :name="$t('footer.add')" iconSize="40px" @click="
            currentSection = 'add';
            displayOptionsAdd = true;
          " />
        <LayoutSection :icon="
            currentSection === 'community'
              ? 'svg/community-filled.svg'
              : 'svg/community-outline.svg'
          " :name="$t('footer.community')" @click="
            $store.commit('setSection', 'community');
            goTo('conversations');
          " />
        <LayoutSection :icon="user.profilePicture" :iconClass="
            currentSection === 'profile'
              ? 'pp-small-filled'
              : 'pp-small-outline'
          " :name="$t('footer.profile')" @click="
            $store.commit('setSection', 'profile');
            goTo('profile');
          " />
        <q-dialog v-model="displayOptionsAdd" class="options-add-dialog" id="options-add-dialog" position="bottom" @hide="addClosed">
          <div class="options-add">
            <div class="title">{{ $t("template.add") }}</div>
            <div class="option" @click="goTo('add-spot-session', { action: 'new-session' })">
              <img src="svg/session-add-calendar.svg" class="add-icon" />
              {{ $t("template.session") }}
            </div>
            <div class="option" @click="goTo('add-spot-session', { action: 'new-spot' })">
              <img src="svg/spot-add-icon.svg" class="add-icon" />
              {{ $t("template.spot") }}
            </div>
            <div v-if="isAdmin" class="option" @click="goTo('validate-spots')">
              <img src="svg/admin-validate-spot.png" class="add-icon" />
              {{ $t("template.admin_validate_spot") }}
            </div>
          </div>
        </q-dialog>
      </q-footer>
    </q-layout>
    <q-dialog v-model="tutorialPoup">
      <TutorialPoup @ok="tutorialPoup = false" />
    </q-dialog>
    <PushNotifications />
    <LocalizeMe :getLocationOnMounted="true" @location-found="gotUserLocation" :renderButton="false" />
    <q-dialog v-model="newVersionPopup">
      <NewVersionPopup />
    </q-dialog>

    <UserDetailBottomSheet />
    <ReportPopup />

    <SessionDetail />

    <ShareItem />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Keyboard } from '@capacitor/keyboard'
import { mapGetters } from 'vuex'
import LayoutSection from '../components/LayoutSection.vue'
import TutorialPoup from 'components/others/TutorialPoup'
import PushNotifications from 'components/others/PushNotifications'
import LocalizeMe from 'components/map/LocalizeMe.vue'
import NewVersionPopup from 'components/others/NewVersionPopup'
import UserDetailBottomSheet from 'components/user/UserDetailBottomSheet'
import ShareItem from 'components/community/ShareItem'
import SessionDetail from 'components/sessions/SessionDetail'
import ReportPopup from 'components/user/ReportPopup'
import { App } from '@capacitor/app'
import {
  AppTrackingTransparency,
  AppTrackingStatusResponse,
} from 'capacitor-plugin-app-tracking-transparency'

export default defineComponent({
  name: 'MainLayout',
  components: {
    NewVersionPopup,
    TutorialPoup,
    LayoutSection,
    PushNotifications,
    LocalizeMe,
    UserDetailBottomSheet,
    ShareItem,
    SessionDetail,
    ReportPopup,
  },
  data() {
    return {
      cloudfrontUrlPP:
        'https://d1tqac1zek46ma.cloudfront.net/profile_pictures/',
      user: {
        profilePicture: 'svg/single-user.svg',
      },
      isKeyboardOnScreen: false,
      displayOptionsAdd: false,
      currentSection: null,
      isAdmin: false,
      tutorialPoup: false,
      newVersionPopup: false,
      bottomNavbarHeight: '65px',
    }
  },

  created() {
    var tempPP = localStorage.getItem('userPP')
    tempPP === 'null'
      ? (this.user.profilePicture = 'svg/pp.svg')
      : (this.user.profilePicture = this.cloudfrontUrlPP + tempPP)

    try {
      localStorage
        .getItem('roles')
        .split(',')
        .forEach((role) => {
          if (role.indexOf('ROLE_ADMIN_') > -1) {
            this.isAdmin = true
          }
        })
    } catch {}

    this.currentSection = this.viewSection

    if (localStorage.getItem('newUser') === null) {
      this.tutorialPoup = true
      localStorage.setItem('newUser', false)
    }

    Keyboard.addListener('keyboardWillShow', () => {
      this.isKeyboardOnScreen = true
      document.documentElement.style.setProperty('--footer-height', '0px')
    })
    Keyboard.addListener('keyboardDidHide', () => {
      this.isKeyboardOnScreen = false
      document.documentElement.style.setProperty('--footer-height', '65px')
    })

    this.getTrackingPermissionStatus().then((data) => {
      if (data.status !== 'authorized') {
        this.requestTrackingPermissionPermission()
      }
    })

    //check if a new version is available
    this.getAppVersionCode().then((response) => {
      const latestAvailableVersionCode = this.$q.platform.is.ios
        ? response.ios
        : response.android

      App.getInfo().then((info) => {
        const currentVersionCode = parseInt(info.build)
        if (
          currentVersionCode &&
          currentVersionCode < latestAvailableVersionCode
        ) {
          this.newVersionPopup = true
        }
      })
    })
  },
  computed: {
    ...mapGetters(['getSection', 'getProfilePicture']),
    viewSection() {
      return this['getSection']
    },
    viewQuery() {
      return this.$route.query
    },
    viewProfilePicture() {
      return this['getProfilePicture']
    },
  },
  watch: {
    viewProfilePicture(newVal) {
      this.user.profilePicture = this.cloudfrontUrlPP + newVal
    },
    viewSection(newVal) {
      this.currentSection = newVal
    },
    viewQuery(newVal) {
      if (
        this.$route.query.action === undefined &&
        this.$route.query.reason === undefined
      ) {
        this.currentSection = this.viewSection
      }
    },
  },
  methods: {
    getAppVersionCode() {
      return fetch('https://app-session.com/appVersionCode.json').then(
        (response) => {
          return response.json()
        }
      )
    },
    gotUserLocation(location) {
      let payload = {
        lat: location ? location.coords.latitude : null,
        lon: location ? location.coords.longitude : null,
        platform: this.$q.platform.is.ios ? 'ios' : 'android',
      }
      App.getInfo()
        .then((info) => {
          payload.version = parseInt(info.build)
        })
        .finally(() => {
          this.$store.dispatch('user/setLastLocation', payload)
        })
    },
    getTrackingPermissionStatus: async () => {
      const response = await AppTrackingTransparency.getStatus()

      return response
    },

    requestTrackingPermissionPermission: async () => {
      const response = await AppTrackingTransparency.requestPermission()

      return response
    },
    addClosed() {
      if (this.$route.query.action === undefined) {
        this.currentSection = this.viewSection
      }
    },
    goTo(route, query = {}) {
      this.$router.push({
        name: route,
        query: query,
      })
    },
  },
})
</script>


<style lang="scss" scoped>
.back-arrow {
  width: 27px;
}
.logo {
  width: 30px;
  margin-left: -5px;
}
.header {
  height: calc(var(--header-height) + env(safe-area-inset-top));
}
.footer {
  display: flex;
  justify-content: space-around;
  width: 100vw;
  background-color: white;
  z-index: 999999;
  height: calc(var(--footer-height) + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
}
.options-add-dialog {
  .options-add {
    margin-bottom: 55px;
    padding: 10px;
    background-color: white;
    border-top-left-radius: $button-border-radius;
    border-top-right-radius: $button-border-radius;
    .title {
      text-align: center;
      font-size: 1.3em;
    }
    .option {
      display: flex;
      align-items: center;
      margin: 10px 0px;
      font-size: 1.1em;
      .add-icon {
        width: 35px;
        margin-right: 10px;
      }
    }
  }
}
</style>
