import { api } from "boot/axios";
import Compressor from "compressorjs";
import axios from "axios";

export function getTricks(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .get(
        "tricks?name=" + (payload.name ?? '') + '&sportId=' + (payload.sportId ?? '0') + '&tagId=' + (payload.tagId ?? '0') +'&page=' + payload.page + '&size=' + payload.size
      )
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getTrick(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .get(
        "trick?trickId=" + payload.trickId
      )
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getTrickVariations(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .get(
        "trick/variations?trickId=" + payload.trickId
      )
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getTags(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .get(
        "trickTags?sportId=" + payload.sportId
      )
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function masterTrick(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .get(
        "trick/" + (payload.mastered ? 'master' : 'unmaster') + "?trickId=" + payload.trickId
      )
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function learnTrick(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .get(
        "trick/" + (payload.learning ? 'learn' : 'unlearn') + "?trickId=" + payload.trickId
      )
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getMediaUploadLink(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .get("trick/addMedia?type=" + payload.type)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function uploadMedia(context, payload) {
  return new Promise((resolve, reject) => {
    if (payload.type === "image"){
      new Compressor(payload.media, {
        quality: 0.7,
        maxWidth: 720,
        maxHeight: 720,

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
        error(err) {},
      });
    }
  });
}
    