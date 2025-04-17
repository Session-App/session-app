<template>
  <div class="popup language-picker">
    <div class="title">{{ $t("languages.pick_language") }} :</div>
    <div class="languages">
      <div
        class="language"
        v-for="lang in languages"
        :key="lang"
        @click="$emit('lang-clicked', lang)"
      >
        <span class="flag">{{ lang[1] }}</span>
        {{ $t("languages." + lang[0]) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LanguageSwitcher",
  props: ["languages"],
  data() {
    return {};
  },

  methods: {},
};
</script>

<style scoped lang="scss">
.language-picker {
  .title {
    margin: 5px;
  }
  .languages {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .language {
      background-color: $light-grey;
      padding: 5px;
      border-radius: 7px;
      margin: 7px;
      .flag {
        font-size: 1.2em;
      }
    }
  }
}
</style>
