<template>
  <div class="video-trimmer">
    <div class="video-container">
      <video
        class="video-preview"
        ref="videoPreview"
        :src="videoPreview"
        @loadedmetadata="videoLoaded"
        autoplay
        loop
      ></video>
    </div>
    <div class="thumbnails-container">
      <!-- <span v-if="!thumbnailsGenerated">{{$t('tricks.generating_thumbnails')}}</span> -->
      <div class="video-thumbnails" ref="videoThumbnails">
        <img
          v-for="thumb in videoThumbnails"
          :key="thumb"
          :src="thumb"
          class="thumbnail"
        />
      </div>
    </div>
    <q-range
      class="range-trimmer"
      v-model="trimmedValues"
      @change="videoTrimmed"
      :left-label-value="roundNumber(trimmedTimeCodes.min, 1) + 's'"
      :right-label-value="roundNumber(trimmedTimeCodes.max, 1) + 's'"
      label-always
      switch-label-side
    />
    <video
      class="video-for-thumbails"
      ref="videoForThumbnails"
      :src="videoPreview"
      hidden
      @loadedmetadata="generateThumbnails"
      autoplay
    ></video>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { FFmpeg } from '@ffmpeg/ffmpeg'

export default defineComponent({
  name: 'VideoTrimmer',
  components: {},
  props: {
    originalVideo: {},
  },
  data() {
    return {
      videoPreview: null,
      trimmedValues: { min: 0, max: 100 },
      trimmedTimeCodes: { min: 0, max: 0 },
      duration: 0,
      videoThumbnails: [],
    }
  },
  mounted() {
    this.videoPreview = URL.createObjectURL(this.originalVideo)
  },
  watch: {
    trimmedValues(val) {
      this.trimmedTimeCodes.min = (val.min * this.duration) / 100
      this.trimmedTimeCodes.max = (val.max * this.duration) / 100
    },
  },
  methods: {
    videoTrimmed(val) {
      if (this.videoPreview.indexOf('#') >= 0) {
        this.videoPreview = this.videoPreview.substring(
          0,
          this.videoPreview.indexOf('#')
        )
      }
      this.videoPreview +=
        '#t=' + this.trimmedTimeCodes.min + ',' + this.trimmedTimeCodes.max
    },
    videoLoaded() {
      if (this.trimmedTimeCodes.max === 0) {
        this.duration = this.$refs.videoPreview.duration
        this.trimmedTimeCodes.max = this.duration
        if (this.duration > 60) {
          this.$emit('video-too-long')
        }

        console.log(this.originalVideo)
        this.postProcessVideo()
      }
    },
    generateThumbnails() {
      if (this.videoThumbnails.length > 0) return
      this.duration = this.$refs.videoForThumbnails.duration
      const ratio = 60 / this.$refs.videoForThumbnails.videoHeight
      const containerWidth = this.$refs.videoThumbnails.offsetWidth
      const thumbnailWidth = ratio * this.$refs.videoForThumbnails.videoWidth
      const thumbnailAmount = Math.floor(containerWidth / thumbnailWidth)
      const thumbnailInterval = this.duration / thumbnailAmount
      let i = 0
      var interval = setInterval(() => {
        this.$refs.videoForThumbnails.currentTime = i
        this.generateThumbnail()
        i = i + thumbnailInterval
        if (i > this.duration) {
          clearInterval(interval)
        }
      }, 300)
    },
    generateThumbnail() {
      var canvas = document.createElement('canvas')
      canvas.height = this.$refs.videoForThumbnails.videoHeight
      canvas.width = this.$refs.videoForThumbnails.videoWidth
      var context = canvas.getContext('2d')
      context.drawImage(this.$refs.videoForThumbnails, 0, 0)
      var dataURL = canvas.toDataURL()
      this.videoThumbnails.push(dataURL)
    },
    async postProcessVideo() {
      // const ffmpeg = createFFmpeg({ log: true, mainName: 'main' })
      // const { name } = this.originalVideo
      // await ffmpeg.load()
      // const file = await fetchFile(this.originalVideo)
      // ffmpeg.FS('writeFile', name, file)
      // await ffmpeg.run('-i', name, 'output.mp4')
      // const data = ffmpeg.FS('readFile', 'output.mp4')
      // const urlblob = URL.createObjectURL(
      //   new Blob([data.buffer], { type: 'video/mp4' })
      // )
      // this.$refs.player.src = urlblob

      let load = () => {
        return new Promise(async (resolve) => {
          const ffmpeg = new FFmpeg({
            log: true,
            corePath: './ffmpeg/ffmpeg-core.js',
            mainName: 'main',
          })
          ffmpeg.load()
          resolve()
        })
      }
      load()
    },
    roundNumber(num, precision) {
      precision = Math.pow(10, precision)
      return Math.ceil(num * precision) / precision
    },
  },
})
</script>
<style lang="scss" scoped>
.video-trimmer {
  width: 100%;
  overflow-x: hidden;
  text-align: center;
  height: 95vh !important;
  .video-container {
    height: 65vh;
    margin-bottom: 10px;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    .video-preview {
      max-height: 100%;
      max-width: 100%;
      border-radius: 15px;
    }
  }
  .thumbnails-container {
    height: 60px;
    display: flex;
    justify-content: center;
    .video-thumbnails {
      display: flex;
      justify-content: left;
      width: 90%;
      .thumbnail {
        height: 60px;
        margin: 0px;
      }
    }
  }
  .range-trimmer {
    margin-top: -20px;
    width: 90%;
  }
}
</style>
