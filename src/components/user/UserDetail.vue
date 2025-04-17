<template>
  <div class="user-detail" id="user-detail">
    <div class="close-bottom-sheet" @click="$emit('close-clicked')" v-if="closable">
      <img src="svg/close.svg" />
    </div>
    <div class="main-info card">
      <div class="user-details">
        <div class="top">
          <img class="pp-medium" v-show="!isPPLoading" v-if="!isDataLoading" :onload="(isPPLoading = false)" :src="
              user.profilePicture === 'null'
                ? 'svg/pp.svg'
                : cloudfrontUrlPP + user?.profilePicture
            " />
          <q-skeleton class="pp-medium" v-if="isPPLoading" />
          <div class="three-dots" v-if="isForeignUser">
            <img class="three-dots-button" src="svg/three-dots.svg" />
            <q-menu>
              <q-list class="three-dots-options">
                <q-item clickable v-close-popup @click="$store.commit('user/setReportedEntity', {entityId: userId, entityName: 'User'})">
                  <img class="option" src="svg/report.svg" />
                  <q-item-section>
                    {{
                    $t("account.report_user")
                    }}
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="blockUser">
                  <img class="option" src="svg/report.svg" />
                  <q-item-section>
                    {{
                    $t("account.block_user")
                    }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>

          <div class="username-bio">
            <div>
              <div class="username" v-if="!isDataLoading">{{ user.username }}</div>
              <q-skeleton class="username" v-if="isDataLoading" />
            </div>
            <div class="bio" v-if="!isDataLoading">{{ user.bio }}</div>
          </div>
        </div>
        <div class="favorite-sports-wrapper">
          <div class="favorite-sports">
            <div class="progressions" v-if="isDataLoading">
              <div class="progression" v-for="i in [1, 2, 3]" :key="i">
                <q-circular-progress show-value indeterminate size="50px" :thickness="0.1" color="secondary" track-color="grey-3">
                  <!--<div class="level">x</div>-->
                </q-circular-progress>
                <q-skeleton class="sport-name-skeleton sport-name" />
              </div>
            </div>
            <div class="progressions" v-if="!isDataLoading && user.favoriteSports !== []">
              <div class="progression" v-for="sport in user.favoriteSports" :key="sport">
                <q-circular-progress show-value :value="100" size="50px" :thickness="0.1" color="secondary" track-color="grey-3">
                  <img class="sport-img" :src="'svg/all-sports/' + sport + '.svg'" />
                  <!--<div class="level">4</div>-->
                </q-circular-progress>
                <span class="sport-name">
                  {{
                  $t("sports.sports." + sport)
                  }}
                </span>
              </div>
            </div>
            <div class="progressions" v-if="user.favoriteSports?.length === 0 && !isDataLoading">{{ $t("account.no_favorite_sports") }}</div>
          </div>
        </div>
        <div class="edit-profile" v-if="!isForeignUser">
          <q-btn color="primary" :label="$t('account.edit_my_profile')" class="button" dense :no-caps="true" @click="$router.push('edit-profile')" v-if="!isForeignUser" />
        </div>
      </div>
    </div>
    <div v-if="isForeignUser && !isDataLoading" class="foreign-buttons">
      <q-dialog v-model="cancelFriendship" class="above-bottom-sheet">
        <CancelFriendshipPopup :username="user.username" @no="cancelFriendship = false" @yes="editFriendship" />
      </q-dialog>
      <q-btn :label="friendshipLabel" class="friendship-button" color="primary" :no-caps="true" @click="editFriendship" :loading="editingFriendship" v-if="isFriend !== 'receivedRequest'" />
      <div v-else class="accept-decline-friendship">
        {{ $t("community.friendship_request_received") }} :
        <div class="buttons">
          <q-btn color="primary" class="button" :label="$t('community.friend_accept')" :no-caps="true" @click="acceptFriend" :loading="user.acceptLoading" />
          <q-btn color="negative" class="button" :label="$t('community.friend_reject')" :no-caps="true" @click="rejectFriend" :loading="user.rejectLoading" />
        </div>
      </div>
      <q-btn class="button" :no-caps="true" color="green-5" @click="verifyUserDialog = true" :label="$t('account.verify_user')" v-if="verifiableSports.length !== 0 && isFriend === true" />
      <q-btn class="send-message button" :no-caps="true" color="primary" @click="
          $router.push({
            name: 'conversations',
            query: { goToUserId: userId },
          })
        " :label="$t('account.send_message')" />
    </div>
    <div class="stats card">
      <div class="contribution" @click="displayCommunityLevelPopup">
        <div class="contribution-title">
          {{ $t("account.contribution_level") }}
          <img class="logo-information" src="svg/logo-information.svg" />
        </div>
        <div class="contribution-value">
          <q-circular-progress show-value size="50px" :thickness="0.1" color="primary" track-color="grey-3" :value="communityLevel.progress" v-if="!isDataLoading">
            <div class="level">{{ communityLevel.level }}</div>
          </q-circular-progress>
          <q-circular-progress show-value size="50px" :thickness="0.1" color="primary" track-color="grey-3" indeterminate v-if="isDataLoading">
            <q-skeleton class="level" />
          </q-circular-progress>
        </div>
      </div>
      <div class="bottom" @click="checkFriendship">
        <div class="spots section">
          {{ $t("account.spots") }}
          <q-btn class="stat-item" :no-caps="true" @click="displaySpots('added', stats.addedSpots)">
            <q-skeleton class="value" v-if="isDataLoading" />
            <div class="value" v-if="!isDataLoading">{{ stats.addedSpots }}</div>
            <div class="type">{{ $t("account.added_spots") }}</div>
          </q-btn>
          <q-btn class="stat-item" :no-caps="true" @click="displaySpots('favorite', stats.favoriteSpots)">
            <q-skeleton class="value" v-if="isDataLoading" />
            <div class="value" v-if="!isDataLoading">{{ stats.favoriteSpots }}</div>
            <div class="type">{{ $t("account.favorite_spots") }}</div>
          </q-btn>
        </div>
        <div class="sessions section">
          {{ $t("account.sessions") }}
          <q-btn class="stat-item" :no-caps="true" @click="displaySessions('upcoming', stats.upcomingSessions)">
            <q-skeleton class="value" v-if="isDataLoading" />
            <div class="value" v-if="!isDataLoading">{{ stats.upcomingSessions }}</div>
            <div class="type">{{ $t("account.upcoming_sessions") }}</div>
          </q-btn>
          <q-btn class="stat-item" :no-caps="true" @click="displaySessions('passed', stats.passedSessions)">
            <q-skeleton class="value" v-if="isDataLoading" />
            <div class="value" v-if="!isDataLoading">{{ stats.passedSessions }}</div>
            <div class="type">{{ $t("account.passed_sessions") }}</div>
          </q-btn>
        </div>
      </div>
    </div>
    <div class="card verifications" v-if="
        !isForeignUser && !isDataLoading && stats.verifications.length !== 0
      " @click="verificationsPopup = true">
      <div class="title">
        {{ $t("account.sport_verifications") }}
        <img class="logo-information" src="svg/logo-information.svg" />
      </div>
      <div class="verification-progresses">
        <div v-for="(status, sportId) in stats.verifications" :key="sportId" class="progress">
          <div class="sport-name">{{ $t("sports.sports." + sportId) }}</div>
          <q-linear-progress rounded color="green-5" size="25px" :value="status / 5" class="progress-bar">
            <div class="absolute-full flex flex-center">
              <q-badge color="white" text-color="primary" :label="status === 5 ? $t('account.verified') : status + '/5'" />
            </div>
          </q-linear-progress>
        </div>
      </div>
    </div>

    <div v-if="isForeignUser">
      <q-dialog v-if="!isDataLoading" v-model="verifyUserDialog" class="above-bottom-sheet">
        <div class="popup">
          <div class="verify-user-popup" v-if="verificationStep === 1">
            <div class="explanation">{{ $t("account.verify_user_explanation") }}</div>
            <div class="proceed">
              {{ $t("account.proceed_question") }}
              <div>
                <q-btn :no-caps="true" color="primary" @click="verifyUserDialog = false">{{ $t("others.no") }}</q-btn>
                <q-btn :no-caps="true" color="red" @click="verificationStep = 2">{{ $t("others.yes") }}</q-btn>
              </div>
            </div>
          </div>
          <div class="verify-user-popup" v-if="verificationStep === 2">
            <div>{{ $t("account.verify_user_pick_sport", [user.username]) }}</div>
            <SportPicker @sport-selected="updateSelectedSport" @disabled-sport-clicked="disabledSportClicked" :sportIds="verifiableSports" :disabledSports="alreadyVerifiedSports" method="single" />
            <q-btn class="validate" :label="$t('others.ok')" color="primary" :no-caps="true" @click="validate" />
          </div>
        </div>
      </q-dialog>
    </div>
    <q-dialog class="bottom-sheet" v-model="sessionStatsDialog" position="bottom">
      <SessionsBottomSheet :sessionsType="sessionsType" :amount="sessionsAmount" :username="user.username" :userId="userId" @close-clicked="sessionStatsDialog = false" />
    </q-dialog>
    <q-dialog class="bottom-sheet" v-model="spotStatsDialog" position="bottom">
      <SpotsBottomSheet @close-clicked="spotStatsDialog = false" :spotsType="spotsType" :amount="spotsAmount" :username="user.username" :userId="userId" />
    </q-dialog>
    <q-dialog v-model="communityLevelPopup">
      <CommunityLevelPopup :points="stats.contribution" :level="communityLevel" @ok="communityLevelPopup = false" />
    </q-dialog>
    <q-dialog v-model="verificationsPopup">
      <VerificationsPopup @ok="verificationsPopup = false" />
    </q-dialog>
    <q-dialog v-if="!isForeignUser" v-model="nextLevelPopup">
      <NextLevel :previousLevel="communityLevel.previousLevel" :level="communityLevel.level" :progress="communityLevel.progress" />
    </q-dialog>
  </div>
</template>

<script charset="utf-8">
import SportPicker from 'components/sports/SportPicker'
import SportBadge from 'components/sports/SportBadge'
import SessionsBottomSheet from 'components/user/SessionsBottomSheet'
import SpotsBottomSheet from 'components/user/SpotsBottomSheet'
import CommunityLevelPopup from 'components/user/CommunityLevelPopup'
import VerificationsPopup from 'components/user/VerificationsPopup'
import NextLevel from 'components/community/NextLevel'
import CancelFriendshipPopup from 'components/community/CancelFriendshipPopup'

export default {
  name: 'UserDetail',
  components: {
    SportPicker,
    SportBadge,
    SessionsBottomSheet,
    SpotsBottomSheet,
    CommunityLevelPopup,
    VerificationsPopup,
    NextLevel,
    CancelFriendshipPopup,
  },
  props: { userId: {}, closable: {}, borderRadius: { default: '0px' } },
  data() {
    return {
      isPPLoading: true,
      isDataLoading: true,
      cloudfrontUrlPP:
        'https://d1tqac1zek46ma.cloudfront.net/profile_pictures/',
      user: {},
      myRoles: [],
      verifiableSports: [],
      alreadyVerifiedSports: [],
      stats: {},
      isFriend: false,
      selectedSport: null,
      verifyUserDialog: false,
      verificationStep: 1,
      sessionStatsDialog: false,
      sessionsType: null,
      sessionsAmount: 0,
      spotStatsDialog: false,
      spotsTypes: null,
      spotsAmount: 0,
      editingFriendship: false,
      cancelFriendship: false,
      communityLevelPopup: false,
      communityLevel: {},
      verificationsPopup: false,
      nextLevelPopup: false,
    }
  },
  created() {
    this.loadUserData()
  },
  computed: {
    isForeignUser() {
      return (
        localStorage.getItem('userId') !== this.userId &&
        this.userId !== undefined
      )
    },
    friendshipLabel() {
      if (this.isFriend === false) {
        return this.$t('account.request_friendship')
      } else if (this.isFriend === 'pending') {
        return this.$t('account.friendship_pending')
      } else {
        return this.$t('account.friend')
      }
    },
  },
  methods: {
    blockUser() {
      this.$store.commit('setLoading', true)
      this.$store
        .dispatch('user/blockUser', this.userId)
        .then((data) => {
          if (!localStorage.getItem('blockedUsers')) {
            localStorage.setItem('blockedUsers', '[]')
          }
          let blockedUsers = JSON.parse(localStorage.getItem('blockedUsers'))
          blockedUsers.push(this.userId)
          localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers))
          this.$q.notify({
            message: this.$t('account.user_blocked'),
            color: 'green-3',
            timeout: 1000,
          })
        })
        .finally(() => {
          this.$store.commit('setLoading', false)
        })
    },
    rejectFriend() {
      this.user.rejectLoading = true
      this.$store.dispatch('user/rejectFriendship', this.user.id).then(() => {
        this.isFriend = false
      })
    },
    acceptFriend() {
      this.user.acceptLoading = true
      this.$store.dispatch('user/acceptFriendship', this.user.id).then(() => {
        this.isFriend = true
      })
    },
    checkFriendship() {
      if (this.isFriend !== true && this.isForeignUser) {
        this.$q.notify({
          message: this.$t('notification.become_friend_to_see_stat_details', [
            this.user.username,
          ]),
          color: 'green-3',
        })
      }
    },
    editFriendship() {
      if (this.isFriend === true) {
        if (!this.cancelFriendship) {
          this.cancelFriendship = true
          return
        }
      }
      if (this.isFriend === 'pending' || this.isFriend) {
        this.editingFriendship = true
        this.cancelFriendship = false
        this.$store.dispatch('user/rejectFriendship', this.userId).then(() => {
          this.isFriend = false
          this.editingFriendship = false
        })
      } else {
        this.editingFriendship = true
        this.$store
          .dispatch('user/sendFriendshipRequest', this.userId)
          .then(() => {
            this.isFriend = 'pending'
            this.editingFriendship = false
          })
      }
    },
    displaySessions(type, amount) {
      if (this.isFriend === true || !this.isForeignUser) {
        this.sessionsType = type
        this.sessionStatsDialog = true
        this.sessionsAmount = amount
      }
    },
    displaySpots(type, amount) {
      if (this.isFriend === true || !this.isForeignUser) {
        this.spotsType = type
        this.spotStatsDialog = true
        this.spotsAmount = amount
      }
    },
    displayCommunityLevelPopup() {
      if (!this.isForeignUser) {
        this.communityLevelPopup = true
      }
    },
    disabledSportClicked(sportId) {
      this.$q.notify(
        this.$t('notification.sport_user_already_verified', [
          this.user.username,
        ])
      )
    },
    updateSelectedSport(sport) {
      this.selectedSport = sport
    },
    validate() {
      if (this.selectedSport !== null) {
        this.$store.dispatch('user/validate', {
          userId: this.userId,
          sportId: this.selectedSport,
        })
        this.alreadyVerifiedSports.push(parseInt(this.selectedSport))
        this.$q.notify({
          message: this.$t('notification.user_verified_successfully', [
            this.user.username,
          ]),
          color: 'green-3',
        })
        this.verifyUserDialog = false
        this.selectedSport = null
        this.verificationStep = 1
      } else {
        this.verifyUserDialog = false
      }
    },
    loadUserData() {
      if (this.userId !== undefined) {
        if (localStorage.getItem('userId') === this.userId) {
          this.userId = undefined
          this.$store.commit('setSection', 'profile')
          this.loadUserData()
          return
        }
        this.$store
          .dispatch('user/getForeignUser', this.userId)
          .then((data) => {
            this.user = data.user
            this.stats = data.stats
            this.myRoles = localStorage.getItem('roles').split(',')
            this.isFriend = data.isFriend
            if (this.isFriend === 'receivedRequest') {
              this.user.acceptLoading = false
              this.user.rejectLoading = false
            }
            this.myRoles.forEach((role) => {
              if (role.includes('ROLE_SECRET')) {
                this.verifiableSports.push(role.slice(-1))
              }
            })
            data.alreadyVerifiedSports.forEach((sport) => {
              this.alreadyVerifiedSports.push(sport.sport)
            })
            this.calculateCommunityLevel()
            this.isDataLoading = false
          })
          .catch((e) => {})
      } else {
        this.$store.dispatch('user/getUser').then((data) => {
          this.user = data.user
          this.stats = data.stats
          this.calculateCommunityLevel()
          this.isDataLoading = false
        })
      }
    },
    calculateCommunityLevel() {
      var level = Math.floor(Math.sqrt(this.stats.contribution / 36))
      this.communityLevel = {
        level: level,
        progress: (Math.sqrt(this.stats.contribution / 36) - level) * 100,
        previousLevel: parseInt(localStorage.getItem('communityLevel')),
      }
      if (
        !this.isForeignUser &&
        this.communityLevel.previousLevel < this.communityLevel.level
      ) {
        this.nextLevelPopup = true
      }
      if (!this.isForeignUser) {
        localStorage.setItem('communityLevel', this.communityLevel.level)
      }
    },
  },
}
</script>

<style lang="scss">
.above-bottom-sheet {
  z-index: 999999;
  position: relative;
}
</style>
<style lang="scss" scoped>
@use '../../css/mixins.scss';
@import '../../css/popup.scss';

.user-detail {
  width: 100vw;
  border-top-left-radius: v-bind('borderRadius');
  border-top-right-radius: v-bind('borderRadius');
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  height: 100%;
  .close-bottom-sheet {
    width: 100vw;
  }

  .card {
    @include mixins.elevated-box;
    border-radius: 15px;
    width: 95vw;
    padding: 10px;
    margin-bottom: 10px;
  }

  .three-dots {
    position: fixed;
    right: 4.5vw;
    margin-top: -7px;
    img {
      width: 20px;
    }
  }
  .main-info {
    margin-top: 10px;
    .user-details {
      display: flex;
      flex-direction: column;
      .edit-profile {
        display: flex;
        justify-content: center;
        margin-top: 5px;
        margin-bottom: 5px;
        .button {
          padding: 2px 5px;
        }
      }
      .top {
        display: flex;
        .username-bio {
          margin-left: 10px;
          .username {
            font-size: 1.5em;
            font-weight: bold;
            min-width: 120px;
          }
          .bio {
            font-size: 0.8em;
          }
        }
      }
      .favorite-sports-wrapper {
        .title {
          font-size: 0.9em;
          margin-top: 10px;
          margin-bottom: 5px;
        }
        .favorite-sports {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          .sport-badge {
            margin: 2px;
          }
        }
      }
    }
  }
  .foreign-buttons {
    margin-bottom: 10px;
    justify-content: space-around;
    width: 100vw;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .button {
      margin: 5px 0px;
    }
    .accept-decline-friendship {
      display: flex;
      flex-direction: column;
      align-items: center;
      .buttons {
        margin-top: 5px;
        width: 65vw;
        display: flex;
        justify-content: space-around;
      }
    }
  }

  .stats {
    .contribution-title {
      padding-top: 2px;
      padding-bottom: 10px;
    }
    .bottom {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      .section {
        text-align: center;
        .value {
          font-weight: bold;
          min-width: 30px;
          margin-right: 13px;
          text-align: center;
        }
        .stat-item {
          @include mixins.elevated-box;
          border-radius: 14px;
          border-radius: 7px;
          padding: 9px;
          margin-right: 10px;
          margin-left: 10px;
          margin-top: 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 37vw;
          margin-bottom: 9px;
          .type {
            text-align: center;
            font-size: 0.9em;
          }
        }
      }
    }

    .contribution {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      .contribution-value {
        display: flex;
        flex-direction: column;
        align-items: center;
        .level {
          font-size: 1.5em;
          color: $primary;
          font-weight: bold;
          min-width: 15px;
          text-align: center;
          margin-top: 4px;
        }
        .exact-value {
          font-size: 0.8em;
        }
      }
    }
  }
  .pp-medium {
    margin-left: 7px;
    margin-top: 0px;
    text-align: center;
    justify-content: center;
    display: flex;
  }

  .progressions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    font-size: 0.9em;
    .progression {
      margin: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .sport-img {
        width: 30px;
      }
      .level {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 33px;
        left: 35px;
        background-color: white;
        color: $secondary;
        padding: 10px;
        border-radius: 50%;
        width: 6px;
        height: 7px;
      }
      .sport-name {
        margin-top: 5px;
        background-color: $secondary;
        color: white;
        padding: 4px;
        border-radius: 7px;
        font-size: 0.85em;
      }
      .sport-name-skeleton {
        width: 80px;
        height: 20px;
      }
    }
  }

  .logo-information {
    width: 12px;
    margin-bottom: -2px;
  }
  .verifications {
    .title {
      text-align: center;
    }
    .verification-progresses {
      width: 90vw;
      margin-top: 10px;
      margin-bottom: 5px;
      .sport-name {
        margin-bottom: 4px;
        margin-top: 6px;
      }
    }
  }

  .verify-user-popup {
    .explanation {
      text-align: justify;
    }
    .proceed {
      text-align: center;
      margin-top: 15px;
      display: flex;
      flex-direction: column;
      button {
        margin-top: 10px;
        margin-right: 15px;
        margin-left: 15px;
      }
    }
    .validate {
      margin-top: 10px;
      position: relative;
      left: 82%;
    }
  }
}
</style>
