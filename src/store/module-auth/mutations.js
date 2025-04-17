import { LocalStorage } from "quasar";

export function saveUser(state, user) {
  state.user = user;
  localStorage.setItem("username", user.username);
  localStorage.setItem("userPP", user.profilePicture);
  localStorage.setItem("favoriteSports", user.favoriteSports);
}

export function setAccessToken(state, payload) {
  if (payload.token === null) {
    return LocalStorage.remove("token");
  }
  localStorage.setItem("token", payload.token);
  localStorage.setItem("refresh_token", payload.refresh_token);
}

export function setLogout(state, payload) {
  state.logout = payload
}