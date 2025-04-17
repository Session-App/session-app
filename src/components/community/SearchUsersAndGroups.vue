<template>
  <div class="search-users-wrapper">
    <div class="search">
      <SearchBar :placeholder="
          searchType === 'groups'
            ? $t('community.search_groups')
            : $t('community.search_users')
        " @search="search" class="search-bar" />
      <q-btn color="primary" :label="
          searchType === 'groups'
            ? $t('community.users')
            : $t('community.groups')
        " no-caps dense @click="switchSearch" />
    </div>
    <UsersList :users="foundUsers" :isLoading="isDataLoading" :noDataMessage="$t('community.no_user_found')" @user-clicked="userClicked" v-if="
        searchType === 'users' && (isDataLoading || foundUsers.length !== 0)
      " class="users" />
    <GroupsList v-if="
        searchType === 'groups' && (isDataLoading || foundGroups.length !== 0)
      " :groups="foundGroups" :loading="isDataLoading" @group-clicked="displayGroupDetail" />
    <GroupDetail :groupId="group.id" @closed="displayGroupDetail({ id: null })" />
  </div>
</template>
<script>
import { defineComponent } from "vue";
import UsersList from "components/community/UsersList";
import GroupsList from "components/community/GroupsList";
import GroupDetail from "components/community/conversations/GroupDetail";
import SearchBar from "components/others/SearchBar";

export default defineComponent({
  name: "SearchUsersAndGroups",
  components: {
    UsersList,
    GroupsList,
    GroupDetail,
    SearchBar,
  },
  data() {
    return {
      isDataLoading: false,
      foundUsers: [],
      foundGroups: [],
      searchType: "groups",
      searchQuery: "",
      group: {},
    };
  },
  props: {},
  methods: {
    displayGroupDetail(group) {
      this.group = group;
    },
    userClicked(userId) {
      this.$store.commit("user/setClickedUserId", userId);
    },
    search(query) {
      this.searchQuery = query;
      if (query === "") {
        return;
      }
      this.isDataLoading = true;
      if (this.searchType === "users") {
        this.foundGroups = [];
        this.$store
          .dispatch("user/searchUsers", { username: query, hideMe: false })
          .then((data) => {
            this.foundUsers = data;
            this.isDataLoading = false;
          });
      } else {
        this.foundUsers = [];
        this.$store
          .dispatch("conversations/findConversations", {
            name: query,
            onlyIfMember: false,
          })
          .then((data) => {
            this.foundGroups = data.conversations;
            this.isDataLoading = false;
          });
      }
    },
    switchSearch() {
      this.searchType === "groups"
        ? (this.searchType = "users")
        : (this.searchType = "groups");
      this.search(this.searchQuery);
    },
  },
});
</script>
<style lang="scss" scoped>
.search-users-wrapper {
  padding: 10px;
  padding-bottom: 0px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .search {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .search-bar {
      width: 80%;
    }
  }
  .users {
    overflow-y: scroll;
  }
}
</style>
