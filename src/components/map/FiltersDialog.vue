<template>
  <div>
    <Button
      :label="$t('filters.filter_spots')"
      color="primary"
      class="filter-button"
      @click="openDialog()"
      icon="img:svg/filter.svg"
    ></Button>
    <q-dialog v-model="dialogOpened">
      <div class="filters-dialog popup">
        <div class="filters-title">
          {{ $t("filters.filters") }}
        </div>
        <div class="tags-selection">
          <q-btn
            class="tag"
            v-for="tag in tags"
            :key="tag"
            :color="tag[2] ? 'primary' : 'grey'"
            :text-color="tag[2] ? 'white' : 'black'"
            @click="tag[2] = !tag[2]"
            :no-caps="true"
          >
            <img class="tag-icon" :src="'svg/tags/' + tag[0] + '.svg'" alt="" />
            <span class="tag-title">{{ tag[1] }}</span>
          </q-btn>
        </div>
        <q-card-actions align="right">
          <q-btn flat :label="$t('others.ok')" color="primary" v-close-popup />
        </q-card-actions>
      </div>
    </q-dialog>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import Button from "components/form/Button";

export default defineComponent({
  name: "FiltersDialog",
  components: { Button },
  data() {
    return {
      dialogOpened: false,
    };
  },
  props: {
    dialogOpened: {
      type: Boolean,
    },
    tags: {
      type: String,
    },
  },
  methods: {
    openDialog() {
      this.$q.notify({
        message: "Coming soon",
        color: "green-3",
      });
    },
  },
});
</script>
<style lang="scss" scoped>
@import "../../css/popup.scss";

.filter-button {
  margin-top: 4px;
  margin-bottom: 7px;
  img {
    width: 50px;
  }
}
.filters-dialog {
  .filters-title {
    font-size: 1.3em;
    margin-bottom: 10px;
  }
  .tags-selection {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .tag {
      padding: 7px;
      margin: 6px;
      border-radius: $button-border-radius;
      .tag-icon {
        width: 25px;
        margin-right: 5px;
        vertical-align: middle;
      }
    }
  }
}
</style>
