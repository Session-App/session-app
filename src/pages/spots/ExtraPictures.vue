<template>
  <div class="main-wrapper">
    <div class="page-title">{{ $t("extra_pictures.add_pictures") }}</div>
    <div class="form">
      <input id="pictures-upload" type="file" accept="image/*" name="pictures" @change="addPictures" multiple hidden />
      <div v-if="picsPreview[0] !== undefined" class="added-pics">
        <img v-for="picture in picsPreview" :key="picture" :src="picture" />
      </div>
      <q-btn class="pictures-upload" label-color="black" standout="bg-blue-1" input-style="color:black" :label="$t('form.add_pictures', [10-parseInt($route.query.amountAlreadyAdded)])" color="primary" @click="pictureUpload" icon="img:svg/pictures.svg" no-caps />
      <q-btn class="submit-button" label-color="black" standout="bg-blue-1" input-style="color:black" :label="$t('extra_pictures.send')" color="primary" @click="sendPictures" no-caps />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pictures: [],
      picsPreview: [],
      picturesSent: 0,
    }
  },
  methods: {
    pictureUpload() {
      document.getElementById('pictures-upload').click()
    },
    addPictures(event) {
      this.pictures = event.target.files
      this.picsPreview = []
      for (let i = 0; i < this.pictures.length; i++) {
        this.picsPreview.push(URL.createObjectURL(event.target.files[i]))
      }
    },
    sendPictures() {
      if (this.pictures !== []) {
        this.$store.commit('setLoading', true)
        return new Promise((resolve, reject) => {
          for (let i = 0; i < this.pictures.length; i++) {
            let pictureExtension = this.pictures[i].name.split('.').pop()
            let pictureName =
              ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
                (
                  c ^
                  (crypto.getRandomValues(new Uint8Array(1))[0] &
                    (15 >> (c / 4)))
                ).toString(16)
              ) +
              +new Date()
                .toISOString()
                .slice(0, 19)
                .replace(/:/g, '-')
                .replace(/\s+/g, '') +
              '.' +
              pictureExtension
            this.$store
              .dispatch('spots/requestLink', {
                pictureName: pictureName,
                sportId: this.$route.query.sportId,
              })
              .then((response) => {
                var renamedPicture = new File([this.pictures[i]], pictureName, {
                  type: this.pictures[i].type,
                })
                this.$store
                  .dispatch('spots/sendPicture', {
                    renamedPicture: renamedPicture,
                    url: response.url,
                  })
                  .then(() => {
                    this.$store.dispatch('spots/savePicture', {
                      spotId: this.$route.query.spotId,
                      pictureName: pictureName,
                    })
                  })
                  .then(() => {
                    this.picturesSent++
                    if (this.picturesSent === this.pictures.length) {
                      this.$store.commit('setLoading', false)
                      this.$router.push({
                        name: 'thank-you',
                        query: {
                          reason: 'extra_pictures',
                          spotId: this.$route.query.spotId,
                          sportId: this.$route.query.sportId,
                        },
                      })
                    }
                  })
              })
          }
        }).catch((error) => {})
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.main-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: var(--page-height);
  overflow-y: scroll;
}
.form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .input {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .description {
    width: 80vw;
  }
}

.pictures-upload {
  margin: 20px;
}
.added-pics {
  display: block;
  text-align: center;
  background-color: $light-grey;
  border-radius: 14px;
  padding: 7px;
  width: 95vw;
  img {
    width: 40vw;
    margin: 5px;
    border-radius: 14px;
  }
}

#map {
  height: 400px;
  width: 90vw;
  border-radius: 15px;
  margin-bottom: 15px;
}
.thanks {
  text-align: center;
  margin-top: 25vh;
  font-size: 1.3em;
}
.submit-button {
  margin-bottom: 20px;
}
</style>
