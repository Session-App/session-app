import { api } from "boot/axios";
import { dateToCleanISO } from "src/boot/helpers";

export function getConversations(context, payload) {
  return new Promise((resolve, reject) => {
    return api
      .get("conversations?page=" + payload.page)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function findConversations(context, payload) {
  return new Promise((resolve, reject) => {
    return api
      .get("conversations/find?name=" + payload.name + '&onlyIfMember=' + payload.onlyIfMember)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function getConversation(context, payload) {
  return new Promise((resolve, reject) => {
    return api
      .get("conversation?conversationId=" + payload.conversationId + "&brief=" + payload.brief)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function getConversationMembers(context, payload) {
  return new Promise((resolve, reject) => {
    return api
      .get("conversation/members?conversationId=" + payload.conversationId + "&page=" + payload.page + "&size=" + payload.size)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function createConversation(context, payload) {
  console.log(payload)
  return new Promise((resolve, reject) => {
    return api
      .post("conversations", payload)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function getMessages(context, payload) {
  return new Promise((resolve, reject) => {
    return api
      .get("messages/" + payload.conversationId + "?page=" + payload.page + "&size=" + payload.size)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function getUnseenMessages(context, payload) {
  return new Promise((resolve, reject) => {
    return api
      .get("messages?lastMessageId=" + payload.lastMessageId)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function sendMessage(context, payload) {
  return new Promise((resolve, reject) => {
    return api
      .post("messages", payload)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function addUsers(context, payload) {
  return new Promise((resolve, reject) => {
    return api
      .post("conversations/" + payload.conversationId + "/addUser", {users: payload.users})
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function removeUser(context, payload) {
  return new Promise((resolve, reject) => {
    return api
      .post("conversations/" + payload.conversationId + "/removeUser", {userId: payload.userId})
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function loadSharables(context, query) {
  return new Promise((resolve, reject) => {
    return api
      .get("share?name=" + query)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function shareItem(context, payload) {
  return new Promise((resolve, reject) => {
    let url = "share?"
    if (payload.userId){
      url += 'userId=' + payload.userId
    } else if (payload.conversationId) {
      url += 'conversationId=' + payload.conversationId
      payload.payload.conversation = {}
      payload.payload.conversation.id = payload.conversationId
    }
    if (payload.sessionId) {
      url += '&sessionId=' + payload.sessionId
    }
    return api
      .post(url, payload.payload)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function upcomingSessions(context, conversationId) {
  const now = dateToCleanISO(new Date());
  return new Promise((resolve, reject) => {
    return api
      .get("conversations/upcomingSessions?conversationId=" + conversationId +"&now=" + now)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function groupDetail(context, conversationId) {
  return new Promise((resolve, reject) => {
    return api
      .get("conversation/detail?conversationId=" + conversationId )
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function joinGroup(context, conversationId) {
  return new Promise((resolve, reject) => {
    return api
      .get("conversation/join?conversationId=" + conversationId )
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function quitGroup(context, payload) {
  return new Promise((resolve, reject) => {
    return api
      .get("conversations/" + payload.conversationId + "/quit" )
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function editConversation(context, editedConversation) {
  return new Promise((resolve, reject) => {
    return api
      .post("conversation/edit", editedConversation )
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function setNewAdmin(context, payload) {
  return new Promise((resolve, reject) => {
    return api
      .get("conversation/setNewAdmin?conversationId=" + payload.conversationId + "&userId=" + payload.userId )
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
export function editNotifications(context, payload) {
  return new Promise((resolve, reject) => {
    return api
      .post("conversation/editNotifications", payload )
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
