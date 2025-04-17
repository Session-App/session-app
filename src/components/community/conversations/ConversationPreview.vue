<template>
  <div class="conversation-preview">
    <div class="left">
      <img :src="
          conversation.head.picture
            ? cloudfrontUrlPP + conversation.head.picture
            : (conversation.sport ? 'svg/all-sports/' + conversation.sport + '.svg' : 'svg/community-outline.svg')
        " class="pp-small picture" :class="{ group: !conversation.head.picture }" />
      <div class="text">
        <div class="name">{{ conversation.head.name }}</div>
        <div class="last-message" :class="{ 'message-not-seen': conversation.notSeen }" v-if="displayLastMessage && conversation.lastMessage">
          <div class="sender" v-if="conversation.name !== null">{{ getSender(conversation.lastMessage) }}:</div>
          <div class="content">{{ conversation.lastMessage.content }}</div>
        </div>
        <div class="location" v-if="displayLocation && conversation.locationName">({{conversation.locationName}})</div>
      </div>
    </div>
    <div class="not-seen" v-if="conversation.notSeen"></div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ConversationPreview',
  data() {
    return {
      cloudfrontUrlPP:
        'https://d1tqac1zek46ma.cloudfront.net/profile_pictures/',
    }
  },
  props: {
    conversation: {},
    displayLastMessage: { type: Boolean, default: true },
    displayLocation: { type: Boolean, default: false },
  },
  methods: {
    getSender(message) {
      return localStorage.getItem('userId') == message.sentBy.id
        ? this.$t('others.you')
        : message.sentBy.username
    },
  },
})
</script>
<style lang="scss" scoped>
.conversation-preview {
  box-shadow: 0 0px 3px #080808;
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  .left {
    width: 90%;
    display: flex;
    align-items: center;
    .picture {
      &.group {
        padding: 2px;
      }
    }
    .text {
      margin-left: 10px;
      width: calc(100% - #{$pp-medium-width});
      .name {
        font-size: 1.25em;
      }
      .last-message {
        display: flex;
        width: 100%;
        .sender {
          margin-right: 4px;
        }
        .content {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        &.message-not-seen {
          font-weight: bold;
        }
      }
    }
  }
  .not-seen {
    width: 13px;
    height: 13px;
    border-radius: 15px;
    background-color: $primary;
    margin-right: 5px;
  }
}
</style>
