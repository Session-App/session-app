<template>
  <div class="message-wrapper" :class="{ grouped: !sentAtFormatted }">
    <div class="last-seen-separator" v-if="firstNotSeen">
      <div class="line"></div>
      <div class="text">{{ $t('community.not_seen_messages') }}</div>
      <div class="line"></div>
    </div>
    <div class="shared-items">
      <SharedSession
        v-if="message.session"
        :sessionId="message.session.id"
        class="shared-item"
      />
    </div>
    <div
      :class="{
        message: true,
        'sent-by-me': message.sentBy.id == userId,
        'being-sent': beingSent,
      }"
    >
      <img
        :src="cloudfrontUrlPP + message.sentBy.profilePicture"
        class="profile-picture"
        @click="goToUser(message.sentBy.id)"
        v-if="message.sentBy.id != userId && !oneToOne"
      />
      <div class="content">
        <div
          @click="goToUser(message.sentBy.id)"
          class="from"
          v-if="message.sentBy.id != userId && !oneToOne"
        >
          {{ message.sentBy.username }}
        </div>
        <div class="text">
          {{ message.content }}
          <div class="sent-at" v-if="sentAtFormatted">
            {{ sentAtFormatted }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import SharedSession from 'components/community/conversations/sharedItems/SharedSession'
import { isToday, isYesterday } from 'date-fns'

export default defineComponent({
  name: 'Message',
  components: { SharedSession },
  data() {
    return {
      cloudfrontUrlPP:
        'https://d1tqac1zek46ma.cloudfront.net/profile_pictures/',
      sentAtFormatted: '',
    }
  },
  props: {
    message: {},
    nextMessage: { type: Object },
    userId: {},
    oneToOne: {},
    beingSent: { default: false },
    firstNotSeen: { type: Boolean },
  },
  created() {
    const date = new Date(this.message.sentAt)
    const today = new Date()
    if (
      !this.message.sentAt ||
      (this.nextMessage &&
        new Date(this.nextMessage.sentAt) - date < 600000 &&
        this.nextMessage.sentBy.id === this.message.sentBy.id)
    ) {
      this.sentAtFormatted = null
    } else if (isToday(date)) {
      this.sentAtFormatted =
        date.getHours().toString() +
        'h' +
        (date.getMinutes() < 10 ? '0' : '') +
        date.getMinutes().toString()
    } else if (isYesterday(date)) {
      this.sentAtFormatted =
        this.$t('date.yesterday') +
        ', ' +
        date.getHours().toString() +
        'h' +
        (date.getMinutes() < 10 ? '0' : '') +
        date.getMinutes().toString()
    } else {
      this.sentAtFormatted =
        date.getDate().toString() + '/' + (date.getMonth() + 1).toString()
    }
  },
  methods: {
    goToUser(userId) {
      this.$store.commit('user/setClickedUserId', userId)
    },
  },
})
</script>
<style lang="scss" scoped>
.message-wrapper {
  margin-top: 7px;
  &.grouped {
    margin-bottom: -10px;
  }
  .last-seen-separator {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    .text {
      margin: 0px 5px;
      color: $primary;
      white-space: nowrap;
    }
    .line {
      background-color: $primary;
      height: 1px;
      width: 100%;
    }
  }
  .shared-items {
    margin-bottom: 5px;
    display: flex;
    justify-content: center;
  }
  .message {
    display: flex;

    &.sent-by-me {
      justify-content: flex-end;
      &:not(.being-sent) {
        .content {
          .text {
            background-color: $secondary;
            color: white;
          }
        }
      }
      &.being-sent {
        .text {
          color: #3e3f3e;
        }
      }
    }
    .profile-picture {
      border-radius: 50px;
      width: 30px;
      height: 30px;
      margin-right: 5px;
    }
    .content {
      max-width: 80vw;
      .from {
        font-size: 0.85em;
      }
      .text {
        padding: 7px;
        border-radius: 14px;
        background-color: $light-grey;
        word-wrap: break-word;
        display: flex;
        align-items: flex-end;
        .sent-at {
          font-size: 0.8em;
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
