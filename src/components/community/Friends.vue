<template>
  <div class="friends-wrapper">
    <div class="share-referral-code">
      <ShareReferralCode :label="$t('community.invite_your_friends')" />
    </div>
    <div class="received-friends" v-if="!isDataLoading">
      <div class="friends-type">
        {{ $t("community.friends_received") }}
        <div class="amount">
          {{ friendsReceived.length }}
        </div>
      </div>
      <UsersList
        :users="friendsReceived"
        :acceptReject="true"
        @accept="acceptFriend"
        @reject="rejectFriend"
        @user-clicked="goToUser"
      />
    </div>
    <div class="asked-friends" v-if="!isDataLoading">
      <div class="friends-type">
        {{ $t("community.friends_asked") }}
        <div class="amount">
          {{ friendsAsked.length }}
        </div>
      </div>
      <UsersList :users="friendsAsked" @user-clicked="goToUser" />
    </div>
    <div class="friends">
      <div class="friends-type" v-if="!isDataLoading">
        {{ $t("community.friends") }}
        <div class="amount">
          {{ friends.length }}
        </div>
      </div>
      <UsersList :users="friends" @user-clicked="goToUser" />
    </div>
    <UsersList :isLoading="isDataLoading" v-if="isDataLoading" />
  </div>
</template>
<script>
import { defineComponent } from "vue";
import UsersList from "components/community/UsersList";
import ShareReferralCode from "components/community/ShareReferralCode";

export default defineComponent({
  name: "Friends",
  components: { UsersList, ShareReferralCode },
  data() {
    return {
      isDataLoading: true,
      friends: [],
      friendsAsked: [],
      friendsReceived: [],
    };
  },
  created() {
    this.$store.dispatch("user/getFriendships", false).then((data) => {
      data.forEach((user) => {
        if (user.friend === 1) {
          this.friends.push(user);
        } else {
          if (user.type === "sent") {
            this.friendsAsked.push(user);
          } else {
            this.friendsReceived.push(user);
          }
        }
      });
      this.isDataLoading = false;
    });
  },
  methods: {
    rejectFriend(user) {
      this.$store.dispatch("user/rejectFriendship", user.id).then(() => {
        this.friendsReceived.splice(this.friendsReceived.indexOf(user), 1);
      });
    },
    acceptFriend(user) {
      this.$store.dispatch("user/acceptFriendship", user.id).then(() => {
        this.friendsReceived.splice(this.friendsReceived.indexOf(user), 1);
        this.friends.unshift(user);
      });
    },
    goToUser(userId) {
      this.$store.commit("user/setClickedUserId", userId);
    },
  },
});
</script>
<style lang="scss" scoped>
.friends-wrapper {
  padding: 10px;
  height: 100%;
  overflow-y: scroll;
  .share-referral-code {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }
  .friends-type {
    margin-bottom: 5px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    .amount {
      background-color: $primary;
      color: white;
      margin-left: 3px;
      font-size: 0.85em;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      min-width: 20px;
      height: 20px;
    }
  }
}
</style>
