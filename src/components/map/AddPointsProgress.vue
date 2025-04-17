<template>
  <div class="add-points-progress popup">
    <div class="explanation">
      {{ $t('spots.add_points_loading') }}
    </div>
    <q-linear-progress size="7px" rounded :value="progress" class="q-mt-md" />
  </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AddPointsProgress',
  props: { progress: { type: Number } },
  data() {
    return {}
  },
})
</script>
<style lang="scss" scoped>
.add-points-progress {
  width: 95vw;
  padding: 15px;
  .explanation {
    text-align: center;
  }
}
</style>
