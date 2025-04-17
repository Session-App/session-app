<template>
  <div class="list-wrapper">
    <div v-if="loading" class="list">
      <q-skeleton class="item" v-for="i in [1, 2, 3, 4, 5, 6, 7, 8]" :key="i" />
    </div>
    <div class="list" v-else>
      <div class="groups">
        <div
          class="group item"
          v-for="group in groups"
          :key="group.id"
          @click="$emit('group-clicked', group)"
        >
          <div class="left">
            <img src="svg/community-outline.svg" class="pp-small picture" />
            <div class="name">{{ group.name }}</div>
          </div>
          <div class="right">
            <q-btn
              dense
              :label="
                sentGroups.indexOf(group.id) === -1
                  ? $t('others.send')
                  : $t('others.sent')
              "
              :no-caps="true"
              color="primary"
              @click="send({ conversationId: group.id })"
              v-if="sendButton"
            />
          </div>
        </div>
      </div>
      <div class="users">
        <div class="user item" v-for="user in users" :key="user.id">
          <div class="left">
            <img
              :src="cloudfrontUrlPP + user.profilePicture"
              class="pp-small picture"
            />
            <div class="name">{{ user.username }}</div>
          </div>
          <div class="right">
            <q-btn
              dense
              :label="
                sentUsers.indexOf(user.id) === -1
                  ? $t('others.send')
                  : $t('others.sent')
              "
              :no-caps="true"
              color="primary"
              @click="send({ userId: user.id })"
              v-if="sendButton"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ShareItem",
  props: { users: {}, groups: {}, loading: {}, sendButton: {} },
  components: {},
  data() {
    return {
      cloudfrontUrlPP:
        "https://d1tqac1zek46ma.cloudfront.net/profile_pictures/",
      sentUsers: [],
      sentGroups: [],
    };
  },
  methods: {
    send(payload) {
      if (payload.userId) {
        if (this.sentUsers.indexOf(payload.userId) !== -1) return;
        this.sentUsers.push(payload.userId);
      } else {
        if (this.sentGroups.indexOf(payload.conversationId) !== -1) return;
        else this.sentGroups.push(payload.conversationId);
      }
      this.$emit("send", payload);
    },
  },
  computed: {},
  watch: {},
});
</script>
<style lang="scss" scoped>
@use "../../css/mixins.scss";
.list-wrapper {
  height: 100%;
  overflow-y: scroll;
  .list {
    box-shadow: none;
    .item {
      @include mixins.elevated-box;
      border-radius: 10px;
      margin: 10px;
      padding: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 50px;
      .left {
        display: flex;
        align-items: center;
      }
      .picture {
        margin-right: 5px;
      }
    }
    .groups {
      .picture {
        padding: 3px;
      }
    }
  }
}
</style>
