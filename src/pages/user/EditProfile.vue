<template>
  <div class="main-wrapper" v-show="!isCropping">
    <div class="actions">
      <img class="cancel" src="svg/cancel.svg" @click="$router.push('profile')" />
      <img class="validate" src="svg/validate.svg" @click="submitEditedUser" />
    </div>
    <q-skeleton class="pp-big" v-if="isPPLoading" />
    <img class="pp-big" v-if="newPP === null && !isDataLoading" v-show="!isPPLoading" :onload="(isPPLoading = false)" :src="cloudfrontUrlPP + editedUser?.profilePicture" />
    <img class="pp-big" v-if="newCroppedPP !== null" :src="newPP" />
    <div @click="pictureUpload" class="change-pp">{{ $t("account.change_pp") }}</div>
    <input id="pictures-upload" type="file" accept="image/*" name="pictures" @change="updatePP" hidden />
    <q-btn color="primary" :label="$t('account.edit_favorite_sports')" :no-caps="true" @click="favoriteSportsDialog = true" />
    <q-dialog class="picker-popup" v-model="favoriteSportsDialog" style="z-index: 999999">
      <SportsPicker :alreadySelected="editedUser.favoriteSports" :updateFavorites="true" @sports-selected="updatedFavoriteSports" />
    </q-dialog>
    <div v-if="!isDataLoading && !isCropping" class="favorite-sports">
      <SportBadge v-for="sportId in editedUser.favoriteSports" :key="sportId" :sportId="sportId" />
    </div>
    <Input autogrow class="input bio" :label="$t('account.bio')" v-model="editedUser.bio" />
    <!--
    <Input
      class="input"
      :label="$t('account.username')"
      v-model="editedUser.username"
    ></Input>
    -->
  </div>
  <div v-if="isCropping" class="cropper-wrapper main-wrapper">
    <vue-cropper class="cropper" ref="cropper" :aspect-ratio="1" :src="newPP" />
    <div class="actions">
      <img class="validate" src="svg/validate.svg" @click="cropImage" />
    </div>
  </div>
</template> 

<script charset="utf-8">
import SportBadge from 'components/sports/SportBadge'
import Input from 'components/form/Input'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import SportsPicker from 'components/sports/SportsPicker'

export default {
  components: {
    Input,
    VueCropper,
    SportsPicker,
    SportBadge,
  },
  data() {
    return {
      showCropper: true,
      isPPLoading: true,
      isDataLoading: true,
      isCropping: false,
      cloudfrontUrlPP:
        'https://d1tqac1zek46ma.cloudfront.net/profile_pictures/',
      user: null, //générer une image random à la création du compte qui sera par défaut si elle n'est pas changée, voir vidéo de fireship sur le sujet
      editedUser: {
        username: '',
      },
      newPP: null,
      newPPFile: null,
      newCroppedPP: null,
      newCroppedPPFile: null,
      favoriteSportsDialog: false,
    }
  },
  beforeCreate() {
    this.$store.commit('setLoading', true)
    this.$store
      .dispatch('user/getUser')
      .then((data) => {
        this.user = data.user
        this.editedUser = { ...this.user }
        this.$store.commit('setLoading', false)
        this.isDataLoading = false
      })
      .catch((e) => {
        this.$store.commit('setLoading', false)
        //this.$router.push("register-login");
      })
  },
  methods: {
    updatedFavoriteSports(newSports) {
      this.editedUser.favoriteSports = newSports
      this.favoriteSportsDialog = false
    },
    cropImage() {
      this.newCroppedPP = this.$refs.cropper.getCroppedCanvas()
      var that = this
      this.newCroppedPP.toBlob(function (blob) {
        that.newPP = URL.createObjectURL(blob)
        that.newCroppedPPFile = blob
      })
      this.isCropping = false
    },
    pictureUpload() {
      document.getElementById('pictures-upload').click()
    },
    updatePP(event) {
      this.newPPFile = event.target.files[0]
      this.newPP = URL.createObjectURL(event.target.files[0])
      this.updatedPP = true
      this.isCropping = true
    },
    submitEditedUser() {
      this.$store.commit('setLoading', true)
      this.$store
        .dispatch('user/editUser', {
          favoriteSports: this.editedUser.favoriteSports,
          bio: this.editedUser.bio,
        })
        .then(() => {
          if (this.newPP === null) {
            this.$store.commit('setLoading', false)
            this.$router.go(-1)
          } else {
            this.submitPicture()
          }
        })
    },
    submitPicture() {
      if (this.newCroppedPP !== null) {
        return new Promise((resolve, reject) => {
          let pictureExtension = this.newPPFile.name.split('.').pop()
          let pictureName =
            ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
              (
                c ^
                (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
              ).toString(16)
            ) +
            '.' +
            pictureExtension
          this.$store
            .dispatch('user/requestProfilePictureLink', {
              pictureName: pictureName,
            })
            .then((response) => {
              var renamedPicture = new File(
                [this.newCroppedPPFile],
                pictureName,
                {
                  type: this.newPPFile.type,
                }
              )
              this.$store
                .dispatch('user/sendProfilePicture', {
                  renamedPicture: renamedPicture,
                  url: response.url,
                })
                .then((response) => {
                  this.$store.dispatch('user/saveProfilePicture', {
                    pictureName: pictureName,
                  })
                })
                .then((response) => {
                  this.$store.commit('setProfilePicture', pictureName)
                  resolve(response)
                })
            })
        })
          .then(() => {
            this.$store.commit('setLoading', false)
            this.$router.push('profile')
          })
          .catch((error) => {})
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@use '../../css/mixins.scss';
.main-wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: var(--page-height);
  background: $background-gradient;
}
.cropper-wrapper {
  height: var(--page-height);
  .cropper {
    max-height: 70vh;
  }
  .actions {
    justify-content: space-around;
    img {
      @include mixins.elevated-box;
      padding: 10px;
      border-radius: 15px;
      width: 45px;
    }
  }
}

.actions {
  display: flex;
  justify-content: space-between;
  width: 100vw;
  img {
    padding: 5px;
    margin: 7px;
    margin-bottom: 0px;
  }
  .cancel {
    width: 30px;
  }
  .validate {
    width: 35px;
  }
}
.input {
  margin-top: 10px;
  margin-bottom: 10px;
  &.bio {
    width: 90vw;
  }
}
.change-pp {
  color: blue;
  font-size: 0.8em;
  margin-top: 4px;
  margin-bottom: 15px;
}
.favorite-sports {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;
  .sport-badge {
    margin: 3px;
  }
}
</style>
