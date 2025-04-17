<template>
  <q-dialog class="bottom-sheet" v-model="popupOpened" position="bottom">
    <div class="share-wrapper">
      <SearchBar
        :placeholder="$t('community.search')"
        @search="loadSharables"
        class="search-bar"
      />
      <UsersAndGroupsList
        :loading="isLoading"
        :users="users"
        :groups="groups"
        :sendButton="true"
        @send="send"
        class="users-group-list"
      />
    </div>
  </q-dialog>
</template>
<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import UsersAndGroupsList from "components/community/UsersAndGroupsList";
import SearchBar from "components/others/SearchBar";
import Input from "components/form/Input";

export default defineComponent({
  name: "ShareItem",
  components: { UsersAndGroupsList, SearchBar, Input },
  data() {
    return {
      popupOpened: false,
      users: [],
      groups: [],
      sessionId: null,
      isLoading: true,
    };
  },
  props: {},
  methods: {
    send(e) {
      e.sessionId = this.sessionId;
      e.payload = { content: "" };
      this.$store.dispatch("conversations/shareItem", e);
    },
    loadSharables(query = "") {
      this.isLoading = true;
      this.$store
        .dispatch("conversations/loadSharables", query)
        .then((data) => {
          this.users = data.users;
          this.groups = data.conversations;
          this.isLoading = false;
        });
    },
  },
  computed: {
    ...mapGetters(["conversations/getSharedSessionId"]),
    sharedSessionId() {
      return this["conversations/getSharedSessionId"];
    },
  },
  watch: {
    sharedSessionId(newVal) {
      if (newVal) {
        this.popupOpened = true;
        this.sessionId = newVal;
        this.$store.commit("conversations/setSharedSessionId", null);
        this.loadSharables();
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.share-wrapper {
  height: 100%;
  .search-bar{
    margin-top: 10px;
  }
}
</style>
