<template>
  <div class="page-profile">
    <UserDetail class="user-detail-component" :userId="userId" />
  </div>
</template>

<script charset="utf-8">
import UserDetail from "components/user/UserDetail";
export default {
  components: {
    UserDetail,
  },
  data() {
    return {
      userId: this.$route.query.userId,
    };
  },
  created() {
    this.$store.commit("setSection", "profile");
  },
};
</script>

<style lang="scss" scoped>
.page-profile {
  height: var(--page-height);
  background: $background-gradient;
}
</style>
