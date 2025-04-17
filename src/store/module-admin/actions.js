import { api } from "boot/axios";

export function getUnvalidatedSpots(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .get("/admin/spots/validate")
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}
export function getSpotsWithUnvalidatedPictures(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .get("/admin/spots/validate/pictures")
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}
export function validateSpot(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .post("/admin/spot/validate/" + payload.sportId, payload)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}
