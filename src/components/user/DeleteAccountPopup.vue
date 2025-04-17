<template>
  <div class="delete-account-popup popup">
    {{ $t("account.delete_account_warning") }}

    <div class="buttons">
      <q-btn
        class="logout"
        :no-caps="true"
        color="red"
        @click="$emit('yes')"
        :label="$t('others.yes')"
      />

      <q-btn
        class="logout"
        :no-caps="true"
        color="primary"
        @click="$emit('no')"
        :label="$t('others.no')"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "DeleteAccountPopup",
  components: {},
  props: [],
  data() {
    return {};
  },
  created() {},
  methods: {},
});
</script>

<style lang="scss" scoped>
@import "../../css/popup.scss";
.delete-account-popup {
  .buttons {
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
  }
}
</style>
