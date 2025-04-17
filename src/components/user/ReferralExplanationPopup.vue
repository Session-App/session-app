<template>
  <div class="popup">
    <div>
      {{ $t("account.referral_code_explanation") }}
    </div>
    <q-btn
      class="ok-btn"
      :label="$t('others.ok')"
      color="primary"
      :no-caps="true"
      @click="$emit('ok')"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ReferralExplanationPopup",
  components: {},
  data() {
    return {};
  },
  created() {},
  methods: {},
});
</script>

<style lang="scss" scoped>
.popup {
  padding: 10px;
  text-align: center;
  .ok-btn {
    margin-top: 8px;
  }
}
</style>
