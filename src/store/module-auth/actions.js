import { api } from "boot/axios";
import router from "../../router/index.js"

export function login(context, credentials) {
  return new Promise((resolve, reject) => {
    return api
      .post("/login", credentials)
      .then(({ data }) => {
        if (data !== undefined) {
          context.commit("setAccessToken", {
            token: data.token,
            refresh_token: data.refresh_token,
          });
          resolve(data.token);
        }
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function afterLogin(context, credentials) {
  return new Promise((resolve, reject) => {
    return api
      .get("/after_login_info")
      .then(({ data }) => {
        let blockedUsers = []
        data.blockedUsers.forEach((user) => {
          blockedUsers.push(user.id)
        })
        localStorage.setItem("blockedUsers", JSON.stringify(blockedUsers))
        localStorage.setItem("tricksMastered", data.tricksMastered);
        localStorage.setItem("tricksLearning", data.tricksLearning);
        localStorage.setItem("sportXP", JSON.stringify(data.sportXP));
        localStorage.setItem("masteredTags", JSON.stringify(data.masteredTags));
        resolve(data)
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function register(context, user) {
  return new Promise((resolve, reject) => {
    return api
      .post("/register", user)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function forgotPassword(context, payload) {
  return new Promise((resolve, reject) => {
    return api
      .post("/forgotten_password", payload)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function logout(context, query) {
  return new Promise((resolve, reject) => {
    return api.get('/logout').finally(() => {
      localStorage.removeItem('token')
      localStorage.removeItem("refresh_token");
      localStorage.removeItem('pushNotificationsToken')
      localStorage.removeItem("userPP");
      localStorage.removeItem("username");
      localStorage.removeItem("favoriteSports");
      localStorage.removeItem("roles");
      localStorage.removeItem("userId");
      localStorage.removeItem("sportXP");
      localStorage.removeItem("masteredTags");
      localStorage.removeItem("tricksLearning");
      localStorage.removeItem("tricksMastered");
      localStorage.removeItem("communityLevel");
      localStorage.removeItem("disabledConversationNotifications")
      localStorage.removeItem("blockedUsers")
      // localStorage.removeItem("conversations");
      // context.commit('setLogout', {loggingOut: true, query: query})
      router().replace({ name: 'register-login', query: query })
      router().go(0)
      resolve();
    })
  });
}
export function deleteAccount(context) {
  return new Promise((resolve, reject) => {
    return api
      .get("/delete_account")
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
