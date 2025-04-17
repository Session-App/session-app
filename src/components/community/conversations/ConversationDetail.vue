<template>
  <div class="conversation-detail-popup popup" :class="{ group: conversation.name }">
    <div class="oneToOne" v-if="conversation.name === null">
      <div class="user" @click="goToUser(conversation.head.userId)">
        <img class="pp-medium" :src="cloudFrontUrlPP + interlocutor.profilePicture" />
        <div class="username">{{ interlocutor.username }}</div>
      </div>
    </div>
    <div class="group" v-else>
      <div class="name">{{ conversation.name }}</div>
      <div class="three-dots" v-if="!isAdmin">
        <img class="three-dots-button" src="svg/three-dots.svg" />
        <q-menu>
          <q-list class="three-dots-options">
            <q-item clickable v-close-popup @click="$store.commit('user/setReportedEntity', {entityId: conversation.id, entityName: 'Conversation'})">
              <img class="option" src="svg/report.svg" />
              <q-item-section>
                {{
                $t("community.report_group")
                }}
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="quitGroup">
              <!-- <img class="option" src="svg/report.svg" /> -->
              <q-item-section>{{$t('community.quit_group')}}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
      <div class="users">
        <div class="buttons">
          <q-btn :label="$t('community.add_group_members')" no-caps color="primary" dense class="button" @click="addMembersPopup = true" v-if="isAdmin" />
          <q-btn :label="$t('community.edit')" no-caps color="primary" dense class="button" @click="editConversationPopup = true" v-if="isAdmin" />
          <q-btn :label="
              areNotificationsEnabled
                ? $t('community.disable_notifications')
                : $t('community.enable_notifications')
            " :loading="editingNotifications" no-caps color="primary" dense class="button" @click="editConversationNotifications" />
        </div>
        <div class="users-lists" @scroll="loadMoreMembers">
          <div class="amount" v-if="isAdmin">
            {{ awaitingMembers.length }}
            {{ $t('community.awaiting_members') }} :
          </div>
          <UsersList :users="awaitingMembers" :acceptReject="true" @user-clicked="goToUser" class="members" @accept="acceptUser" @reject="removeUser" />
          <div class="amount" v-if="members.length !== 0">{{ membersAmount }} {{ $t('community.members') }} :</div>
          <UsersList :users="members" :isLoading="members.length === 0" :threeDots="isAdmin" @user-clicked="goToUser" @three-dots-clicked="threeDotsClicked" class="members" />
          <div class="spinner" v-if="!loadedAllMembers">
            <q-spinner color="primary" size="3em" />
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="addMembersPopup">
      <AddMembersConversation :conversationId="conversation.id" :members="members" @users-added="newUsersAdded" class="bottom-safe-area" />
    </q-dialog>
    <q-dialog v-model="editConversationPopup">
      <EditConversation :conversation="conversation" @close="editConversationPopup = false" @validate="editConversation" :loading="editingConversation" />
    </q-dialog>
    <q-dialog v-model="editUserPopup">
      <EditUser :conversationId="conversation.id" :user="editedUser" @remove-user="removeUser" @close="editUserPopup = false" />
    </q-dialog>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import UsersList from 'components/community/UsersList'
import AddMembersConversation from 'components/community/conversations/AddMembersConversation'
import EditConversation from 'components/community/conversations/EditConversation'
import EditUser from 'components/community/conversations/EditUser'
import { notify } from 'boot/helpers'

export default defineComponent({
  name: 'ConversationDetail',
  props: ['conversation'],
  components: {
    UsersList,
    AddMembersConversation,
    EditConversation,
    EditUser,
  },
  data() {
    return {
      cloudFrontUrlPP:
        'https://d1tqac1zek46ma.cloudfront.net/profile_pictures/',
      members: [],
      membersAmount: 0,
      awaitingMembers: [],
      addMembersPopup: false,
      editConversationPopup: false,
      editingConversation: false,
      editUserPopup: false,
      editedUser: {},
      areNotificationsEnabled: true,
      editingNotifications: false,
      page: 1,
      size: 10,
      loadingMembers: false,
      loadedAllMembers: false,
      quitttingGroup: false,
    }
  },
  methods: {
    quitGroup() {
      this.quitttingGroup = true
      this.$store
        .dispatch('conversations/quitGroup', {
          conversationId: this.conversation.id,
        })
        .then(() => {
          this.$emit('group-quit')
        })
        .finally(() => {
          this.quitttingGroup = false
        })
    },
    loadMoreMembers(e) {
      if (this.loadedAllMembers) return
      const { scrollTop, offsetHeight, scrollHeight } = e.target
      if (
        scrollHeight - scrollTop - offsetHeight < 15 &&
        !this.loadingMembers
      ) {
        this.loadingMembers = true
        this.page++
        this.$store
          .dispatch('conversations/getConversationMembers', {
            conversationId: this.conversation.id,
            page: this.page,
            size: this.size,
          })
          .then((data) => {
            this.members = this.members.concat(data.members)
            console.log(this.members.length, this.membersAmount)
            if (this.members.length === this.membersAmount) {
              this.loadedAllMembers = true
            }
            this.loadingMembers = false
          })
      }
    },
    editConversationNotifications() {
      this.editingNotifications = true
      let disabledConvNotifs = localStorage
        .getItem('disabledConversationNotifications')
        .split(',')
      this.areNotificationsEnabled
        ? disabledConvNotifs.push(this.conversation.id)
        : disabledConvNotifs.splice(
            disabledConvNotifs.indexOf(this.conversation.id)
          )
      this.$store
        .dispatch('conversations/editNotifications', {
          conversations: disabledConvNotifs,
        })
        .then(() => {
          localStorage.setItem(
            'disabledConversationNotifications',
            disabledConvNotifs
          )
          this.areNotificationsEnabled = !this.areNotificationsEnabled
          this.editingNotifications = false
        })
    },
    threeDotsClicked(user) {
      this.editedUser = user
      this.editUserPopup = true
    },
    editConversation(editedConversation) {
      if (editedConversation.name === '') {
        return
      }
      this.editingConversation = true
      let conversation = {}
      conversation.name = editedConversation.name
      conversation.private = editedConversation.private
      conversation.id = editedConversation.id
      conversation.sport = editedConversation.sport
      conversation.locationName = editedConversation.locationName
      conversation.lon = editedConversation.lon
      conversation.lat = editedConversation.lat
      this.$store
        .dispatch('conversations/editConversation', conversation)
        .then(() => {
          this.$q.notify({
            message: this.$t('notification.conversation_edited'),
            color: 'green-3',
          })
          this.editConversationPopup = false
          this.$emit('conversation-edited', conversation)
          this.editingConversation = false
        })
        .catch((error) => {
          notify(error.data.errors)
          this.editingConversation = false
        })
    },
    acceptUser(user) {
      this.$store
        .dispatch('conversations/addUsers', {
          conversationId: this.conversation.id,
          users: [user.id],
        })
        .then(() => {
          this.awaitingMembers.splice(this.awaitingMembers.indexOf(user), 1)
          this.members.unshift(user)
        })
    },
    removeUser(user) {
      this.$store
        .dispatch('conversations/removeUser', {
          conversationId: this.conversation.id,
          userId: user.id,
        })
        .then(() => {
          this.awaitingMembers.splice(this.awaitingMembers.indexOf(user), 1)
          this.members.splice(this.members.indexOf(user), 1)
          this.editUserPopup = false
        })
    },
    newUsersAdded() {
      this.addMembersPopup = false
      this.$emit('close')
    },
    goToUser(userId) {
      this.$store.commit('user/setClickedUserId', userId)
    },
  },
  computed: {
    isAdmin() {
      return (
        this.conversation.administrator.id == localStorage.getItem('userId')
      )
    },
    interlocutor() {
      return this.conversation.recipient.id == localStorage.getItem('userId')
        ? this.conversation.administrator
        : this.conversation.recipient
    },
  },
  created() {
    if (this.conversation.name) {
      this.$store
        .dispatch('conversations/getConversationMembers', {
          conversationId: this.conversation.id,
          page: this.page,
          size: this.size,
        })
        .then((data) => {
          this.members = data.members
          this.membersAmount = data.total + 1
          if (this.members.length + 1 === this.membersAmount)
            this.loadedAllMembers = true
          this.members.unshift(this.conversation.administrator)
          this.awaitingMembers = data.awaitingMembers
          this.areNotificationsEnabled =
            localStorage
              .getItem('disabledConversationNotifications')
              .split(',')
              .indexOf(this.conversation.id.toString()) < 0
        })
    }
  },
})
</script>
<style lang="scss" scoped>
.conversation-detail-popup {
  width: 80vw;
  overflow: hidden;
  display: flex;
  justify-content: center;
  margin-top: -40px;
  &.group {
    height: 75vh !important;
  }
  .oneToOne {
    .user {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
  .group {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    .name {
      font-size: 1.5em;
      margin-bottom: 15px;
    }
    .three-dots {
      position: fixed;
      right: 13vw;
      img {
        width: 20px;
      }
    }
    .buttons {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      width: 100% !important;
      .button {
        margin-top: 10px;
      }
    }
    .users {
      width: 100%;
      height: calc(100% - 53px);
      display: flex;
      flex-direction: column;
      .users-lists {
        margin-bottom: -5px;
        margin-top: 10px;
        flex: 1;
        width: 100%;
        overflow-y: scroll;
      }
      .spinner {
        text-align: center;
      }
    }
  }
}
</style>
