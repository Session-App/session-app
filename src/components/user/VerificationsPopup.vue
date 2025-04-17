<template>
  <div class="verifications-explanation popup">
    <div class="explanation">
      {{ $t("account.verification_explanation") }}
    </div>
    <div class="ok">
      <q-btn
        :no-caps="true"
        :label="$t('others.ok')"
        @click="$emit('ok')"
        color="primary"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "VerificationsPopup",
  components: {},
  props: ["points", "level"],
  data() {
    return {};
  },
  created() {},
  methods: {},
});
</script>

<style lang="scss" scoped>
.verifications-explanation {
  .explanation {
    text-align: justify;
  }
  .ok {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
