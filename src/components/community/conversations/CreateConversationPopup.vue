<template>
  <div class="create-conversation-popup popup bottom-safe-area">
    <div class="types">
      <q-btn :no-caps="true" :color="oneToOne ? 'primary' : 'white'" :text-color="oneToOne ? 'white' : 'black'" @click="switchType">
        <img src="svg/single-user.svg" class="icon" :class="{ invert: oneToOne }" />
        {{ $t("community.conversation") }}
      </q-btn>
      <q-btn :no-caps="true" :color="oneToOne ? 'white' : 'primary'" :text-color="oneToOne ? 'black' : 'white'" @click="switchType">
        <img src="svg/community-outline.svg" class="icon" :class="{ invert: !oneToOne }" />
        {{ $t("community.group") }}
      </q-btn>
    </div>
    <AddMembersConversation :displayOkButton="false" :multiselect="!oneToOne" @user-clicked="createConversation" ref="addMembersConversation" class="add-members" v-show="oneToOne || step === 1" />
    <EditConversation :conversation="groupDetail" @validate="createGroup" @close="previousStep" v-if="!oneToOne && step === 2" :loading="creatingConversation" />
    <div class="create-group">
      <q-btn class="button" color="primary" v-if="!oneToOne && step === 1" @click="nextStep" :label="$t('others.next')" no-caps />
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import AddMembersConversation from 'components/community/conversations/AddMembersConversation'
import EditConversation from 'components/community/conversations/EditConversation.vue'
import { createConversation, notify } from 'boot/helpers'

export default defineComponent({
  name: 'CreateConversationPopup',
  components: { AddMembersConversation, EditConversation },
  data() {
    return {
      oneToOne: true,
      step: 1,
      groupDetail: {
        name: '',
        private: false,
        description: '',
      },
      usersListPadding: '0px',
      creatingConversation: false,
    }
  },
  methods: {
    switchType() {
      this.oneToOne = !this.oneToOne
      this.usersListPadding = this.oneToOne ? '0px' : '125px'
    },
    createConversation(userId) {
      if (!this.oneToOne) return
      createConversation(userId).then((data) => {
        this.$emit('conversation-created', data)
      })
    },
    nextStep() {
      let errors = []
      const members = this.$refs.addMembersConversation.getSelectedUserIds
      if (members.length < 2) {
        errors.push('select_2_users_at_least')
      }
      if (errors.length > 0) {
        notify(errors)
        return
      }
      this.step = 2
    },
    previousStep(conversationDetail) {
      this.step = 1
      this.groupDetail = conversationDetail
    },
    createGroup(conversationDetail) {
      const members = this.$refs.addMembersConversation.getSelectedUserIds
      let errors = []
      if (conversationDetail.name === '') {
        errors.push('missing_group_name')
      }
      if (errors.length > 0) {
        notify(errors)
        return
      }
      this.creatingConversation = true
      this.$store
        .dispatch('conversations/createConversation', {
          name: conversationDetail.name,
          private: conversationDetail.private,
          sport: conversationDetail.sport,
          lat: conversationDetail.lat,
          lon: conversationDetail.lon,
          locationName: conversationDetail.locationName,
          members: members,
        })
        .then((data) => {
          this.$store.commit('setLoading', false)
          this.$q.notify({
            message: this.$t('notification.group_created'),
            color: 'green-3',
          })
          this.creatingConversation = false
          this.$emit('conversation-created', data)
        })
    },
  },
})
</script>
<style lang="scss" scoped>
.create-conversation-popup {
  width: 85vw;
  height: 93vh !important;
  margin-top: -2vh;
  overflow: hidden;
  .add-members {
    width: 100%;
    height: calc(100% - v-bind('usersListPadding') + 60px);
  }
  .types {
    display: flex;
    justify-content: space-around;
    margin: 10px 0px;
    .icon {
      width: 22px;
      margin-right: 3px;
      margin-left: -3px;
    }
  }
  .group-name {
    margin-bottom: 10px;
  }
  .create-group {
    display: flex;
    justify-content: center;
    margin-top: -30px;
  }
}
</style>
