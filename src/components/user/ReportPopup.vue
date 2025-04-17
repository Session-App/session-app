<template>
  <q-dialog class="report-popup above-bottom-sheet" v-model="popupOpened">
    <div class="report-user-popup popup">
      <div class="title">{{ $t("account.report_entity") }}</div>

      <Input class="description" :label="$t('account.report_entity_comment')" v-model="comment" type="textarea" />

      <div class="buttons">
        <q-btn :no-caps="true" color="white" text-color="black" @click="$emit('close')" :label="$t('others.cancel')" />
        <q-btn :no-caps="true" color="primary" @click="sendReport" :label="$t('others.send')" :loading="isLoading" />
      </div>
    </div>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import Input from 'components/form/Input'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'ReportPopup',
  components: { Input },
  data() {
    return {
      isLoading: false,
      popupOpened: false,
      entityId: 0,
      entityName: '',
      comment: '',
    }
  },
  methods: {
    sendReport() {
      this.isLoading = true
      this.$store
        .dispatch('user/reportEntity', {
          entityId: this.entityId,
          entityName: this.entityName,
          comment: this.comment,
        })
        .finally(() => {
          this.$q.notify({
            message: this.$t('account.entity_reported'),
            color: 'green-3',
          })
          this.isLoading = false
          this.popupOpened = false
          this.comment = ''
        })
    },
  },
  computed: {
    ...mapGetters(['user/getReportedEntity', 'user/getReportedEntityId']),
    reportedEntity() {
      return this['user/getReportedEntity']
    },
    reportedEntityId() {
      return this['user/getReportedEntityId']
    },
  },
  watch: {
    reportedEntity(newVal) {
      if (newVal) {
        this.popupOpened = true
        this.entityId = newVal.entityId
        this.entityName = newVal.entityName
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.report-user-popup {
  width: 80vw;
  .title {
    font-size: 1.1em;
    margin-bottom: 15px;
    text-align: center;
  }
  .buttons {
    margin-top: 15px;
    display: flex;
    justify-content: space-around;
  }
}
</style>
