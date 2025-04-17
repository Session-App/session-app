import auth from "./module-auth";
import user from "./module-user";
import spots from "./module-spots";
import sessions from "./module-sessions";
import map from "./module-map";
import admin from "./module-admin";
import conversations from "./module-conversations";
import tricks from "./module-tricks";
import { Loading, QSpinner } from "quasar";
import Vuex from "vuex";


export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      user,
      spots,
      sessions,
      map,
      admin,
      conversations,
      tricks
    },
    state: {
      LOADING_STATE: false,
      INPUT_FOCUSED: false,
      SECTION: null,
      PROFILE_PICTURE: null
    },

    getters: {
      getLoading(state) {
        return state.LOADING_STATE;
      },
      getInputFocused(state) {
        return state.INPUT_FOCUSED;
      },
      getSection(state) {
        return state.SECTION;
      },
      getProfilePicture(state) {
        return state.PROFILE_PICTURE
      }
    },

    mutations: {
      setLoading(state, newLoadingState) {
        state.LOADING_STATE = newLoadingState;
        if (newLoadingState) {
          Loading.show({
            spinner: QSpinner,
            spinnerColor: "light-blue-4",
          });
        } else {
          Loading.hide();
        }
      },
      setInputState(state, newInputState) {
        state.INPUT_FOCUSED = newInputState;
      },
      setSection(state, newSection) {
        state.SECTION = newSection;
      },
      setProfilePicture(state, newProfilePicture) {
        state.PROFILE_PICTURE = newProfilePicture;
      },
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING,
  });

  return Store;
}
