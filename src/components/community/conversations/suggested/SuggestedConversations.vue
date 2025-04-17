<template>
  <div class="suggested-conversations">
    <div class="explanation">{{$t('community.suggested_groups')}}</div>
    <div class="conversations">
      <ConversationPreview v-for="conv in formattedConversations" :key="conv.id" :conversation="conv" :displayLastMessage="false" :displayLocation="true" @click="displayGroupDetail(conv)" />
    </div>
    <GroupDetail :groupId="clickedConversation.id" @closed="displayGroupDetail({ id: null })" @conversation-joined="conversationJoined" />
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import ConversationPreview from 'components/community/conversations/ConversationPreview'
import GroupDetail from 'components/community/conversations/GroupDetail'
import { getConversationHead } from 'src/boot/helpers'

export default defineComponent({
  name: 'SuggestedConversations',
  components: { ConversationPreview, GroupDetail },
  data() {
    return {
      formattedConversations: [],
      clickedConversation: {},
    }
  },
  props: { conversations: { type: Array } },
  created() {
    this.conversations.forEach((conv) => {
      this.formattedConversations.push(getConversationHead(conv.conversation))
    })
  },
  methods: {
    displayGroupDetail(conv) {
      this.clickedConversation = conv
    },
    conversationJoined() {
      this.$emit('conversation-joined', { ...this.clickedConversation })
      this.clickedConversation.id = null
    },
  },
})
</script>
<style lang="scss" scoped>
.suggested-conversations {
  display: flex;
  flex-direction: column;
  align-items: center;
  .explanation {
    background-color: white;
    width: 85vw;
    border-radius: 10px;
    text-align: center;
    margin-bottom: 20px;
  }
  .conversations {
    width: 95vw;
  }
}
</style>
