import type { Task, Profile } from "./types"

export function getStoredProfiles(): Profile[] {
  const profiles = localStorage.getItem("profiles")
  return profiles ? JSON.parse(profiles) : []
}

export function saveProfiles(profiles: Profile[]) {
  localStorage.setItem("profiles", JSON.stringify(profiles))
}

export function getTasksForProfile(profileId: string): Task[] {
  const tasks = localStorage.getItem(`tasks-${profileId}`)
  return tasks ? JSON.parse(tasks) : []
}

export function saveTasksForProfile(profileId: string, tasks: Task[]) {
  localStorage.setItem(`tasks-${profileId}`, JSON.stringify(tasks))
}

export function getActiveProfileId(): string | null {
  return localStorage.getItem("activeProfileId")
}

export function setActiveProfileId(profileId: string) {
  localStorage.setItem("activeProfileId", profileId)
}

