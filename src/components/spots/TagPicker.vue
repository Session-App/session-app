<template>
  <div class="popup">
    <div class="tags-type">
      {{ $t("filters.single_tags") }}
    </div>
    <div class="tags">
      <div
        v-for="tag in tags.single"
        :key="tag"
        :class="[
          'tag',
          {
            selected: newSelectedTags.indexOf(String(tag[0])) >= 0,
            unselected: newSelectedTags.indexOf(String(tag[0])) < 0,
          },
        ]"
        @click="selectTag(tag, 'single')"
      >
        <img :src="'svg/tags/' + tag[0] + '.svg'" />
        {{ tag[1] }}
      </div>
    </div>
    <div class="tags-type">
      {{ $t("filters.multiple_tags") }}
    </div>
    <div class="tags">
      <div
        v-for="tag in tags.multiple"
        :key="tag"
        :class="[
          'tag',
          {
            selected: newSelectedTags.indexOf(String(tag[0])) >= 0,
            unselected: newSelectedTags.indexOf(String(tag[0])) < 0,
          },
        ]"
        @click="selectTag(tag, 'multiple')"
      >
        <img :src="'svg/tags/' + tag[0] + '.svg'" />
        {{ tag[1] }}
      </div>
    </div>
    <div class="button-wrapper">
      <q-btn
        :no-caps="true"
        :label="$t('others.cancel')"
        @click="$emit('cancel-clicked')"
      />
      <q-btn
        :no-caps="true"
        :label="$t('others.validate')"
        color="primary"
        @click="validate"
        :loading="validateLoading"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TagPicker",
  props: ["tags", "selectedTags"],
  data() {
    return {
      newSelectedTags: [...this.selectedTags],
      validateLoading: false,
    };
  },
  created() {},
  methods: {
    validate() {
      this.validateLoading = true;
      this.$emit("validate-clicked", this.newSelectedTags);
    },
    selectTag(tag, method) {
      if (method === "single") {
        this.tags.single.forEach((t) => {
          if (String(t[0]) === String(this.newSelectedTags[0])) {
            this.newSelectedTags.splice(0, 1);
          }
        });
        this.newSelectedTags.unshift(String(tag[0]));
      } else if (method === "multiple") {
        var deleted = false;
        this.newSelectedTags.forEach((t, key) => {
          if (String(t) === String(tag[0])) {
            this.newSelectedTags.splice(key, 1);
            deleted = true;
          }
        });
        if (!deleted) {
          this.newSelectedTags.push(String(tag[0]));
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.popup {
  .tags-type {
    margin: 10px;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .tag {
      display: flex;
      align-items: center;
      padding: 7px;
      border-radius: 7px;
      margin: 3px;
      img {
        width: 25px;
        margin-right: 5px;
      }
      &.unselected {
        background-color: $light-white;
        
      box-shadow: 0 0px 3px #080808;
      }
      &.selected {
        background-color: $primary;
        color: white;
      }
    }
  }
  .button-wrapper {
    margin-top: 10px;
    margin-bottom: 5px;
    display: flex;
    justify-content: space-around;
  }
}
</style>
