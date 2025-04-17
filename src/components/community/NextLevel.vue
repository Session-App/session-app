<template>
  <div class="next-level popup">
    <q-circular-progress
      show-value
      size="80px"
      :thickness="0.1"
      color="primary"
      track-color="grey-3"
      :value="animatedLevel.progress"
      :animation-speed="animationSpeed"
    >
      <div class="level">
        {{ animatedLevel.level }}
      </div>
    </q-circular-progress>
    <div class="message">
      <div class="congrats">
        <div class="party-emoji">🎉</div>
        <div class="text">
          {{ $t("account.congrats") }}
        </div>
        <div class="party-emoji">🎉</div>
      </div>
      {{ $t("account.community_level.congrats_new_level") }}
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import confetti from "canvas-confetti";

export default defineComponent({
  name: "NextLevel",
  data() {
    return {
      animatedLevel: {
        progress: 0,
        level: this.previousLevel,
      },
      animationSpeed: 1000,
    };
  },
  props: ["previousLevel", "level", "progress"],
  created() {
    new Promise((r) => setTimeout(r, 50)).then(() => {
      this.animatedLevel.progress = 100;
    });
    new Promise((r) => setTimeout(r, 900)).then(() => {
      this.animatedLevel.level = this.level;
    });
    new Promise((r) => setTimeout(r, 1250)).then(() => {
      this.animationSpeed = 0;
      this.animatedLevel.progress = 0;
    });
    new Promise((r) => setTimeout(r, 1350)).then(() => {
      this.animationSpeed = 1000;
      this.animatedLevel.progress = this.progress;
    });
  },
  mounted() {
    const colors = ["#105494", "#ece9e9", "#f02444"];
    function confettiEnter() {
      confetti({
        particleCount: 150,
        angle: 60,
        spread: 50,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      });
      confetti({
        particleCount: 75,
        angle: 120,
        spread: 50,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 75,
        angle: 120,
        spread: 50,
        origin: { x: 1, y: 1 },
        colors: colors,
      });
    }

    confettiEnter();
  },

  methods: {},
});
</script>
<style lang="scss" scoped>
.next-level {
  display: flex;
  flex-direction: column;
  align-items: center;
  .level {
    font-size: 1.5em;
    color: $primary;
  }
  .message {
    margin-top: 10px;
    text-align: center;
    .congrats {
      margin-bottom: 10px;
      display: flex;
      justify-content: center;
      font-size: 1.3em;
      .text {
        color: $primary;
        font-weight: bold;
      }
      .party-emoji {
        margin: 0px 10px;
      }
    }
  }
}
</style>
