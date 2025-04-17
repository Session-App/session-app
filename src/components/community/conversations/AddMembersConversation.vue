<template>
  <div class="add-member-conversation popup">
    <SearchBar class="search-bar" :placeholder="$t('community.search_users')" @search="searchUsers" />
    <HorizontalUsersList class="horizontal-users-list" :noDataPlaceholder="$t('community.no_user_selected')" :users="selectedUsers" v-if="multiselect" @remove="removeUser" />
    <div v-if="displayingFriends" class="friends-hint">{{ $t("community.friends") }}:</div>
    <UsersList :users="users" :isLoading="isLoading" :multiple-selection="multiselect" :noDataMessage="$t('community.no_user_found')" class="users-list" ref="usersList" @selected-users-changed="selectedUsersChanged" @user-clicked="userClicked" />
    <div class="validate">
      <q-btn class="button" :label="$t('others.ok')" :no-caps="true" color="primary" :loading="addingUsers" @click="validate" v-if="displayOkButton" />
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import UsersList from 'components/community/UsersList'
import SearchBar from 'components/others/SearchBar'
import HorizontalUsersList from 'components/community/HorizontalUsersList'
import { notify } from 'boot/helpers'

export default defineComponent({
  name: 'AddMembersConversation',
  props: {
    conversationId: { default: null },
    members: { default: [] },
    multiselect: { default: true },
    displayOkButton: { default: true },
  },
  components: { UsersList, SearchBar, HorizontalUsersList },
  data() {
    return {
      friendsNotInGroup: [],
      users: [],
      selectedUsers: [],
      addingUsers: false,
      isLoading: true,
      displayingFriends: true,
      bottomMargin: '190px',
    }
  },
  created() {
    this.$store.dispatch('user/getFriendships', true).then((data) => {
      if (this.conversationId) {
        data.forEach((user) => {
          if (!this.members.find((member) => member.id === user.id)) {
            this.friendsNotInGroup.push(user)
          }
        })
        this.users = [...this.friendsNotInGroup]
      } else {
        this.users = data
        this.friendsNotInGroup = data
      }
      this.isLoading = false
    })
  },
  methods: {
    userClicked(userId) {
      this.$emit('user-clicked', userId)
    },
    removeUser(userId) {
      this.$refs.usersList.removeUser(userId)
    },
    selectedUsersChanged(users) {
      this.selectedUsers = users
    },
    searchUsers(username) {
      if (username === '') {
        this.users = [...this.friendsNotInGroup]
        this.displayingFriends = true
        this.bottomMargin = '190px'
        return
      }
      this.bottomMargin = '164px'
      this.isLoading = true
      this.displayingFriends = false
      this.searchClicked = true
      this.$store
        .dispatch('user/searchUsers', { username: username, hideMe: true })
        .then((data) => {
          this.users = data
          this.isLoading = false
        })
    },
    validate() {
      if (
        !this.$refs.usersList ||
        this.$refs.usersList.selectedUsers.length === 0
      ) {
        this.$emit('users-added')
        return
      }
      const newMembers = this.getSelectedUserIds
      this.addingUsers = true
      this.$store
        .dispatch('conversations/addUsers', {
          conversationId: this.conversationId,
          users: newMembers,
        })
        .then(() => {
          this.addingUsers = false
          this.$q.notify({
            message: this.$t('community.new_members_added'),
            color: 'green-3',
            timeout: 1000,
          })
          this.$emit('users-added')
        })
        .catch((error) => {
          this.addingUsers = false
          notify(error.data.errors)
        })
    },
  },
  computed: {
    getSelectedUserIds() {
      return this.$refs.usersList.selectedUsers
    },
  },
})
</script>
<style lang="scss" scoped>
.add-member-conversation {
  width: 80vw;
  height: 75vh;
  overflow-y: hidden;
  .search-bar {
    margin-bottom: 10px;
  }
  .horizontal-users-list {
    margin-bottom: 7px;
  }
  .friends-hint {
    margin-bottom: 5px;
    margin-left: 2px;
  }
  .users-list {
    height: calc(100% - v-bind('bottomMargin'));
    overflow-y: scroll;
  }
  .validate {
    display: flex;
    justify-content: center;
    margin-top: 5px;
  }
}
</style>
