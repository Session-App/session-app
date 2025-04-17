const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "my-sports",
        name: "my-sports",
        component: () => import("pages/user/MySports.vue"),
      },
      {
        path: "add-spot-session",
        name: "add-spot-session",
        component: () => import("pages/sports/ChooseSport.vue"),
      },
      {
        path: "profile",
        name: "profile",
        component: () => import("pages/user/Profile.vue"),
      },
      {
        path: "edit-profile",
        name: "edit-profile",
        component: () => import("pages/user/EditProfile.vue"),
      },
      {
        path: "sessions-map",
        name: "sessions-map",
        component: () => import("pages/sessions/Sessions.vue"),
      },
      /*
      {
        path: "session-detail",
        name: "session-detail",
        component: () => import("pages/sessions/SessionDetail.vue"),
      },*/
      {
        path: "add-session",
        name: "add-session",
        component: () => import("pages/sessions/AddSession.vue"),
      },
      {
        path: "thank-you",
        name: "thank-you",
        component: () => import("pages/others/ThankYou.vue"),
      },

      {
        path: "sessions",
        name: "sessions",
        component: () => import("pages/sessions/Sessions.vue"),
      },
      {
        path: "spots-map",
        name: "spots-map",
        component: () => import("pages/spots/SpotsMap.vue"),
      },
      {
        path: "tricks",
        name: "tricks",
        component: () => import("pages/tricks/Tricks.vue"),
      },
      {
        path: "tricks-list",
        name: "tricks-list",
        component: () => import("pages/tricks/TricksList.vue"),
      },
      {
        path: "validate-spots",
        name: "validate-spots",
        component: () => import("pages/admin/ValidateSpots.vue"),
      },
      {
        path: "add-spot",
        name: "add-spot",
        component: () => import("pages/spots/AddSpot.vue"),
      },
      {
        path: "extra-pictures",
        name: "extra-pictures",
        component: () => import("pages/spots/ExtraPictures.vue"),
      },
      {
        path: "conversations",
        name: "conversations",
        component: () => import("pages/community/Conversations.vue"),
      },
      {
        path: "community",
        name: "community",
        component: () => import("src/pages/community/Community.vue"),
      },
      {
        path: "settings",
        name: "settings",
        component: () => import("pages/user/Settings.vue"),
      },
    ],
  },
  {
    path: "/register-login",
    name: "register-login",
    component: () => import("pages/user/RegisterLogin.vue"),
  },
  {
    path: "/first-steps",
    name: "first-steps",
    component: () => import("pages/others/FirstSteps.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
