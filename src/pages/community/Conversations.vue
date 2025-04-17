<template>
  <div class="conversations-wrapper">
    <div class="no-conversations" v-if="!isLoading && conversations.length === 0 && !displayCurrentConversation">{{ $t("community.no_conversations_yet") }}</div>
    <div class="conversations" v-if="!displayCurrentConversation && conversations.length !== 0">
      <div class="conversation" v-for="conversation in conversations" :key="conversation.id" @click="displayConversation(conversation.id)">
        <ConversationPreview :conversation="conversation" />
      </div>
    </div>
    <SuggestedConversations :conversations="suggestedConversations" v-if="!displayCurrentConversation && suggestedConversations.length !== 0" @conversation-joined="conversationJoined" />
    <!-- <LoadMoreWrapper :displaySpinner="false"> -->
    <!-- <template v-slot:content> -->
    <NewConversationButton @clicked="creatingConversation = true" v-if="!displayCurrentConversation" />
    <Conversation v-if="displayCurrentConversation && currentConversation" :conversationId="currentConversation.id" :conv="currentConversation" :lastMessage="currentConversation.lastMessage" @back-clicked="displayCurrentConversation = false" @message-sent="messageSent" @conversation-edited="conversationEdited" @group-quit="groupQuit" />
    <q-dialog v-model="creatingConversation" class="above-all">
      <CreateConversationPopup @conversation-created="conversationCreated" />
    </q-dialog>
    <!-- </template> -->
    <!-- </LoadMoreWrapper> -->
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import {
  getConversationHead,
  eventSourceHelper,
  createConversation,
} from 'boot/helpers'
import Conversation from 'components/community/conversations/Conversation'
import CreateConversationPopup from 'components/community/conversations/CreateConversationPopup'
import NewConversationButton from 'components/community/conversations/NewConversationButton'
import ConversationPreview from 'components/community/conversations/ConversationPreview'
// import LoadMoreWrapper from 'components/others/LoadMoreWrapper.vue'
import SuggestedConversations from 'components/community/conversations/suggested/SuggestedConversations'
import { App } from '@capacitor/app'

export default defineComponent({
  name: 'Conversations',
  components: {
    Conversation,
    CreateConversationPopup,
    NewConversationButton,
    ConversationPreview,
    SuggestedConversations,
    // LoadMoreWrapper,
  },
  data() {
    return {
      conversations: [],
      suggestedConversations: [],
      displayCurrentConversation: false,
      currentConversation: {},
      creatingConversation: false,
      newMessage: {},
      eventSource: null,
      isLoading: true,
    }
  },
  methods: {
    groupQuit(conversationId) {
      this.displayCurrentConversation = false
      this.currentConversation = {}
      let conversation = this.conversations.find(
        (conv) => conv.id === conversationId
      )
      this.conversations.splice(this.conversations.indexOf(conversation), 1)
      this.$q.notify({
        message: this.$t('notification.group_quit'),
        color: 'green-3',
        timeout: 1000,
      })
    },
    conversationJoined(conv) {
      this.conversations.unshift(conv)
      this.initConversation(conv)
    },
    conversationEdited(editedConversation) {
      let conversation = this.conversations.find(
        (conv) => conv.id === editedConversation.id
      )
      let convIndex = this.conversations.indexOf(conversation)
      conversation.head.name = editedConversation.name
      conversation.name = editedConversation.name
      conversation.sport = editedConversation.sport
      conversation.locationName = editedConversation.locationName
      this.conversations[convIndex] = conversation
    },
    conversationCreated(data) {
      if (!data.conversationAlreadyExisted) {
        if (!localStorage.getItem('conversations')) {
          localStorage.setItem('conversations', '[]')
        }
        getConversationHead(data.conversation)
        this.conversations.unshift(data.conversation)
        let localConversations = JSON.parse(
          localStorage.getItem('conversations')
        )
        localConversations.push({
          id: data.conversation.id,
          lastMessageId: 0,
          notSeen: false,
        })
        localStorage.setItem(
          'conversations',
          JSON.stringify(localConversations)
        )
      }
      this.$router.replace({
        query: {},
      })
      this.displayConversation(data.conversation.id)
    },
    displayConversation(conversationId) {
      this.displayCurrentConversation = false
      this.currentConversation = {}
      this.currentConversation.id = conversationId
      this.creatingConversation = false
      let conversation = this.conversations.find(
        (conv) => conv.id === conversationId
      )
      if (conversation) {
        this.currentConversation = { ...conversation }
        conversation.notSeen = false
      }
      let localConversations = JSON.parse(localStorage.getItem('conversations'))
      this.currentConversation.lastMessageNotSeenId = localConversations.find(
        (conv) => conv.id === conversationId
      ).lastMessageId
      localConversations.find(
        (conv) => conv.id === conversationId
      ).notSeen = false
      try {
        localConversations.find(
          (conv) => conv.id === conversationId
        ).lastMessageId = conversation.lastMessage.id
      } catch {}
      localStorage.setItem('conversations', JSON.stringify(localConversations))
      this.$nextTick(() => {
        this.displayCurrentConversation = true
      })
    },
    updateLastMessage(
      conversationId,
      message,
      updateCurrentConv,
      bringConversationToTop,
      setLocalNotSeen
    ) {
      if (updateCurrentConv && this.currentConversation.id === conversationId) {
        this.currentConversation.lastMessage = message
        this.currentConversation.lastMessageNotSeenId = message.id
      }
      let conversation = this.conversations.find(
        (conv) => conv.id === conversationId
      )

      if (conversation) {
        let localConversations = JSON.parse(
          localStorage.getItem('conversations')
        )
        let localConversation = localConversations.find(
          (conv) => conv.id === conversationId
        )
        if (localConversation) {
          if (message && localConversation.lastMessageId < message.id) {
            if (setLocalNotSeen || localConversation.notSeen) {
              localConversation.notSeen = true
            } else {
              localConversation.lastMessageId = message.id
              localConversation.notSeen = false
            }
            localStorage.setItem(
              'conversations',
              JSON.stringify(localConversations)
            )
            if (
              !this.displayCurrentConversation ||
              this.currentConversation.id != conversation.id
            ) {
              conversation.notSeen = true
            }
          }
          if (bringConversationToTop) {
            conversation.lastMessage = message
            let convIndex = this.conversations.indexOf(conversation)
            if (convIndex !== this.conversations.length - 1) {
              const conversationCopy = conversation
              this.conversations.splice(convIndex, 1)
              this.conversations.unshift(conversationCopy)
            }
          } else {
            if (localConversation.notSeen) conversation.notSeen = true
          }
          return true
        } else {
          localConversations.push({
            id: conversationId,
            lastMessageId: message ? message.id : 0,
            notSeen: true,
          })
          localStorage.setItem(
            'conversations',
            JSON.stringify(localConversations)
          )
          return false
        }
      } else {
      }
    },
    messageSent(content, messageId) {
      let lastMessage = {
        content: content,
        id: messageId,
        sentBy: {
          id: localStorage.getItem('userId'),
          profilePicture: localStorage.getItem('userPP'),
          username: localStorage.getItem('username'),
        },
      }
      this.updateLastMessage(
        this.currentConversation.id,
        lastMessage,
        false,
        true,
        false
      )
    },
    initLocalConversations() {
      let conversations = []
      this.conversations.forEach((conv) => {
        conversations.push({
          id: conv.id,
          lastMessageId: conv.lastMessage ? conv.lastMessage.id : 0,
          notSeen: true,
        })
        conv.notSeen = true
      })
      localStorage.setItem('conversations', JSON.stringify(conversations))
    },
    initConversation(conv) {
      let localConversations = JSON.parse(localStorage.getItem('conversations'))
      let didConversationExist
      let localConversation = localConversations.find((c) => c.id === conv.id)
      let updateLocalNotSeen =
        conv.lastMessage && localConversation
          ? localConversation.lastMessageId != conv.lastMessage.id
          : false
      didConversationExist = this.updateLastMessage(
        conv.id,
        conv.lastMessage,
        false,
        false,
        updateLocalNotSeen
      )
      if (!didConversationExist) {
        this.conversations.find((c) => c.id === conv.id).notSeen = true
      }
    },
    getUnseenMessages() {
      this.$store.commit('setLoading', true)
      let lastMessageId = 0
      this.conversations.forEach((conv) => {
        if (conv.lastMessage && conv.lastMessage.id > lastMessageId) {
          lastMessageId = conv.lastMessage.id
        }
      })
      this.$store
        .dispatch('conversations/getUnseenMessages', {
          lastMessageId: lastMessageId,
        })
        .then((data) => {
          data.messages.forEach((message) => {
            this.updateLastMessage(
              message.conversation,
              message,
              true,
              true,
              !this.displayCurrentConversation ||
                this.currentConversation.id !== data.conversation
            )
          })
          this.$store.commit('setLoading', false)
        })
    },
  },
  created() {
    if (!localStorage.getItem('conversations')) {
      this.initLocalConversations()
    }
    this.$store.commit('setSection', 'community')

    this.$store.commit('setLoading', true)
    this.$store
      .dispatch('conversations/getConversations', { page: 1 })
      .then((data) => {
        this.suggestedConversations = data.suggestedConversations
        data.conversations.forEach((conversation) => {
          getConversationHead(conversation)
        })
        this.conversations = data.conversations
        if (!localStorage.getItem('blockedUsers')) {
          localStorage.setItem('blockedUsers', '[]')
        }
        const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers'))
        let conversationsToHide = []
        data.conversations.forEach((conv) => {
          if (
            !conv.name &&
            (blockedUsers.indexOf(conv.recipient.id) >= 0 ||
              blockedUsers.indexOf(conv.administrator.id) >= 0)
          ) {
            conversationsToHide.push(conv)
          } else {
            this.initConversation(conv)
          }
        })
        conversationsToHide.forEach((conv) => {
          this.conversations.splice(this.conversations.indexOf(conv), 1)
        })
        this.$store.commit('setLoading', false)
        this.isLoading = false

        if (this.$route.query.goToUserId) {
          createConversation(this.$route.query.goToUserId).then((data) => {
            this.conversationCreated(data)
          })
        } else if (this.$route.query.goToConversationId) {
          this.displayConversation(
            parseInt(this.$route.query.goToConversationId)
          )
          this.$router.replace({
            query: {},
          })
        }

        //mercure
        this.eventSource = eventSourceHelper(
          'conversations/' + localStorage.getItem('userId'),
          data.mercureToken
        )
        this.eventSource.onmessage = (event) => {
          data = JSON.parse(event.data)
          this.updateLastMessage(
            data.conversation,
            data.message,
            true,
            true,
            !this.displayCurrentConversation ||
              this.currentConversation.id !== data.conversation
          )
        }
        App.addListener('appStateChange', (state) => {
          if (state.isActive) {
            this.getUnseenMessages()
          }
        })
      })
  },
  mounted() {},
  watch: {
    '$route.query.goToUserId'(newVal) {
      if (newVal) {
        createConversation(newVal).then((data) => {
          this.conversationCreated(data)
        })
      }
    },
    '$route.query.goToConversationId'(newVal) {
      if (newVal) {
        //temporary
        this.$router.go(0)
        this.$router.replace({
          query: {},
        })
      }
    },
  },
  beforeUnmount() {
    this.eventSource.close()
  },
})
</script>
<style lang="scss" scoped>
.conversations-wrapper {
  height: var(--page-height);
  overflow-y: scroll;
  background: $background-gradient;
  overflow-y: scroll;
  .conversations {
    padding: 10px;
  }
  .no-conversations {
    text-align: center;
    margin: 50px 0px;
    font-size: 1.2em;
    color: white;
  }
  .new-conversation-button {
    position: fixed;
    bottom: calc(var(--footer-height) + env(safe-area-inset-bottom) + 15px);
    right: 7px;
  }
}
.coming-soon {
  text-align: center;
  margin-top: 30vh;
  font-size: 1.5em;
}
</style>
