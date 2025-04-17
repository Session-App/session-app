<template>
  <div class="search-place popup">
    <SearchBar
      :placeholder="$t('spots.search_place')"
      @search="search"
      :minLength="3"
      :focusOnMounted="true"
    />
    <div class="skeletons" v-if="loading">
      <q-skeleton class="place" v-for="i in [1, 2, 3, 4, 5, 6]" :key="i" />
    </div>
    <div class="places" v-else>
      <div
        class="place"
        v-for="place in placesFound"
        :key="place.id"
        @click="$emit('place-clicked', place)"
      >
        <div
          class="street"
          v-if="
            ['Street', 'Point Address', 'Address Range', 'POI'].indexOf(
              place.type
            ) >= 0
          "
        >
          <div class="name">{{ place.address.streetName }}</div>
        </div>
        <div class="city">
          <div class="municipality">{{ place.address.municipality }}</div>
          <div
            class="departement"
            v-if="place.address.countrySecondarySubdivision"
          >
            ({{ place.address.countrySecondarySubdivision }})
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import SearchBar from 'components/others/SearchBar'
import axios from 'axios'

export default defineComponent({
  name: 'SearchPlace',
  components: { SearchBar },
  data() {
    return {
      placesFound: [],
      loading: false,
    }
  },
  props: {},
  methods: {
    search(query) {
      this.loading = true
      axios
        .get(process.env.PLACE_SEARCH_API_URL.replace('query', query))
        .then((data) => {
          this.loading = false
          this.placesFound = data.data.results
        })
    },
  },
})
</script>
<style lang="scss" scoped>
@use '../../css/mixins.scss';
.search-place {
  width: 90vw;
  max-height: 70vh !important;
  .place {
    @include mixins.elevated-box;
    margin: 10px 5px;
    padding: 5px;
    border-radius: 10px;
    .city {
      display: flex;
      .municipality {
        white-space: nowrap;
      }
      .departement {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-left: 4px;
      }
    }
  }
}
</style>
