<template>
  <q-dialog v-model="opened" position="bottom" class="bottom-sheet">
    <div class="user-detail-bottom-sheet">
      <UserDetail :closable="true" :userId="userId" @close-clicked="close" borderRadius="14px" />
    </div>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import UserDetail from 'components/user/UserDetail'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'UserDetailBottomSheet',
  components: { UserDetail },
  props: {},
  data() {
    return {
      opened: false,
      userId: null,
    }
  },
  computed: {
    ...mapGetters(['user/getClickedUserId']),
    clickedUserId() {
      return this['user/getClickedUserId']
    },
  },
  methods: {
    close() {
      this.opened = false
    },
  },
  watch: {
    clickedUserId(newVal) {
      if (newVal) {
        if (newVal == localStorage.getItem('userId')) {
          this.$router.push({
            name: 'profile',
          })
        } else {
          this.userId = newVal
          this.opened = true
        }
        this.$store.commit('user/setClickedUserId', null)
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.user-detail-bottom-sheet {
  padding-bottom: 70px;
}
</style>
