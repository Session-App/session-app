<template>
  <div class="edit-user popup">
    <div class="user" @click="goToUser">
      <img class="pp-medium" :src="cloudfrontUrlPP + user.profilePicture" />
      <span class="username"> {{ user.username }}</span>
    </div>
    <div class="buttons">
      <q-btn
        class="button"
        no-caps
        :label="$t('community.set_as_admin')"
        :loading="adminLoading"
        color="primary"
        @click="setNewAdmin"
      />
      <q-btn
        class="button"
        no-caps
        :label="$t('community.remove_user')"
        :loading="removeLoading"
        color="negative"
        @click="removeUser"
      />
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EditUser",
  components: {},
  data() {
    return {
      cloudfrontUrlPP:
        "https://d1tqac1zek46ma.cloudfront.net/profile_pictures/",
      removeLoading: false,
      adminLoading: false,
    };
  },
  props: {
    user: {},
    conversationId: {},
  },
  created() {},
  methods: {
    removeUser() {
      this.removeLoading = true;
      this.$emit("remove-user", this.user);
    },
    setNewAdmin() {
      this.adminLoading = true;
      this.$store
        .dispatch("conversations/setNewAdmin", {
          conversationId: this.conversationId,
          userId: this.user.id,
        })
        .then(() => {
          this.adminLoading = false;
          this.$emit("close");
        });
    },
    goToUser() {
      this.$store.commit("user/setClickedUserId", this.user.id);
    },
  },
});
</script>
<style lang="scss" scoped>
.edit-user {
  .user {
    display: flex;
    flex-direction: column;
    align-items: center;
    .username {
      font-size: 1.1em;
    }
  }
  .buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    .button {
      margin: 5px;
    }
  }
}
</style>
