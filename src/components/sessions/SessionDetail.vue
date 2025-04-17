<template>
  <q-dialog class="bottom-sheet big" v-model="opened" position="bottom">
    <div class="session-detail-wrapper">
      <div class="top-buttons">
        <div class="close-bottom-sheet" @click="close">
          <img src="svg/close.svg" />
        </div>

        <div class="three-dots">
          <div>
            <img class="three-dots-button" src="svg/three-dots.svg" />
            <q-menu>
              <q-list>
                <q-item clickable v-close-popup @click="$store.commit('user/setReportedEntity', {entityId: sessionId, entityName: 'Session'})">
                  <q-item-section>
                    {{
                    $t("sessions.report_session")
                    }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>
        </div>
      </div>
      <div class="centered-wrapper">
        <div class="organized-by">
          <span class="title">{{ $t("sessions.session_organized_by") }} :</span>
          <q-skeleton class="pp-medium" v-if="isPPLoading" />
          <q-skeleton class="username username-skeleton" v-if="isDataLoading" />
          <img class="pp-medium" :src="cloudfrontUrlPP + sessionInfo?.createdBy.profilePicture" v-show="!isPPLoading" v-if="!isDataLoading" :onload="(isPPLoading = false)" @click="goToUser(sessionInfo.createdBy.id)" />
          <span class="username" v-if="!isDataLoading">
            {{
            sessionInfo.createdBy.username
            }}
          </span>
        </div>
        <div class="date-time-wrapper">
          <DateTime :loading="true" v-if="isDataLoading" />
          <DateTime :date="sessionInfo.date" :loading="false" v-if="!isDataLoading" />
        </div>

        <!--25juin 19h27-->
        <q-skeleton class="description-skeleton" v-if="isDataLoading" />
        <div v-if="sessionInfo.description !== ''" class="description">{{ sessionInfo.description }}</div>
        <div class="buttons">
          <q-btn v-if="!isOrganisator && !sessionInfo.passed" class="button" :label="
              isParticipating
                ? $t('sessions.not_joining_anymore')
                : $t('sessions.join_session')
            " :no-caps="true" color="primary" @click="isParticipating ? quitSession() : joinSession()" :disabled="!isParticipating && isSessionFull" :loading="participatingLoading" />
          <q-btn class="button" :label="$t('sessions.see_spot_detail')" :no-caps="true" color="primary" @click="goToSpotDetail" />
          <q-btn class="button" :label="$t('sessions.share_session')" :no-caps="true" color="primary" @click="shareSession" icon="share" />
        </div>

        <div class="participants detail-section">
          <div class="small-title">
            {{ $t("sessions.participants") }}
            <span v-if="sessionInfo.maxParticipants">
              ({{
              sessionInfo.maxParticipants - sessionInfo.participants.length
              }}
              {{ $t("sessions.available_seats_left") }})
            </span>
            :
          </div>

          <div class="participant-list" v-if="isDataLoading">
            <div class="participant" v-for="i in [1, 2, 3]" :key="i">
              <q-skeleton class="participant-pp" />
              <q-skeleton class="participant-username-skeleton" />
            </div>
          </div>
          <div class="participant-list" v-if="!isDataLoading">
            <div class="no-participant" v-if="sessionInfo.participants.length === 0">{{ $t("sessions.no_participant_yet") }}</div>
            <div class="participant" v-for="participant in sessionInfo.participants" :key="participant" @click="goToUser(participant.id)">
              <img class="participant-pp" :src="cloudfrontUrlPP + participant.profilePicture" v-show="!participant.isPPLoading" :onload="(participant.isPPLoading = false)" />
              <span>{{ participant.username }}</span>
            </div>
          </div>
        </div>
        <div class="comments detail-section">
          <div class="small-title" v-if="
              sessionInfo.comments !== undefined &&
              sessionInfo.comments.length !== 0
            ">{{ $t("spots.comments") }} :</div>
          <q-skeleton class="comment" v-if="isDataLoading" />
          <q-skeleton class="comment" v-if="isDataLoading" />
          <Comment v-for="comment in sessionInfo.comments" :key="comment" :comment="comment"></Comment>
          <div class="leave-comment">
            {{ $t("sessions.leave_comment") }}
            <span class="clarification">({{ $t("sessions.about_the_session") }})</span>
            <q-input autogrow outlined bottom-slots v-model="userComment" class="comment-input">
              <template v-slot:after>
                <q-btn round dense flat icon="send" :loading="arrowLoading" @click="sendComment" />
              </template>
            </q-input>
          </div>
        </div>
      </div>
      <q-dialog class="bottom-sheet big" v-model="spotDetailDialog" position="bottom">
        <SpotDetail :spotId="sessionInfo.spot.id" @close-clicked="spotDetailDialog = false" />
      </q-dialog>
    </div>
  </q-dialog>
</template>
<script>
import Comment from 'components/others/Comment'
import { removeTimeZone, dateToCleanISO, notify } from 'src/boot/helpers'
import { defineComponent } from 'vue'
import { defineAsyncComponent } from 'vue'
import DateTime from 'components/sessions/DateTime'
import { mapGetters } from 'vuex'

export default defineComponent({
  components: {
    Comment,
    DateTime,
    //prevents circular references (SpotDetail and SessionDetail)
    SpotDetail: defineAsyncComponent(() =>
      import('components/spots/SpotDetail.vue')
    ),
  },
  props: [],
  data() {
    return {
      isDataLoading: true,
      isPPLoading: true,
      isParticipating: false,
      isOrganisator: true,
      arrowLoading: false,
      cloudfrontUrlPP:
        'https://d1tqac1zek46ma.cloudfront.net/profile_pictures/',
      sessionInfo: {},
      userComment: '',
      spotDetailDialog: false,
      displayedSpot: null,
      now: null,
      participatingLoading: false,
      opened: false,
      sessionId: null,
    }
  },
  created() {
    this.now = dateToCleanISO(new Date())
  },
  computed: {
    ...mapGetters(['sessions/getClickedSessionId']),
    clickedSessionId() {
      return this['sessions/getClickedSessionId']
    },
    isSessionFull() {
      return (
        this.sessionInfo.participants &&
        this.sessionInfo.maxParticipants ===
          this.sessionInfo.participants.length
      )
    },
  },
  watch: {
    clickedSessionId(newVal) {
      if (newVal) {
        this.sessionId = newVal
        this.opened = true
        this.getSessionInfo()
        this.$store.commit('sessions/setClickedSessionId', null)
      }
    },
  },
  methods: {
    close() {
      this.opened = false
      this.sessionInfo = {}
      this.isDataLoading = true
      this.isPPLoading = true
      this.isParticipating = false
    },
    shareSession() {
      this.$store.commit('conversations/setSharedSessionId', this.sessionId)
    },
    getSessionInfo() {
      this.$store
        .dispatch('sessions/getSessionDetail', {
          sessionId: this.sessionId,
          brief: false,
        })
        .then((data) => {
          this.sessionInfo = data
          this.sessionInfo.passed =
            new Date(this.now) > new Date(removeTimeZone(this.sessionInfo.date))
          this.sessionInfo.participants.forEach((participant) => {
            if (participant.username === localStorage.getItem('username')) {
              this.isParticipating = true
            }
            participant.isPPLoading = true
          })
          this.sessionInfo.createdBy.username ===
          localStorage.getItem('username')
            ? (this.isOrganisator = true)
            : (this.isOrganisator = false)
          this.isDataLoading = false
        })
    },
    goToUser(userId) {
      this.$store.commit('user/setClickedUserId', userId)
    },
    joinSession() {
      this.participatingLoading = true
      this.$store
        .dispatch('sessions/joinSession', {
          sessionId: this.sessionId,
        })
        .then(() => {
          this.sessionInfo.participants.push({
            username: localStorage.getItem('username'),
            profilePicture: localStorage.getItem('userPP'),
          })
          this.participatingLoading = false
          this.isParticipating = true
        })
        .catch((e) => {
          this.participatingLoading = false
          notify(e.errors)
        })
    },
    quitSession() {
      this.participatingLoading = true
      this.$store
        .dispatch('sessions/quitSession', {
          sessionId: this.sessionId,
        })
        .then(() => {
          this.sessionInfo.participants.forEach((participant, i) => {
            if (participant.username === localStorage.getItem('username')) {
              this.sessionInfo.participants.splice(i, 1)
            }
          })
          this.isParticipating = false
          this.participatingLoading = false
        })
    },
    sendComment() {
      if (this.userComment.length < 2) {
        return
      }
      this.arrowLoading = true
      this.$store
        .dispatch('sessions/sendComment', {
          comment: {
            session: {
              id: Number(this.sessionId),
            },
            content: this.userComment,
          },
        })
        .then((data) => {
          this.arrowLoading = false
          this.sessionInfo.comments.push(data.comment)
          this.userComment = ''
        })
      //this.$store.commit("setLoading", false);
    },
    goToSpotDetail() {
      this.displayedSpot = this.sessionInfo.spot
      this.spotDetailDialog = true
    },
  },
})
</script>

<style lang="scss" scoped>
$spot-name-height: 45px;

.session-detail-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  .centered-wrapper {
    width: 95vw;
    .spot-name {
      font-size: 2em;
      min-height: $spot-name-height;
    }
    .organized-by {
      display: flex;
      flex-direction: column;
      align-items: center;
      .username-skeleton {
        margin-top: 5px;
        width: 100px;
        height: 20px;
      }
      .title {
        font-size: 1.4em;
        margin-bottom: 10px;
      }
      .pp {
        width: 75px;
        height: 75px;
        border-radius: 100px;
      }
    }
    .date-time-wrapper {
      display: flex;
      justify-content: center;
    }

    .description {
      margin-top: 15px;
      text-align: justify;
    }
    .description-skeleton {
      width: 100%;
      margin-bottom: 2px;
      margin-top: 5px;
    }

    .join-session {
      margin: 20px;
    }

    .participants {
      display: inline;
      flex-direction: column;
      align-items: center;
      .participant-list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        .participant {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 12px;
        }

        span {
          font-size: 0.8em;
        }
      }
    }
    .participant-pp {
      width: 75px;
      height: 75px;
      border-radius: 100px;
    }
    .participant-username-skeleton {
      width: 75px;
      height: 15px;
      margin-top: 3px;
    }
    .buttons {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      margin-top: 10px;
      width: 100%;
      .button {
        margin: 5px;
      }
    }
    .comments {
      margin-top: 15px;
    }
  }
}
</style>
