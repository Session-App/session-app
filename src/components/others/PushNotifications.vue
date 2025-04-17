<template>
  <div class="push-notifications"></div>
  <q-dialog
    class="bottom-sheet big"
    v-model="spotDetailDialog"
    position="bottom"
  >
    <SpotDetail @close-clicked="spotDetailDialog = false" :spotId="spotId" />
  </q-dialog>
</template>
<script>
import { defineComponent } from 'vue'
import SessionDetail from 'components/sessions/SessionDetail'
import SpotDetail from 'components/spots/SpotDetail'
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications'
// import { Badge } from '@capawesome/capacitor-badge'

export default defineComponent({
  name: 'PushNotifications',
  components: { SessionDetail, SpotDetail },
  data() {
    return {
      sessionDetailDialog: false,
      spotDetailDialog: false,
      spotId: null,
    }
  },
  created() {
    // Badge.clear()
    // iOS will prompt user and return if they granted permission or not, Android will just grant without prompting
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        PushNotifications.register()
      } else {
        //alert("Error, push notifications will not work");
      }
    })

    PushNotifications.addListener('registration', (token) => {
      if (!localStorage.getItem('pushNotificationsToken')) {
        this.$store
          .dispatch('user/pushNotificationsToken', {
            firebaseToken: token.value,
          })
          .then(() => {
            localStorage.setItem('pushNotificationsToken', token.value)
          })
      }
    })

    PushNotifications.addListener('registrationError', (error) => {
      //alert("Error, push notifications will not work"); //+ JSON.stringify(error)
    })

    // notif received while user is in the app
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {}
    )

    // fired when the user clicks on the notification and is taken to the app
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification) => {
        this.handleNotification(notification.notification.data)
        PushNotifications.removeAllDeliveredNotifications()
      }
    )
  },
  methods: {
    handleNotification(notifData) {
      // Badge.clear()
      if (notifData.goTo === 'sessionDetail') {
        this.$store.commit('sessions/setClickedSessionId', notifData.sessionId)
      } else if (notifData.goTo === 'spotDetail') {
        this.spotId = notifData.spotId
        this.spotDetailDialog = true
      } else if (notifData.goTo === 'user') {
        this.$store.commit('user/setClickedUserId', notifData.userId)
      } else if (notifData.goTo === 'conversation') {
        this.$router.push({
          name: 'conversations',
          query: { goToConversationId: notifData.conversationId },
        })
      }
    },
  },
})
</script>
<style lang="scss" scoped></style>
