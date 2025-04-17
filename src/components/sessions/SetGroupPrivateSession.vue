<template>
  <div class="set-group">
    <SearchBar
      :placeholder="$t('community.search')"
      @search="loadGroups"
      class="search-bar"
    />
    <GroupsList
      :loading="loading"
      :groups="groups"
      :sendButton="false"
      @group-clicked="groupClicked"
    />
  </div>
</template>
<script>
import { defineComponent } from "vue";
import GroupsList from "components/community/GroupsList";
import SearchBar from "components/others/SearchBar";

export default defineComponent({
  name: "SetGroupPrivateSession",
  components: { SearchBar, GroupsList },
  data() {
    return {
      loading: true,
      groups: [],
    };
  },
  props: {},
  methods: {
    groupClicked(group) {
      this.$emit("group-selected", group);
    },
    loadGroups(name = "") {
      this.loading = true;
      this.$store
        .dispatch("conversations/findConversations", {
          name: name,
          onlyIfMember: true,
        })
        .then((data) => {
          this.groups = data.conversations;
          this.loading = false;
        });
    },
  },
  watch: {},
  created() {
    this.loadGroups();
  },
});
</script>
<style lang="scss" scoped>
.set-group {
  height: 100%;
}
</style>
