/*
export function someGetter (state) {
}
*/

export function isAutheticated(state) {
  return state.TOKEN;
}

export function getUser(state) {
  return state.USER;
}

export function getLogout(state) {
  return state.logout;
}