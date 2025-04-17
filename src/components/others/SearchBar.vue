<template>
  <div class="search-bar">
    <q-input
      borderless
      dense
      v-model="userInput"
      :placeholder="placeholder"
      label-color="black"
      class="search-bar"
      @update:model-value="inputChanged"
      ref="inputBar"
    />
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { debounce } from 'quasar'

export default defineComponent({
  name: 'SearchBar',
  props: {
    placeholder: { type: String },
    minLength: { type: Number, default: 0 },
    focusOnMounted: { type: Boolean, default: false },
  },
  data() {
    return {
      userInput: '',
    }
  },
  mounted() {
    if (this.focusOnMounted) {
      this.$refs.inputBar.focus()
    }
  },
  methods: {
    inputChanged: debounce(function (input) {
      if (input.length >= this.minLength) {
        this.$emit('search', input)
      }
    }, 500),
  },
})
</script>
<style lang="scss" scoped>
.search-bar {
  display: flex;
  justify-content: center;
  box-shadow: none;
  margin: 3px;
  .search-bar {
    width: 95%;
    margin-right: 10px;
    box-shadow: 0 0px 4px #080808;
    border-radius: 14px;
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>
