import axios from "axios";
import { api } from "boot/axios";
import Compressor from "compressorjs";
import { dateToCleanISO } from "boot/helpers";

export function getUser(context) {
  var now = dateToCleanISO(new Date());
  return new Promise((resolve, reject) => {
    api
      .get("/profile?now=" + now)
      .then(({ data }) => {
        localStorage.setItem("userPP", data.user.profilePicture);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("favoriteSports", data.user.favoriteSports);
        localStorage.setItem("roles", data.user.roles);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("disabledConversationNotifications", data.user.disabledConversationNotifications);
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function pushNotificationsToken(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .post("/profile/notificationsToken", {
        firebaseToken: payload.firebaseToken,
      })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function setLang(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .post("/profile/setLang", payload)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function setLastLocation(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .post("/profile/setLastLocation", payload)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getAddedSpots(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .get(
        "/profile/addedSpots?page=" + payload.page + "&userId=" + payload.userId
      )
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getFavoriteSpots(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .get(
        "/profile/favoriteSpots?page=" +
          payload.page +
          "&userId=" +
          payload.userId
      )
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getSessions(context, payload) {
  var now = dateToCleanISO(new Date());
  return new Promise((resolve, reject) => {
    api
      .get(
        "/profile/" +
          payload.sessionsTypes +
          "Sessions?now=" +
          now +
          "&page=" +
          payload.page +
          "&userId=" +
          payload.userId
      )
      .then(({ data }) => {
        context.commit("setSessions", data, payload.sessionsTypes);
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getForeignUser(context, userId) {
  var now = dateToCleanISO(new Date());
  return new Promise((resolve, reject) => {
    api
      .get("/foreignProfile/" + userId + "?now=" + now)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function validate(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .post("/secretVerification/verify/" + payload.sportId, {
        userId: payload.userId,
      })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function requestProfilePictureLink(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .post("/profile_picture_link", {
        name: payload.pictureName,
      })
      .then(({ data }) => {
        resolve(data);
      });
  });
}
export function sendProfilePicture(context, payload) {
  return new Promise((resolve, reject) => {
    new Compressor(payload.renamedPicture, {
      quality: 0.8,
      maxWidth: 100,
      maxHeight: 100,

      success(result) {
        var compressedPicture = new File([result], result.name, {
          type: result.type,
        });

        axios
          .put(payload.url, compressedPicture, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then(({ data }) => {
            resolve(data);
          });
      },
      error(err) {
      },
    });
  })
    .then(({ data }) => {
      return data;
    })
    .catch((error) => {
    });
}
export function saveProfilePicture(context, payload) {
  return new Promise((resolve, reject) => {
    api.post("/save_profile_picture", {
      name: payload.pictureName,
    });
  });
}
export function editUser(context, payload) {
  return new Promise((resolve, reject) => {
    return api
      .post("/profile/edit", payload)
      .then(({ data }) => {
        localStorage.setItem("favoriteSports", payload.favoriteSports);
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function sendFriendshipRequest(context, userId) {
  return new Promise((resolve, reject) => {
    return api
      .get("/friendship/request/" + userId)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function rejectFriendship(context, userId) {
  return new Promise((resolve, reject) => {
    return api
      .get("friendship/reject/" + userId)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function acceptFriendship(context, userId) {
  return new Promise((resolve, reject) => {
    return api
      .get("friendship/accept/" + userId)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function getFriendships(context, onlyFriends) {
  return new Promise((resolve, reject) => {
    return api
      .get("friendship/list?onlyFriends=" + onlyFriends)  
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function searchUsers(context, payload) {
  return new Promise((resolve, reject) => {
    return api
      .get("users/search?username=" + payload.username + "&hideMe=" + payload.hideMe)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function reportEntity(context, payload) {
  return new Promise((resolve, reject) => {
    return api
      .post("report", payload)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function blockUser(context, userId) {
  return new Promise((resolve, reject) => {
    return api
      .get("user/block/" + userId)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}