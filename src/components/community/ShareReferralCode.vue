<template>
  <q-btn color="primary" :no-caps="true" @click="shareReferralCode">
    {{ label ?? referralCode }}
    <q-icon size="18px" class="share-icon" name="content_share" />
  </q-btn>
</template>
<script>
import { defineComponent } from "vue";
import { Share } from "@capacitor/share";

export default defineComponent({
  name: "ShareReferralCode",
  props: { label: {} },
  data() {
    return {
      referralCode: "",
    };
  },
  created() {
    this.referralCode = localStorage.getItem("username");
  },
  methods: {
    shareReferralCode() {
      Share.share({
        title: this.$t("account.share_app_title"),
        text: this.$t("account.share_app_text", [this.referralCode]),
        dialogTitle: this.$t("account.share_app_dialog_title"),
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.share-icon {
  margin-right: 65px;
  margin-left: -65px;
}
</style>
