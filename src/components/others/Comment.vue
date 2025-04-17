<template>
  <div class="comment">
    <div class="author" @click="goToUser(comment.addedBy.id)">
      <img :src="cloudfrontUrlPP + comment.addedBy.profilePicture" />
      <b>{{ comment.addedBy.username }}</b>
    </div>
    <div class="content">{{ comment.content }}</div>
  </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Comment",
  data() {
    return {
      cloudfrontUrlPP:
        "https://d1tqac1zek46ma.cloudfront.net/profile_pictures/",
    };
  },
  props: {
    comment: {
      type: Object,
    },
  },
  methods: {
    goToUser(userId) {
      this.$store.commit("user/setClickedUserId", userId);
    },
  },
});
</script>
<style lang="scss" scoped>
</style>
