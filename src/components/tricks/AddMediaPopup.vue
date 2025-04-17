<template>
  <div class="add-media popup">
    <q-btn no-caps color="primary" :label="$t('tricks.select_media')" @click="clickInput" v-if="!mediaPreview" />
    <input id="media-upload" type="file" :accept="mediaType === 'image' ? 'image/*' : 'video/*'" name="pictures" @change="loadMedia" hidden />
    <!-- <vue-cropper v-if="mediaPreview && mediaType === 'image'" class="image-cropper" ref="image-cropper" :src="mediaPreview" /> -->
    <img v-if="mediaPreview && mediaType === 'image'" class="image-preview" :src="mediaPreview" />
    <VideoTrimmer v-if="mediaPreview && mediaType === 'video'" :originalVideo="media" @video-too-long="videoTooLong" />
    <q-btn no-caps color="primary" :label="$t('tricks.send_media')" @click="uploadMedia" v-if="mediaPreview" class="send-media" :loading="sendingMedia" />
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import VideoTrimmer from 'components/tricks/VideoTrimmer'
import { notify } from 'src/boot/helpers'

export default defineComponent({
  name: 'AddMediaPopup',
  components: { VideoTrimmer },
  props: {
    trickId: { type: Number },
    mediaType: { type: String },
  },
  data() {
    return {
      media: null,
      mediaPreview: null,
      sendingMedia: false,
    }
  },
  created() {},
  methods: {
    uploadMedia() {
      if (!this.sendingMedia) {
        this.$store
          .dispatch('tricks/getMediaUploadLink', { type: this.mediaType })
          .then((data) => {
            if (this.mediaType === 'image') {
              let renamedMedia = new File([this.media], data.filename, {
                type: this.media.type,
              })
              this.$store
                .dispatch('tricks/uploadMedia', {
                  url: data.url,
                  media: renamedMedia,
                  type: this.mediaType,
                })
                .then(() => {
                  this.sendingMedia = false
                })
            }
          })
      }
    },
    videoTooLong() {
      this.media = null
      this.mediaPreview = null
      notify(['video_too_long'])
    },
    clickInput() {
      document.getElementById('media-upload').click()
    },
    loadMedia(event) {
      this.media = event.target.files[0]
      this.mediaPreview = URL.createObjectURL(event.target.files[0])
    },
  },
})
</script>
<style lang="scss" scoped>
.add-media {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 95vw;
  .image-preview {
    width: 100% !important;
    max-height: 70vh !important;
    border-radius: 15px;
  }
  .send-media {
    margin-top: 10px;
  }
}
</style>
