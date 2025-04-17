<template>
  <div class="horizontal-users-list">
    <div class="user" v-for="user in users" :key="user.id">
      <div class="pp">
        <img class="pp-small" :src="cloudfrontUrlPP + user.profilePicture" />
        <img
          class="remove-user"
          src="svg/close.svg"
          @click="$emit('remove', user.id)"
        />
      </div>
      <div class="username">{{ user.username }}</div>
    </div>
    <div class="no-data" v-if="users.length === 0">{{ noDataPlaceholder }}</div>
  </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HorizontalUsersList",
  data() {
    return {
      cloudfrontUrlPP:
        "https://d1tqac1zek46ma.cloudfront.net/profile_pictures/",
    };
  },
  props: {
    users: {
      default: [],
    },
    deletableUsers: {
      default: true,
    },
    noDataPlaceholder: {},
  },
  methods: {},
});
</script>
<style lang="scss" scoped>
.horizontal-users-list {
  display: flex;
  overflow-x: scroll;
  height: 60px;
  .user {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 3px;
    .pp {
      height: $pp-small-width;
      display: flex;
      align-items: flex-start;
      .remove-user {
        margin-left: -12px;
        margin-right: -5px;
        margin-top: -3px;
        width: 17px;
        background-color: white;
        border-radius: 10px;
        padding: 3px;
      }
    }
    .username {
      font-size: 0.8em;
    }
  }
  .no-data {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    color: #7c7c7b;
  }
}
</style>
