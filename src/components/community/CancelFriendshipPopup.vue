<template>
  <div class="popup cancel-friendship">
    {{ $t("account.cancel_friendship_warning", [username]) }}
    <div class="warning-buttons">
      <q-btn
        :label="$t('others.yes')"
        color="negative"
        :no-caps="true"
        @click="$emit('yes')"
      />
      <q-btn
        :label="$t('others.no')"
        color="primary"
        :no-caps="true"
        @click="$emit('no')"
      />
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "CancelFriendshipPopup",
  data() {
    return {};
  },
  props: ["username"],
});
</script>
<style lang="scss" scoped>
.cancel-friendship {
  .warning-buttons {
    margin-top: 10px;
    display: flex;
    justify-content: space-around;
  }
}
</style>
