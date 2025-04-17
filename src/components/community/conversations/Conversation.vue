<template>
  <div class="conversation-wrapper" id="conversation-component">
    <div class="header" @click="showConversationDetail">
      <div class="left">
        <img src="svg/black-back-arrow.svg" class="back-arrow" @click="$emit('back-clicked')" />
        <img :src="
            conversation.head.picture
              ? cloudfrontUrlPP + conversation.head.picture
              : 'svg/community-outline.svg'
          " class="pp-tiny picture" :class="{ group: !conversation.head.picture }" v-if="!conversationLoading" />
        <div class="name" v-if="!conversationLoading">{{ conversation.head.name }}</div>
        <q-skeleton v-else class="name-skeleton" />
      </div>
      <div class="right">
        <q-btn :label="$t('community.upcoming_sessions')" color="primary" dense no-caps @click.stop="getUpcomingSessions" />
      </div>
    </div>
    <q-separator color="primary" />
    <div class="main-part">
      <div class="messages" ref="messages" v-if="!messagesLoading" @scroll="handleScroll">
        <div class="load-more" v-if="!reachedEndOfMessages">
          <q-spinner color="primary" size="3em" />
        </div>
        <Message v-for="(message,i) in messages" :key="message.id" :message="message" :nextMessage="messages[i+1] ??null" :firstNotSeen="conversation.lastMessageNotSeenId == message.id - 1" :userId="userId" :oneToOne="conversation.name === null" />
        <Message :message="{ content: messageBeingSent, sentBy: { id: userId } }" v-if="messageBeingSent" :oneToOne="conversation.name === null" :userId="userId" :beingSent="true" />
      </div>
      <div v-else class="spinner">
        <q-spinner color="primary" size="3em" />
      </div>
      <div class="message-input">
        <q-input outlined bottom-slots v-model="newMessage" :placeholder="$t('community.message')" dense autogrow class="input" ref="messageInput">
          <template v-slot:after>
            <q-btn round dense flat icon="send" @click="sendMessage" />
          </template>
        </q-input>
      </div>
    </div>

    <q-dialog v-model="conversationDetail">
      <ConversationDetail :conversation="conversation" @close="conversationDetail = false" @conversation-edited="conversationEdited" @group-quit="groupQuit" />
    </q-dialog>
    <q-dialog class="bottom-sheet" id="upcoming-sessions-conversation" v-model="upcomingSessionsDialog" position="bottom">
      <div class="wrapper">
        <div class="title">{{ $t("spots.upcoming_sessions") }}</div>
        <DateTimes :sessions="upcomingSessions" />
      </div>
    </q-dialog>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import ConversationDetail from 'components/community/conversations/ConversationDetail'
import Message from 'components/community/conversations/Message'
import DateTimes from 'components/sessions/DateTimes'
import { getConversationHead } from 'boot/helpers'
import { Keyboard } from '@capacitor/keyboard'

export default defineComponent({
  name: 'Conversation',
  components: { ConversationDetail, Message, DateTimes },
  data() {
    return {
      cloudfrontUrlPP:
        'https://d1tqac1zek46ma.cloudfront.net/profile_pictures/',
      userId: null,
      conversation: null,
      page: 1,
      size: 20,
      reachedEndOfMessages: false,
      fetchingMoreMessages: false,
      messages: [],
      newMessage: '',
      messageBeingSent: '',
      conversationLoading: true,
      messagesLoading: true,
      conversationDetail: false,
      upcomingSessions: null,
      upcomingSessionsDialog: false,
    }
  },
  props: { conv: {}, conversationId: {}, lastMessage: {} },
  created() {
    this.userId = localStorage.getItem('userId')
    if (!this.conv.administrator) {
      this.$store
        .dispatch('conversations/getConversation', {
          conversationId: this.conversationId,
          brief: true,
        })
        .then((data) => {
          getConversationHead(data.conversation)
          this.conversation = data.conversation
          this.conversation.lastMessageNotSeenId =
            this.conv.lastMessageNotSeenId
          this.conversationLoading = false
        })
    } else {
      this.conversation = this.conv
      this.conversationLoading = false
    }
    this.getMessages()
    Keyboard.addListener('keyboardDidHide', () => {
      this.scrollToBottom()
    })
  },
  methods: {
    groupQuit() {
      this.conversationDetail = false
      this.$emit('group-quit', this.conversationId)
    },
    conversationEdited(conversation) {
      this.conversation.name = conversation.name
      this.conversation.private = conversation.private
      this.conversation.sport = conversation.sport
      this.conversation.locationName = conversation.locationName
      this.$emit('conversation-edited', conversation)
    },
    getUpcomingSessions() {
      this.upcomingSessionsDialog = true
      this.$store
        .dispatch('conversations/upcomingSessions', this.conversationId)
        .then((data) => {
          this.upcomingSessions = data.sessions
        })
    },
    handleScroll(e) {
      const { scrollTop, offsetHeight, scrollHeight } = e.target
      if (scrollTop === 0 && !this.fetchingMoreMessages) {
        this.fetchingMoreMessages = true
        this.getMessages(scrollHeight)
      }
      // Keyboard.hide();
    },
    getMessages(scrollHeight = 0) {
      this.$store
        .dispatch('conversations/getMessages', {
          conversationId: this.conversationId,
          size: this.size,
          page: this.page,
        })
        .then((data) => {
          if (this.page === 1) {
            this.messages = data.messages.slice().reverse()
            this.messagesLoading = false
            this.scrollToBottom()
            if (this.messages.length < this.size) {
              this.reachedEndOfMessages = true
            }
          } else {
            if (data.messages.length === 0) {
              this.reachedEndOfMessages = true
            } else {
              this.$refs.messages.scrollTop = 20
              // this.messages = this.messages.concat(data.messages);
              this.messages = data.messages.concat(this.messages)
              this.$nextTick(() => {
                this.$refs.messages.scrollTop =
                  this.$refs.messages.scrollHeight - scrollHeight
              })
            }
            this.fetchingMoreMessages = false
          }
          this.page++
        })
    },
    showConversationDetail() {
      this.conversationDetail = true
    },
    scrollToBottom() {
      this.$nextTick(() => {
        try {
          this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
        } catch {}
      })
    },
    sendMessage() {
      if (this.newMessage === '') return
      this.$refs.messageInput.focus()
      this.messageBeingSent = this.newMessage
      this.newMessage = ''
      this.$nextTick(() => {
        this.scrollToBottom()
      })
      this.$store
        .dispatch('conversations/sendMessage', {
          conversation: { id: this.conversationId },
          content: this.messageBeingSent,
        })
        .then((data) => {
          if (data.message) {
            this.messages.push({
              content: this.messageBeingSent,
              sentBy: { id: parseInt(localStorage.getItem('userId')) },
              sentAt: new Date().toISOString(),
            })
            this.$emit('message-sent', this.messageBeingSent, data.message.id)
            this.messageBeingSent = ''
          }
        })
    },
  },
  watch: {
    lastMessage(newVal) {
      this.messages.unshift(newVal)
      this.scrollToBottom()
    },
  },
})
</script>
<style lang="scss" scoped>
.conversation-wrapper {
  height: var(--page-height);
  overflow: hidden;
  background-color: white;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      background-color: $light-white;
      height: 41px;
      padding: 10px;
      display: flex;
      align-items: center;
      .back-arrow {
        width: 20px;
        margin-right: 5px;
      }
      .name-skeleton {
        width: 80px;
      }
      .picture {
        margin-right: 5px;
        &.group {
          padding: 1px;
        }
      }
    }
    .right {
      margin-right: 10px;
    }
  }
  .spinner {
    display: flex;
    justify-content: center;
    margin-top: 30vh;
  }
  .main-part {
    display: flex;
    flex-direction: column;
    height: calc(var(--page-height) - 30px);
    justify-content: space-between;
    .messages {
      padding: 10px;
      overflow-y: scroll;
      height: 100%;
      .load-more {
        display: flex;
        justify-content: center;
      }
    }
    .message-input {
      margin-top: 7px;
      margin-left: 10px;
    }
  }
}
</style>
<style lang="scss">
#conversation-component {
  .q-field__control {
    border-radius: 10px;
  }
}
#upcoming-sessions-conversation {
  .title {
    box-shadow: none;
    display: flex;
    justify-content: center;
    margin: 5px;
    font-size: 1.2em;
  }
}
</style>
