<template>
  <div class="users-list-wrapper">
    <div class="loading-friends" v-if="isLoading">
      <div class="user" v-for="i in [1, 2, 3, 4, 5, 6]" :key="i">
        <div class="user-detail">
          <div class="pp">
            <q-skeleton class="pp-small" />
          </div>
          <div class="username">
            <q-skeleton class="username-skeleton" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="users.length !== 0 && !isLoading">
      <div class="user" v-for="user in users" :key="user.id" @click="userClicked(user.id)">
        <div class="user-detail">
          <img :src="cloudfrontUrlPP + user.profilePicture" class="pp-small" />
          <div class="username">{{ user.username }}</div>
        </div>
        <q-checkbox v-model="selectedUsers" :val="user.id" v-if="multipleSelection" @update:model-value="userChecked(user)" :ref="'checkBox' + user.id" />
        <div class="three-dots" v-if="threeDots" @click.stop="$emit('three-dots-clicked', user)">
          <q-icon size="30px" name="more_horiz" />
        </div>
        <div class="accept-reject" v-if="acceptReject">
          <q-btn color="primary" class="friendship-button" :label="$t('community.friend_accept')" :no-caps="true" @click.stop="
              user.acceptLoading = true;
              $emit('accept', user);
            " :loading="user.acceptLoading" />
          <q-btn color="negative" class="friendship-button" :label="$t('community.friend_reject')" :no-caps="true" @click.stop="
              user.rejectLoading = true;
              $emit('reject', user);
            " :loading="user.rejectLoading" />
        </div>
      </div>
    </div>
    <div class="no-data" v-if="users.length === 0 && !isLoading">{{ noDataMessage }}</div>
  </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "UsersList",
  data() {
    return {
      selectedUsers: [],
      selectedUserDetails: [],
      cloudfrontUrlPP:
        "https://d1tqac1zek46ma.cloudfront.net/profile_pictures/",
    };
  },
  props: {
    users: {
      default: [],
    },
    isLoading: {
      default: false,
    },
    acceptReject: {
      default: false,
    },
    multipleSelection: {
      default: false,
    },
    noDataMessage: {},
    threeDots: {
      default: false,
    },
  },
  methods: {
    removeUser(userId) {
      let index = this.selectedUserDetails.findIndex((u) => u.id === userId);
      this.selectedUserDetails.splice(index, 1);
      index = this.selectedUsers.findIndex((id) => id === userId);
      this.selectedUsers.splice(index, 1);
    },
    userChecked(user) {
      const index = this.selectedUserDetails.findIndex((u) => u.id === user.id);
      if (index > -1) {
        this.selectedUserDetails.splice(index, 1);
      } else {
        this.selectedUserDetails.push(user);
      }
      this.$emit("selected-users-changed", this.selectedUserDetails);
    },
    userClicked(userId) {
      this.$emit("user-clicked", userId);
      if (this.multipleSelection) {
        const ref = "checkBox" + userId;
        this.$refs[ref][0].toggle();
      }
    },
  },
});
</script>
<style lang="scss" scoped>
@use "../../css/mixins.scss";

.users-list-wrapper {
  .user {
    @include mixins.elevated-box;
    border-radius: 15px;
    padding: 7px;
    margin: 2px 3px 0px 3px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    .user-detail {
      display: flex;
      .pp-small {
        margin-right: 5px;
      }
      .username {
        font-size: 1.1em;
        max-height: 40px;
      }
      .username-skeleton {
        width: 100px;
      }
    }
    .three-dots {
      display: flex;
      align-items: center;
      filter: invert(20%);
    }
    .accept-reject {
      display: flex;
      align-items: center;
      .friendship-button {
        font-size: 0.8em;
        padding: 4px 6px;
        margin-left: 5px;
      }
    }
  }
  .no-data {
    text-align: center;
  }
}
</style>
