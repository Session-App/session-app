import { EventSourcePolyfill } from 'event-source-polyfill';
import { Notify } from 'quasar'
import { i18n } from 'boot/i18n';
import store from '../store';


export function passwordDifficultyCheck(value) {
  let level = 0;
  if (value.length >= 8) {
    level++;
  }
  if (/\d/.test(value)) {
    level++;
  }
  if (/[a-z]/.test(value)) {
    level++;
  }
  if (/[A-Z]/.test(value)) {
    level++;
  }
  if (/[!@#\\$%\\^\\&*\\)\\(+=._-]/.test(value)) {
    level++;
  }
  return level;
}

export function getFavoriteSports() {
  let sports = [];
  if (localStorage.getItem("favoriteSports") !== "") {
    sports = localStorage.getItem("favoriteSports").split(",");
  }
  return sports;
}

export function formatDateFromBack(date) {
  let creationDate = new Date(removeTimeZone(date));
  let formattedDate = creationDate.getDate() + "/";
  if (creationDate.getMonth() + 1 < 10) {
    formattedDate += "0" + String(creationDate.getMonth() + 1);
  } else {
    formattedDate += creationDate.getMonth() + 1;
  }
  formattedDate += "/" + creationDate.getFullYear();
  return formattedDate;
}

export function removeTimeZone(datetime) {
  return datetime.substring(0, datetime.indexOf("+"));
}

export function removeIsoTimeZone(datetime) {
  return datetime.substring(0, 10);
}

// returns a datetime without the timezone, preferred over the others
export function dateToCleanISO(/* js Date object : */ datetime) {
  const date = removeIsoTimeZone(datetime.toISOString());
  const time = datetime.toTimeString().substring(0, 8);
  return date + " " + time;
}

export function addDistanceToSpots(spots, userLocation) {
  if (spots.length === 0) return spots;
  var userLat = userLocation.coords.latitude;
  var userLon = userLocation.coords.longitude;
  spots.forEach((spot) => {
    if (spot.lat == userLat && spot.lon == userLon) {
      return 0;
    } else {
      var radlat1 = (Math.PI * spot.lat) / 180;
      var radlat2 = (Math.PI * userLat) / 180;
      var theta = spot.lon - userLon;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      dist *= 1.609344;
      spot.distance = {
        km: dist.toString().split(".")[0],
        m: dist.toString().split(".")[1].substring(0, 3),
        raw: dist,
      };
    }
  });
  return spots;
}

export function insertInSortedSpotsList(sortedSpots, extraSpots) {
  extraSpots.forEach((spotToInsert) => {
    for (let i = 0; i <= sortedSpots.length; i++) {
      if (sortedSpots[i]?.distance.raw > spotToInsert.distance.raw) {
        sortedSpots.splice(i, 0, spotToInsert);
        break;
      }
      if (i === sortedSpots.length) {
        sortedSpots.splice(i, 0, spotToInsert);
        break;
      }
    }
  });
  return sortedSpots;
}

export function getConversationHead(conversation) {
  conversation.head = {}
  if (conversation.name) {
    conversation.head.name = conversation.name
    conversation.head.oneToOne = false
  } else {
    if (conversation.recipient.id == localStorage.getItem('userId')){
      conversation.head.name = conversation.administrator.username
      conversation.head.picture = conversation.administrator.profilePicture
      conversation.head.userId = conversation.administrator.id
    } else {
      conversation.head.name = conversation.recipient.username
      conversation.head.picture = conversation.recipient.profilePicture
      conversation.head.userId = conversation.recipient.id
    } 
    conversation.head.oneToOne = true
  }

  return conversation;
}

export function eventSourceHelper (topic, token) {
  let mercureUrl = process.env.ENV === 'dev' ? 'https://localhost:3000/.well-known/mercure' : 'https://notifications.app-session.com:3000/.well-known/mercure'
  mercureUrl += '?topic='
  const eventSource = new EventSourcePolyfill(
    mercureUrl + encodeURIComponent(topic), {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }
  )
  return eventSource
}

export function createConversation (userId) {
  return new Promise((resolve, reject) => {
    store().commit('setLoading', true);
    if (!localStorage.getItem('conversations')) {
      localStorage.setItem('conversations', '[]')
    }
    store()
    .dispatch("conversations/createConversation", {
      name: null,
      private: true,
      members: [userId],
    })
    .then((data) => {
      store().commit("setLoading", false);
      if (!data.conversationAlreadyExisted) {
        let localConversations = JSON.parse(
          localStorage.getItem("conversations")
        );
        localConversations.push({
          id: data.conversation.id,
          lastMessageId: 0,
          notSeen: true,
        });
        localStorage.setItem(
          "conversations",
          JSON.stringify(localConversations)
        );
      }
      resolve(data)
    });
  });
}

export function notify (notifs, color = 'red-2') {
  notifs.forEach((notif) => {
    Notify.create({
      message: i18n.global.t('notification.' + notif),
      color: color
    })
  })
}
