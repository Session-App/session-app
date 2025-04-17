import { api } from "boot/axios";
//import axios from "axios";

export function getSessions(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .get(
        "/sessions/" +
          payload.sportId +
          "?begin=" +
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
export function getSessionDetail(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .get("/session/detail/" + payload.sessionId + "?brief="  + payload.brief)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function joinSession(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .post("/session/join/" + payload.sessionId)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function quitSession(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .post("/session/quit/" + payload.sessionId)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function sendSession(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .post("/session/new", payload.form)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function sendComment(context, payload) {
  return new Promise((resolve, reject) => {
    api
      .post("/session/comment/new", payload.comment)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}