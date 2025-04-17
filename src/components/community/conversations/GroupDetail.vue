<template>
  <q-dialog class="bottom-sheet" v-model="showDialog" position="bottom">
    <div class="group-detail">
      <img src="svg/community-outline.svg" class="pp-medium" />
      <div class="name" v-if="!isLoading">{{ group.conversation?.name }}</div>
      <q-skeleton v-else class="name" />
      <q-btn no-caps :label="
          group.membership === 'requested'
            ? $t('community.request_pending')
            : $t('community.join_group')
        " color="primary" class="button" v-if="group.membership !== 'member'" :loading="buttonLoading" @click="joinGroup" />
      <q-btn v-else no-caps :label="$t('community.see_conversation')" color="primary" class="button" @click="goToConversation" :loading="isLoading || buttonLoading" />
    </div>
  </q-dialog>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GroupDetail',
  components: {},
  data() {
    return {
      showDialog: false,
      group: {},
      isLoading: true,
      buttonLoading: false,
    }
  },
  props: {
    groupId: {},
  },
  created() {},
  methods: {
    joinGroup() {
      if (this.group.membership === 'requested') return
      this.buttonLoading = true
      this.$store.dispatch('conversations/joinGroup', this.groupId).then(() => {
        this.buttonLoading = false
        this.group.conversation.private
          ? (this.group.membership = 'requested')
          : (this.group.membership = 'member')
      })
      this.$emit('conversation-joined')
    },
    getGroupDetail() {
      if (!this.groupId) {
        this.showDialog = false
        return
      }
      this.showDialog = true
      this.$store
        .dispatch('conversations/groupDetail', this.groupId)
        .then((data) => {
          this.isLoading = false
          this.group = data
        })
    },
    goToConversation() {
      this.$router.push({
        name: 'conversations',
        query: { goToConversationId: this.groupId },
      })
    },
  },
  watch: {
    showDialog(newVal) {
      if (!newVal) {
        this.$emit('closed')
        this.group = {}
        this.isLoading = true
      }
    },
    groupId(newVal) {
      this.getGroupDetail()
    },
  },
})
</script>
<style lang="scss" scoped>
.group-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: none;
  .name {
    font-size: 1.5em;
    margin: 10px 0px;
    min-width: 50vw;
    text-align: center;
  }
  img {
    padding: 3px;
    margin-top: 10px;
  }
  .button {
    margin-bottom: 15px;
  }
}
</style>
