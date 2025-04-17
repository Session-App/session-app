<template>
  <div class="community-level-wrapper popup">
    <div class="contribution-value">
      <q-circular-progress
        show-value
        size="50px"
        :thickness="0.1"
        color="primary"
        track-color="grey-3"
        :value="level.progress"
      >
        <div class="level">
          {{ level.level }}
        </div>
      </q-circular-progress>
      <span class="exact-value"
        >({{ points }} {{ $t("account.contribution_points") }})</span
      >
    </div>
    <div class="explanation">
      {{ $t("account.community_level.explanation") }}
    </div>
    <div class="detail">
      <div class="contribution">
        {{ $t("account.community_level.added_spot") }}
        <div class="points-amount">
          50 {{ $t("account.community_level.points") }}
        </div>
      </div>
      <div class="contribution">
        {{ $t("account.community_level.added_picture") }}
        <div class="points-amount">
          30 {{ $t("account.community_level.points") }}
        </div>
      </div>
      <div class="contribution">
        {{ $t("account.community_level.added_tags") }}
        <div class="points-amount">
          20 {{ $t("account.community_level.points") }}
        </div>
      </div>
      <div class="contribution">
        {{ $t("account.community_level.added_session") }}
        <div class="points-amount">
          25 {{ $t("account.community_level.points") }}
        </div>
      </div>
      <div class="contribution">
        {{ $t("account.community_level.joined_session") }}
        <div class="points-amount">
          20 {{ $t("account.community_level.points") }}
        </div>
      </div>
      <div class="contribution">
        {{ $t("account.community_level.shared_app") }}
        <div class="points-amount">
          150 {{ $t("account.community_level.points") }}
        </div>
      </div>
    </div>
    <div class="ok-button">
      <q-btn
        color="primary"
        :label="$t('others.understood')"
        :no-caps="true"
        @click="$emit('ok')"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "CommunityLevelPopup",
  components: {},
  props: ["points", "level"],
  data() {
    return {};
  },
  created() {},
  methods: {},
});
</script>

<style lang="scss" scoped>
.community-level-wrapper {
  max-height: 75vh;
  margin-bottom: 20px;
  .contribution-value {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
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
  .explanation {
    text-align: justify;
  }
  .detail {
    .contribution {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #85b2c1;
      padding: 5px;
      border-radius: 7px;
      .points-amount {
        color: white;
        font-weight: bold;
      }
    }
  }
  .ok-button {
    text-align: center;
    margin-top: 15px;
    margin-bottom: -5px;
  }
}
</style>
