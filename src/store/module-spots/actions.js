import { api } from "boot/axios";
import axios from "axios";
import Compressor from "compressorjs";

export function getSpots(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .get(
        "/spots/" +
          payload.sportId +
          "?mapNorthEastLat=" +
          payload.mapNorthEastLat +
          "&mapNorthEastLng=" +
          payload.mapNorthEastLng +
          "&mapSouthWestLat=" +
          payload.mapSouthWestLat +
          "&mapSouthWestLng=" +
          payload.mapSouthWestLng
      )
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getClosestSpots(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .get(
        "/spots/closests/" +
          payload.sportId +
          "?page=" +
          payload.page +
          "&lat=" +
          payload.userLocation.lat +
          "&lon=" +
          payload.userLocation.lon
      )
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getSpotDetail(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .get("/spot/detail/" + payload.spotId)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}
export function getSpotDetailBrief(context, spotId) {
  return new Promise((resolve, reject) => {
    api
      .get("/spot/detail/brief/" + spotId)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}
export function getSpotSessions(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .get(
        "/spot/" +
          payload.spotId +
          "/sessions?begin=" +
          payload.period.from +
          "&end=" +
          payload.period.to
      )
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function sendSpot(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .post("/spot/new/" + payload.sportId +"?duplicateChecked=" + payload.duplicateChecked, payload.form)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}
export function requestLink(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .post("/picture_link/" + payload.sportId, {
        name: payload.pictureName,
      })
      .then(({ data }) => {
        resolve(data);
      });
  });
}
export function sendPicture(context, payload) {
  return new Promise((resolve, reject) => {
    new Compressor(payload.renamedPicture, {
      quality: 0.7,
      maxWidth: 1200,
      maxHeight: 1200,

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
export function savePicture(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .post("/save_picture", {
        name: payload.pictureName,
        spotId: payload.spotId,
      })
      .then(({ data }) => {
        resolve(data);
      });
  });
}
export function sendComment(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .post("/spot/comment/new", payload.comment)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}
export function editFavorite(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .post("/spot/favoriteSpot", payload)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}
export function sendTags(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .post("/spot/addTags", payload)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}
