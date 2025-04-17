<template>
  <div class="spots-list">
    <div class="spots-wrapper">
      <div
        v-for="spot in spots"
        :key="spot"
        class="spot"
        @click.stop="$emit('spot-clicked', spot)"
      >
        <div class="left" :class="{ 'contains-image': spot.pictures[0] }">
          <div class="spot-name">
            {{ spot.name }}
          </div>

          <div class="distance" v-if="spot.distance !== undefined">
            <span class="km" v-if="spot.distance.km !== 0"
              >{{ spot.distance.km }}km</span
            >
            <span class="m" v-else>{{ spot.distance.m }}m</span>
          </div>
          <SportBadge v-if="sportBadge" :sportId="spot.sport" />
          <div class="tags" v-if="tagBadges">
            <TagBadge
              :sportId="spot.sport"
              :tagId="tag"
              v-for="tag in spot.tags"
              :key="tag"
            />
          </div>
        </div>
        <div class="right">
          <img
            v-if="spot.pictures[0]"
            :src="cloudFrontUrl + spot.sport + '/' + spot.pictures[0].name"
            loading="lazy"
            class="spot-picture"
          />
        </div>
      </div>
      <q-skeleton class="spot" v-if="loading" v-for="i in [1, 2, 3]" :key="i" />
      <q-btn
        :label="$t('others.load_more')"
        :loading="loadingMore"
        :no-caps="true"
        color="primary"
        class="load-more-spots"
        v-if="spots.length !== 0 && loadMore"
        @click="$emit('load-more')"
      />
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import SportBadge from "components/sports/SportBadge";
import TagBadge from "components/spots/TagBadge";

export default defineComponent({
  name: "SpotsList",
  components: { SportBadge, TagBadge },
  props: {
    spots: {},
    sportBadge: {},
    tagBadges: {},
    loadMore: {},
    loading: {
      default: false,
    },
    loadingMore: {
      default: false,
    },
  },
  data() {
    return {
      cloudFrontUrl: "https://d1tqac1zek46ma.cloudfront.net/spots_",
    };
  },
  created() {},
  methods: {},
});
</script>
<style lang="scss" scoped>
.spots-list {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 100%;
  .spots-wrapper {
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
    .spot {
      min-height: 71px;
      padding-left: 10px;
      width: 90vw;
      margin: 5px;
      display: flex;
      justify-content: space-between;
      box-shadow: 0 0px 3px #080808;
      border-radius: 15px;
      .left {
        text-align: left;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 10px 0px;
        &.contains-image {
          max-width: 55%;
          .spot-name {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .spot-name {
          font-weight: bold;
        }
        .distance {
          margin-top: 5px;
          margin-bottom: 5px;
        }
        .tags {
          display: flex;
          flex-wrap: wrap;
        }
      }
      .right {
        display: flex;
        align-items: center;
        .spot-picture {
          object-fit: cover;
          width: 130px;
          height: 130px;
          padding: 7px;
          border-radius: 20px;
        }
      }
    }
    .load-more-spots {
      margin: 10px;
    }
  }
}
</style>
