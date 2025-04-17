<template>
  <div class="tag-badge" v-if="!loading">
    <img :src="'svg/tags/' + tagId + '.svg'" />
    {{ tagName }}
  </div>
  <q-skeleton class="tag-badge loading" v-if="loading" />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TagBadge",
  props: {
    tagId: {},
    sportId: {},
    loading: {
      default: false,
    },
  },
  data() {
    return {
      tagName: null,
    };
  },
  created() {
    let lang = localStorage.getItem("lang") ?? "en";
    if (!this.loading) {
      const singleTags = this.$i18n.messages[lang].filters[this.sportId].single;
      if (singleTags) {
        singleTags.forEach((tag) => {
          if (tag[0] === parseInt(this.tagId)) {
            this.tagName = tag[1];
          }
        });
        if (this.tagName === null) {
          this.$i18n.messages[lang].filters[this.sportId].multiple.forEach(
            (tag) => {
              if (tag[0] === parseInt(this.tagId)) {
                this.tagName = tag[1];
              }
            }
          );
        }
      }
    }
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
.tag-badge {
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 7px;
  background-color: $secondary;
  color: white;
  font-size: 0.85em;
  margin-right: 2px;
  margin-top: 2px;
  img {
    width: 20px;
    margin-right: 5px;
  }
}
.loading {
  width: 75px !important;
  height: 18px;
}
</style>
