<template>
  <div class="tags-list">
    <div class="type-title">{{$t('tricks.level_sort')}}</div>
    <TagsListItem v-if="loading" :loading="loading" v-for="i in [1,2,3]" :key="i" />
    <TagsListItem v-else :tag="tag" :loading="loading" v-for="(tag, id) in levels" :key="id" @click="tagClicked({id: id, name: tag.name, progress: tag.progress, totalAmount: tag.variationsAmount + tag.tricksAmount})" />
    <div class="type-title">{{$t('tricks.tag_sort')}}</div>
    <TagsListItem v-if="loading" :loading="loading" v-for="i in [1,2,3,4,5]" :key="i" />
    <TagsListItem :tag="tag" :loading="loading" v-for="(tag, id) in tags" :key="id" @click="tagClicked({id: id, name: tag.name, progress: tag.progress, totalAmount: tag.variationsAmount + tag.tricksAmount})" />
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import TagsListItem from 'components/tricks/TagsListItem'

export default defineComponent({
  name: 'TagsList',
  components: { TagsListItem },
  props: {
    sportId: {},
  },
  data() {
    return {
      levels: {},
      tags: {},
      loading: true,
    }
  },
  created() {
    let lang = localStorage.getItem('lang')
    let tags = { ...this.$i18n.messages[lang].tricks.tags[this.sportId] }
    let levels = { ...this.$i18n.messages[lang].tricks.tags.levels }
    this.$store
      .dispatch('tricks/getTags', { sportId: this.$route.query.sportId })
      .then((data) => {
        this.loading = false
        let receivedTag

        Object.entries(levels).forEach((tag, id) => {
          receivedTag = data.tags.find((t) => tag[0] == t.id)
          this.levels[tag[0]] = {
            name: tag[1],
            progress: this.getTagProgress(receivedTag),
            tricksAmount: receivedTag ? receivedTag.tricksAmount : 0,
            variationsAmount: receivedTag ? receivedTag.variationsAmount : 0,
          }
        })
        Object.entries(tags).forEach((tag, id) => {
          receivedTag = data.tags.find((t) => tag[0] == t.id)
          this.tags[tag[0]] = {
            name: tag[1],
            progress: this.getTagProgress(receivedTag),
            tricksAmount: receivedTag ? receivedTag.tricksAmount : 0,
            variationsAmount: receivedTag ? receivedTag.variationsAmount : 0,
          }
        })
      })
  },
  methods: {
    getTagProgress(tag) {
      const masteredTags = JSON.parse(localStorage.getItem('masteredTags'))
      return masteredTags[this.$route.query.sportId] && tag
        ? 100 *
            (parseInt(masteredTags[this.$route.query.sportId][tag.id] ?? 0) /
              (tag.tricksAmount + tag.variationsAmount))
        : 0
    },
    tagClicked(payload) {
      this.$router.push({
        name: 'tricks-list',
        query: {
          sportId: this.$route.query.sportId,
          tagId: payload.id,
          tagName: payload.name,
          totalAmount: payload.totalAmount,
        },
      })
    },
  },
})
</script>
<style lang="scss" scoped>
@use '../../css/mixins.scss';
.tags-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  .type-title {
    font-size: 1.2em;
    color: $primary;
    margin-top: 10px;
  }
}
</style>
