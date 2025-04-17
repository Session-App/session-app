<template>
  <div class="main-wrapper">
    <div class="title">{{$t('tricks.tricks')}}</div>
    <div class="explanation">{{$t('tricks.explanation')}}</div>
    <TagsList :sportId="$route.query.sportId" />
  </div>
</template>
<script>
import TagsList from 'components/tricks/TagsList'

export default {
  components: {
    TagsList,
  },
  data() {
    return {}
  },
  created() {
    if (!localStorage.getItem('masteredTags')) {
      localStorage.setItem('masteredTags', '{}')
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.main-wrapper {
  height: var(--page-height);
  overflow-y: scroll;
  .title {
    text-align: center;
    font-size: 1.8em;
  }
  .explanation {
    border: 2px solid $primary;
    padding: 6px;
    margin: 10px;
    border-radius: 15px;
  }
}
</style>
