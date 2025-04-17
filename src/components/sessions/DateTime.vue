<template>
  <div class="datetime-wrapper">
    <q-skeleton class="date" v-if="loading || !formattedDate" />
    <div class="date" v-else>
      <div class="day">
        <div class="word">{{ $t("date.day." + new Date(formattedDate).getDay()) }}</div>
        <div class="number">{{ new Date(formattedDate).getDate() }}</div>
      </div>
      <div class="month">{{ $t("date.month." + (new Date(formattedDate).getMonth() + 1)) }}</div>
      <div class="time">
        {{ formattedDate.getHours() }}h{{
        formattedDate.getMinutes() === 0 ? "00" : formattedDate.getMinutes()
        }}
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { removeTimeZone } from "src/boot/helpers";

export default defineComponent({
  name: "DateTimes",
  data() {
    return {
      formattedDate: null,
    };
  },
  props: {
    date: {},
    loading: {
      default: false,
    },
    bgColor: {
      default: "#086788",
    },
  },
  watch: {
    loading(newVal) {
      if (newVal === false) {
        this.initDate();
      }
    },
  },
  methods: {
    initDate() {
      this.formattedDate = new Date(removeTimeZone(this.date));
    },
  },
  created() {
    if (!this.loading) this.initDate();
  },
});
</script>
<style lang="scss" scoped>
@use "../../css/mixins.scss";

.date {
  @include mixins.elevated-box;
  text-align: center;
  margin: 10px;
  padding: 7px;
  border-radius: 10px;
  width: 75px;
  height: 90px;
  font-size: 0.88em;
  .time {
    margin-top: 5px;
    font-size: 1.1em;
  }
}
</style>
