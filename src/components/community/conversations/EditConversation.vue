<template>
  <div class="edit-conversation popup">
    <div class="name">
      <Input v-model="editedConversation.name" :label="$t('community.group_name')" class="name" />
    </div>
    <!-- <Input
      v-model="editedConversation.description"
      :label="$t('community.group_description')"
      autogrow
    />-->
    <div class="toggles">
      <div class="toggle">
        <div class="left">{{ $t('community.conversation_private') }}</div>
        <div class="right">
          <q-toggle v-model="editedConversation.private" />
        </div>
      </div>
      <div class="toggle">
        <div class="left">{{ $t('community.conversation_associated_sport') }}</div>
        <div class="right">
          <q-btn color="primary" class="sport button" dense no-caps @click="sportPickerPopup = true">
            <div v-if="editedConversation.sport" class="sport-badge">
              <img :src="'svg/all-sports/' + editedConversation.sport + '.svg'" />
              {{ $t('sports.sports.' + editedConversation.sport) }}
            </div>
            <span v-else>
              {{
              $t('community.conversation_associated_sport')
              }}
            </span>
          </q-btn>
        </div>
      </div>
      <div class="toggle">
        <div class="left">{{ $t('community.conversation_associated_location') }}</div>
        <div class="right">
          <q-btn color="primary" no-caps dense :label="
              editedConversation.locationName ??
              $t('community.conversation_associated_location')
            " class="button" @click="locationPickerPopup = true" />
        </div>
      </div>
    </div>

    <div class="buttons">
      <q-btn color="primary" no-caps :label="$t('others.back')" @click="$emit('close', editedConversation)" />
      <q-btn color="primary" no-caps :label="$t('others.validate')" @click="validate" :loading="loading" />
    </div>
    <q-dialog v-model="sportPickerPopup" class="above-all">
      <SportsPicker :alreadySelected="
          editedConversation.sport ? [editedConversation.sport] : []
        " @sports-selected="updateSport" method="single" />
    </q-dialog>
    <q-dialog v-model="locationPickerPopup" class="above-all">
      <SearchPlace @place-clicked="placeClicked" />
    </q-dialog>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import Input from 'components/form/Input'
import SportsPicker from 'components/sports/SportsPicker'
import SearchPlace from 'components/map/SearchPlace'

export default defineComponent({
  name: 'EditConversation',
  components: { Input, SportsPicker, SearchPlace },
  data() {
    return {
      editedConversation: {
        private: false,
        name: '',
        sport: null,
        lat: null,
        lon: null,
        locationName: null,
      },
      sportPickerPopup: false,
      locationPickerPopup: false,
      saving: false,
    }
  },
  props: { conversation: {}, loading: { default: false } },
  created() {
    this.editedConversation = { ...this.conversation }
  },
  methods: {
    placeClicked(place) {
      this.editedConversation.lat = place.position.lat
      this.editedConversation.lon = place.position.lon
      this.editedConversation.locationName =
        place.address.municipality ?? place.address.freeformAddress
      this.locationPickerPopup = false
    },
    updateSport(sports) {
      this.editedConversation.sport = parseInt(sports[0])
      this.sportPickerPopup = false
    },
    validate() {
      this.$emit('validate', this.editedConversation)
    },
  },
})
</script>
<style lang="scss" scoped>
.edit-conversation {
  width: 85vw;
  padding: 7px;
  .name {
    display: flex;
    justify-content: center;
    margin: 5px;
  }
  .toggles {
    .toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .button {
        margin-top: 10px;
        margin-right: 5px;
      }
      .sport {
        .sport-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 0.8em;
          img {
            width: 30px;
          }
        }
      }
    }
  }
  .buttons {
    display: flex;
    justify-content: space-around;
    margin-top: 25px;
  }
}
</style>
