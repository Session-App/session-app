<template>
  <div class="spot-detail-wrapper" id="spot-detail">
    <div v-if="!carouselFullscreen" class="top-buttons">
      <div class="close-bottom-sheet" @click="adKey += 1 && $emit('close-clicked')">
        <img src="svg/close.svg" />
      </div>
      <div class="three-dots">
        <div>
          <img class="three-dots-button" src="svg/three-dots.svg" />
          <q-menu>
            <q-list class="three-dots-options">
              <q-item clickable v-close-popup @click="reportSpot">
                <img class="option" src="svg/report.svg" />
                <q-item-section>{{ $t('spots.report_spot') }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
      </div>
    </div>
    <div class="centered-wrapper">
      <div class="spot-name-wrapper">
        <q-skeleton class="spot-name-skeleton" v-if="isDataLoading" />
        <div v-if="!carouselFullscreen" class="spot-name">{{ spotInfo.name }}</div>
      </div>
      <div v-if="spotInfo.pictures?.length === 0" class="no-pics" @click="addPictures">
        <img src="svg/add-pictures.svg" class="carousel" />
        <span>{{ $t('spots.no_pics_yet') }}</span>
      </div>
      <q-skeleton class="picture-skeleton" v-if="isDataLoading" />
    </div>
    <img src="svg/close.svg" class="close-fullscreen-carousel invert" v-if="carouselFullscreen" @click.prevent="carouselFullscreen = false" />
    <q-carousel animated v-model="slide" swipeable :navigation="spotInfo.pictures.length > 1" control-color="primary" infinite transition-prev="slide-right" transition-next="slide-left" :class="carouselFullscreen ? 'fullscreen-carousel' : 'small-carousel'" @click="switchCarousel" height="auto" v-if="!isDataLoading">
      <q-carousel-slide v-for="(picture, i) in spotInfo.pictures" :key="picture.id" :name="i" class="carousel-slide">
        <q-img :class="carouselFullscreen ? 'fullscreen-picture' : 'small-picture'" :src="`${cloudFrontUrl}/${picture.name}`" no-transition />
      </q-carousel-slide>
      <q-carousel-slide name="add-more" class="carousel-slide add-more-pictures" @click.prevent="addPictures">
        <q-img class="small-picture add-more-pictures-img" src="svg/add-pictures.svg" no-transition />
      </q-carousel-slide>
    </q-carousel>
    <div class="centered-wrapper">
      <div v-if="!carouselFullscreen" class="tags-section detail-section">
        <q-dialog class="tag-picker" v-model="tagPicker" v-if="!isDataLoading">
          <TagPicker :tags="$i18n.messages[lang].filters[spotInfo.sport]" :selectedTags="[]" @cancel-clicked="tagPicker = false" @validate-clicked="sendTags"></TagPicker>
        </q-dialog>
        <div class="tags" v-if="isDataLoading">
          <TagBadge v-for="i in [1, 2, 3]" :key="i" :loading="true" />
        </div>
        <div class="tags" v-if="!isDataLoading && spotInfo.tags.length !== 0">
          <TagBadge v-for="tag in spotInfo.tags" :key="tag" :tagId="tag" :sportId="spotInfo.sport" />
        </div>
        <div class="no-tags" v-if="!isDataLoading && spotInfo.tags.length === 0">
          <span>{{ $t('spots.no_tags') }}</span>
          <q-btn color="primary" :no-caps="true" class="add-tags-button" @click="tagPicker = true">{{ $t('spots.add_tags') }}</q-btn>
        </div>
      </div>
      <div class="quick-actions detail-section" v-if="!carouselFullscreen">
        <div class="action" @click="editFavorite">
          <q-btn flat :loading="editingFavorite">
            <img :src="
                isFavorite
                  ? 'svg/star-favorite-filled.svg'
                  : 'svg/star-favorite-outline.svg'
              " />
          </q-btn>
          <div class="action-name">{{ $t('spots.add_favorite_spot') }}</div>
        </div>
        <!--
        <div class="action" @click="copyToClipboard('baseDomain/spot/spotId')">
          <q-btn flat>
            <img src="svg/share.svg" />
          </q-btn>
          <div class="action-name">{{ $t("spots.share_spot") }}</div>
        </div>
        -->
      </div>
      <div v-if="!carouselFullscreen" class="description detail-section">
        {{
        spotInfo.description === ''
        ? $t('spots.no_description')
        : spotInfo.description
        }}
        <q-skeleton class="description-skeleton" v-if="isDataLoading" />
      </div>
      <div v-if="!carouselFullscreen" class="buttons">
        <div class="itinerary">
          <a :href="gMapsDirectionUrl + spotInfo.lat + ',' + spotInfo.lon" target="_blank">
            <q-btn class="button" color="white" text-color="black" :no-caps="true" :label="$t('spots.itinerary')" icon="img:svg/itinerary.svg" />
          </a>
        </div>
        <div class="coordinates">
          <q-btn class="button" color="white" :no-caps="true" text-color="black" :label="$t('spots.coordinates')" icon="img:svg/pin.svg" @click="copyToClipboard(spotInfo.lat + ', ' + spotInfo.lon)" />
          <transition enter-active-class="animated fadeIn">
            <div class="copied" v-if="coordinatesCopied">{{ $t('spots.coordinates_copied') }}</div>
          </transition>
        </div>
      </div>
      <div class="upcoming-sessions detail-section" v-if="!carouselFullscreen">
        <q-btn class="button" :no-caps="true" color="primary" :label="$t('spots.display_upcoming_sessions')" @click="displaySessions" v-if="upcomingSessions === null" :loading="sessionsLoading ? true : false" />
        <div class="no-session" v-if="upcomingSessions !== null && upcomingSessions.length === 0">{{ $t('spots.no_upcoming_sessions') }}</div>
        <div class="dates" v-if="upcomingSessions !== null">
          <DateTime v-for="session in upcomingSessions" :key="session" :date="session.date" @click="displaySession(session)" />
        </div>
        <q-btn :no-caps="true" color="primary" :label="$t('sessions.set_a_session')" v-if="upcomingSessions !== null && upcomingSessions.length === 0" @click="goToNewSession" />
        <q-btn :no-caps="true" color="primary" :label="$t('spots.set_a_new_session')" v-if="upcomingSessions !== null && upcomingSessions.length > 0" @click="goToNewSession" />
      </div>
      <div class="added-by detail-section" v-if="!carouselFullscreen">
        <div class="small-title" v-if="
            !isDataLoading &&
            spotInfo.addedBy !== null &&
            spotInfo.addedBy.id !== 1
          ">{{ $t('spots.added_by') }} :</div>
        <div v-if="isDataLoading" class="user-info">
          <q-skeleton class="pp-small" />
          <q-skeleton class="added-by-username-skeleton" />
        </div>
        <div v-if="
            !isDataLoading &&
            spotInfo.addedBy !== null &&
            spotInfo.addedBy.id !== 1
          " class="user-info">
          <img class="pp-small" :src="cloudfrontUrlPP + spotInfo.addedBy.profilePicture" @click="goToUser(spotInfo.addedBy.id)" />
          <span>{{ spotInfo.addedBy.username }}</span>
        </div>
      </div>
      <div v-if="!carouselFullscreen" class="comments detail-section">
        <div class="small-title" v-if="
            spotInfo.comments !== undefined && spotInfo.comments.length !== 0
          ">{{ $t('spots.comments') }} :</div>
        <q-skeleton class="comment" v-if="isDataLoading" />
        <q-skeleton class="comment" v-if="isDataLoading" />
        <Comment v-for="comment in spotInfo.comments" :key="comment" :comment="comment" />
        <div class="leave-comment">
          {{ $t('spots.leave_comment') }}
          <span class="clarification">({{ $t('spots.about_the_spot') }})</span>

          <q-input autogrow outlined bottom-slots v-model="userComment" class="comment-input">
            <template v-slot:after>
              <q-btn round dense flat icon="send" :loading="arrowLoading" @click="sendComment" />
            </template>
          </q-input>
        </div>
      </div>
    </div>
    <!-- <Ad @ad-size="changeAdBannerHeight" /> -->
  </div>
</template>
<script>
import { Clipboard } from '@capacitor/clipboard'
import { ref } from 'vue'
import { defineComponent } from 'vue'
import { dateToCleanISO } from 'boot/helpers'
import Comment from 'components/others/Comment'
import DateTime from 'components/sessions/DateTime'
import TagPicker from 'components/spots/TagPicker'
import TagBadge from 'components/spots/TagBadge'
// import Ad from 'components/others/Ad'

export default defineComponent({
  components: {
    DateTime,
    Comment,
    TagPicker,
    TagBadge,
    // Ad,
  },
  props: ['spotId'],
  setup() {
    const splide = ref()
    return {
      splide,
    }
  },
  data() {
    return {
      admobBannerHeight: '0px',
      admobHeight: '0px',
      slide: 0,
      isDataLoading: true,
      arePicturesLoading: true,
      loadedPictures: 0,
      coordinatesCopied: false,
      cloudfrontUrlPP:
        'https://d1tqac1zek46ma.cloudfront.net/profile_pictures/',
      gMapsDirectionUrl: 'https://www.google.com/maps/dir/?api=1&destination=',
      spotInfo: {},
      isFavorite: false,
      editingFavorite: false,
      userComment: '',
      carouselFullscreen: false,
      arrowLoading: false,
      upcomingSessions: null,
      sessionsLoading: false,
      displayedSession: null,
      tagPicker: false,
      lang: '',
      reportPopup: false,
    }
  },
  created() {
    this.$store
      .dispatch('spots/getSpotDetail', {
        spotId: this.spotId,
      })
      .then((data) => {
        this.spotInfo = data.spot
        this.isFavorite = data.fav
        this.isDataLoading = false
        // if some pictures are not validated, an object is returned instead of an array by the backend
        if (this.spotInfo.pictures.length === undefined) {
          this.spotInfo.pictures = Object.values(this.spotInfo.pictures)
        }
        if (this.spotInfo.pictures.length === 0) {
          this.arePicturesLoading = false
        }
      })
    this.lang = localStorage.getItem('lang')
  },
  computed: {
    cloudFrontUrl() {
      return (
        'https://d1tqac1zek46ma.cloudfront.net/spots_' + this.spotInfo.sport
      )
    },
  },
  methods: {
    reportSpot() {
      this.$store.commit('user/setReportedEntity', {
        entityId: this.spotId,
        entityName: 'Spot',
      })
    },
    // changeAdBannerHeight(adSize) {
    //   this.admobBannerHeight = adSize.height + 'px'
    //   this.admobHeight = adSize.height + 'px'
    // },
    sendTags(tags) {
      this.$store
        .dispatch('spots/sendTags', {
          tags: tags,
          spotId: this.spotId,
        })
        .then(() => {
          this.spotInfo.tags = tags
          this.tagPicker = false
          this.$q.notify({
            message: this.$t('notification.tags_added_thanks'),
            color: 'green-3',
          })
        })
    },
    editFavorite() {
      this.editingFavorite = true
      this.$store
        .dispatch('spots/editFavorite', {
          spotId: this.spotId,
          action: this.isFavorite ? 'remove' : 'add',
        })
        .then(() => {
          this.isFavorite = !this.isFavorite
          this.editingFavorite = false
          this.$q.notify({
            message: this.$t(
              this.isFavorite
                ? 'notification.spot_added_favorite'
                : 'notification.spot_removed_favorite',
              [this.spotInfo.name]
            ),
            color: 'green-3',
            timeout: 2500,
          })
        })
    },
    displaySession(session) {
      this.displayedSession = session
      this.$store.commit('sessions/setClickedSessionId', session.id)
    },
    goToUser(userId) {
      this.$store.commit('user/setClickedUserId', userId)
    },
    copyToClipboard(text) {
      Clipboard.write({
        string: text,
      })

      coordinatesCopied = true
    },
    switchCarousel() {
      if (this.carouselFullscreen) {
        this.admobBannerHeight = this.admobHeight
      } else {
        this.admobBannerHeight = '0px'
      }
      this.carouselFullscreen = !this.carouselFullscreen
    },
    displaySessions() {
      this.sessionsLoading = true
      var now = dateToCleanISO(new Date())
      this.$store
        .dispatch('spots/getSpotSessions', {
          spotId: this.spotId,
          period: {
            from: now,
            to: null,
          },
        })
        .then((response) => {
          this.upcomingSessions = response
          this.sessionsLoading = false
        })
        .catch((error) => {
          this.$q.notify(this.$t('notification.error_happened'))
        })
    },
    sendComment() {
      if (this.userComment.length < 2) {
        return
      }
      this.arrowLoading = true
      this.$store
        .dispatch('spots/sendComment', {
          comment: {
            spot: {
              id: this.spotId,
            },
            content: this.userComment,
          },
        })
        .then((data) => {
          //this.$router.go(0);
          this.arrowLoading = false
          this.spotInfo.comments.push(data.comment)
          this.userComment = ''
        })
      //this.$store.commit("setLoading", false);
    },
    pictureLoaded() {
      this.loadedPictures++
      if (this.loadedPictures === this.spotInfo.pictures.length) {
        this.arePicturesLoading = false
      }
    },
    addPictures() {
      this.$router.push({
        name: 'extra-pictures',
        query: {
          sportId: this.spotInfo.sport,
          spotId: this.spotId,
          amountAlreadyAdded: this.spotInfo.pictures.length,
        },
      })
    },
    goToNewSession() {
      this.$router.push({
        name: 'add-session',
        query: {
          sportId: this.spotInfo.sport,
          spotId: this.spotId,
          comingFromSpotLon: this.spotInfo.lon,
          comingFromSpotLat: this.spotInfo.lat,
          spotName: this.spotInfo.name,
        },
      })
    },
  },
})
</script>

<style lang="scss" scoped>
@use '../../css/mixins.scss';
$carousel-border-radius: 20px;
$carousel-width: 95vw;
$carousel-height: 300px;
$spot-name-height: 30px;

.spot-detail-wrapper {
  max-height: 100%;
  padding-bottom: calc(v-bind('admobBannerHeight') - 10px);

  .carousel-slide {
    padding: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    &.add-more-pictures {
      display: flex;
      width: 100%;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .q-img {
        width: 150px;
      }
    }
  }
  .fullscreen-carousel {
    height: 95vh !important;
    background-color: black;
    margin-top: -10px;
    overflow-y: hidden;
  }
  .fullscreen-picture {
    width: 100vw;
  }
  .close-fullscreen-carousel {
    width: 15px;
    position: fixed;
    z-index: 99;
    top: 6.5vh;
    left: 10px;
  }
  .small-carousel {
    margin-left: 2.5vw;
  }
  .small-picture {
    max-width: $carousel-width;
    height: $carousel-height;
  }
  .slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .centered-wrapper {
    width: 95vw;
    margin-left: 2.5vw;
    .three-dots {
      margin-right: 0px;
    }
    .spot-name-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 10px;
      .spot-name {
        font-size: 1.8em;
        min-height: $spot-name-height;
        text-align: center;
      }
      .spot-name-skeleton {
        width: 50vw;
        height: $spot-name-height;
        margin-top: 10px;
        margin-bottom: 10px;
      }
    }

    .picture-skeleton {
      height: $carousel-height;
      width: $carousel-width;
      border-radius: $carousel-border-radius;
    }
    .no-pics {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: $carousel-width;
      height: $carousel-height;
      padding: 20px;
      border-radius: $carousel-border-radius;
      @include mixins.elevated-box;
      img {
        width: 70px;
        margin-bottom: 20px;
      }
    }
    .added-by {
      margin-bottom: 20px;
      margin-top: 25px;
      .user-info {
        margin-top: -15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .added-by-username-skeleton {
          margin-top: 5px;
          height: 15px;
          width: 100px;
        }
      }
    }
    .upcoming-sessions {
      text-align: center;
      margin-top: 25px;
      .dates {
        display: flex;
        justify-content: center;
      }
      .no-session {
        margin-bottom: 10px;
      }
    }

    .description {
      margin-bottom: 0px;
      margin-top: 15px;
      text-align: justify;
      .description-skeleton {
        width: 100%;
        height: 15px;
      }
    }
    .quick-actions {
      margin-top: 15px;
      display: flex;
      justify-content: space-around;
      margin-right: 15vw;
      margin-left: 15vw;
      .action {
        font-size: 0.8em;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
          width: 25px;
        }
      }
    }
    .tags-section {
      margin-top: 10px;
      .tags {
        margin-top: -5px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }
      .no-tags {
        display: flex;
        flex-direction: column;
        align-items: center;
        .add-tags-button {
          margin-top: 10px;
        }
      }
    }
    .buttons {
      margin-top: 20px;
      display: flex;
      justify-content: space-around;
      .copied {
        text-align: center;
        margin-top: 5px;
        margin-bottom: -25px;
        font-size: 0.9em;
        color: green;
      }
      a {
        text-decoration: none;
      }
    }
    .dates {
      margin-top: -7px;
      margin-bottom: 7px;
      .date {
        background-color: $primary;
      }
    }
  }
}
</style>
<style lang="scss">
#spot-detail {
  .add-more-pictures-img {
    img {
      border-radius: 0px !important;
    }
  }
}
</style>