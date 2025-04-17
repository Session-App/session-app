export function setSessions(state, sessions, type) {
  if (type === "upcoming") {
    state.upcoming_sessions = sessions;
  } else if (type === "joined") {
    state.joined_sessions = sessions;
  } else if (type === "organized") {
    state.organized_sessions = sessions;
  }
}

export function setClickedUserId(state, userId) {
  state.clickedUserId = userId
}
export function setReportedEntity(state, payload) {
  state.reportedEntity = {}
  state.reportedEntity.entityId = payload.entityId
  state.reportedEntity.entityName = payload.entityName
}
