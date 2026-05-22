export function getVoterKey() {
  if (typeof window === "undefined") {
    return "";
  }

  const storageKey = "startup-sprint-voter-key";
  const existing = window.localStorage.getItem(storageKey);

  if (existing) {
    return existing;
  }

  const voterKey = crypto.randomUUID();
  window.localStorage.setItem(storageKey, voterKey);
  return voterKey;
}

export function lockVote(eventId: string, teamId: string) {
  window.localStorage.setItem(`startup-sprint-voted-${eventId}`, teamId);
}

export function getLockedVote(eventId: string) {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(`startup-sprint-voted-${eventId}`);
}
