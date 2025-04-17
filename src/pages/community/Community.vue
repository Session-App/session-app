<template>
  <div class="community-wrapper" id="community-page">
    <q-tabs
      dense
      v-model="tab"
      class="text-teal"
      active-color="primary"
      indicator-color="primary"
    >
      <q-tab
        name="search"
        :icon="
          tab === 'search'
            ? 'img:svg/search-filled.svg'
            : 'img:svg/search-outline.svg'
        "
        :label="$t('community.search_friends')"
        :no-caps="true"
        class="text-primary"
      />
      <q-tab
        name="friends"
        :icon="
          tab === 'friends'
            ? 'img:svg/community-filled.svg'
            : 'img:svg/community-outline.svg'
        "
        :label="$t('community.friends')"
        :no-caps="true"
        class="text-primary"
      />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="search"><SearchUsersAndGroups /></q-tab-panel>
      <q-tab-panel name="friends"><Friends /></q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script>
import Comment from "components/others/Comment";
import Friends from "components/community/Friends";
import SearchUsersAndGroups from "components/community/SearchUsersAndGroups";
export default {
  components: { Comment, Friends, SearchUsersAndGroups },
  data() {
    return {
      tab: "search",
    };
  },
  created() {
    this.$store.commit("setSection", "community");
  },
  computed: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.community-wrapper {
  height: var(--page-height);
  overflow: hidden;
}
</style>

<style lang="scss" >
#community-page {
  .q-panel-parent {
    height: calc(100% - 56px);
    .q-panel {
      overflow-y: hidden;
      .q-tab-panel {
        height: 100%;
        padding: 0px;
      }
    }
  }
}
</style>
