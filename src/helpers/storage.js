//import { LocalStorage } from "quasar";

export function getAccessToken() {
  return localStorage.getItem("token");
}
export function getRefreshToken() {
  return localStorage.getItem("refresh_token");
}
export function setTokens(token, refresh_token) {
  localStorage.setItem("token", token);
  localStorage.setItem("refresh_token", refresh_token);
}
