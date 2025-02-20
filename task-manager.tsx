"use client"

import { useState, useEffect } from "react"
import type { Task, Profile } from "./types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ProfileSelector } from "./profile-selector"
import { Sidebar } from "./sidebar"
import { TaskItem } from "./task-item"
import { SettingsDialog } from "./settings-dialog"
import { Plus } from "lucide-react"
import {
  getStoredProfiles,
  saveProfiles,
  getTasksForProfile,
  saveTasksForProfile,
  getActiveProfileId,
  setActiveProfileId,
} from "./storage-utils"

export default function TaskManager() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [activeListId, setActiveListId] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Load profiles and active profile
  useEffect(() => {
    const storedProfiles = getStoredProfiles()
    setProfiles(storedProfiles)

    const activeProfileId = getActiveProfileId()
    if (activeProfileId) {
      const active = storedProfiles.find((p) => p.id === activeProfileId)
      if (active) {
        setActiveProfile(active)
        setTasks(getTasksForProfile(active.id))
      }
    }
  }, [])

  // Save profiles whenever they change
  useEffect(() => {
    saveProfiles(profiles)
  }, [profiles])

  // Save tasks whenever they change
  useEffect(() => {
    if (activeProfile) {
      saveTasksForProfile(activeProfile.id, tasks)
    }
  }, [tasks, activeProfile])

  const handleProfileSelect = (profile: Profile) => {
    setActiveProfile(profile)
    setActiveProfileId(profile.id)
    setTasks(getTasksForProfile(profile.id))
    setActiveListId(null)
  }

  const handleListSelect = (listId: string | null) => {
    setActiveListId(listId)
  }

  const addTask = () => {
    if (newTask.trim() && activeProfile) {
      const task: Task = {
        id: Date.now().toString(),
        description: newTask,
        completed: false,
        priority: "medium",
        category: "other",
        dueDate: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
        important: false,
        subTasks: [],
        attachments: [],
        inMyDay: activeListId === "my-day",
        listId: activeListId || "inbox",
      }
      setTasks([...tasks, task])
      setNewTask("")
    }
  }

  const getFilteredTasks = () => {
    let filtered = [...tasks]

    // Filter by list/view
    switch (activeListId) {
      case "my-day":
        filtered = filtered.filter((task) => task.inMyDay)
        break
      case "important":
        filtered = filtered.filter((task) => task.important)
        break
      case "planned":
        filtered = filtered.filter((task) => task.dueDate)
        break
      default:
        if (activeListId) {
          filtered = filtered.filter((task) => task.listId === activeListId)
        }
    }

    // Apply profile settings
    if (activeProfile) {
      if (!activeProfile.settings.showCompletedTasks) {
        filtered = filtered.filter((task) => !task.completed)
      }

      // Sort tasks
      switch (activeProfile.settings.sortBy) {
        case "alphabetical":
          filtered.sort((a, b) => a.description.localeCompare(b.description))
          break
        case "dueDate":
          filtered.sort((a, b) => {
            if (!a.dueDate) return 1
            if (!b.dueDate) return -1
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          })
          break
        case "created":
          filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
        case "priority":
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
          break
      }
    }

    return filtered
  }

  const getTaskCounts = () => {
    const counts: { [key: string]: number } = {
      myDay: tasks.filter((t) => t.inMyDay).length,
      important: tasks.filter((t) => t.important).length,
      planned: tasks.filter((t) => t.dueDate).length,
    }

    // Add counts for custom lists
    if (activeProfile && activeProfile.lists) {
      activeProfile.lists.forEach((list) => {
        counts[list.id] = tasks.filter((t) => t.listId === list.id).length
      })
    }

    return counts
  }

  return (
    <div className="flex h-screen">
      {activeProfile && (
        <Sidebar
          lists={activeProfile.lists}
          activeListId={activeListId}
          onListSelect={handleListSelect}
          onListCreate={(list) => {
            const updatedProfile = {
              ...activeProfile,
              lists: [...activeProfile.lists, list],
            }
            setProfiles(profiles.map((p) => (p.id === activeProfile.id ? updatedProfile : p)))
            setActiveProfile(updatedProfile)
          }}
          onSettingsClick={() => setSettingsOpen(true)}
          taskCounts={getTaskCounts()}
        />
      )}

      <div className="flex-1 overflow-hidden flex flex-col">
        <header className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">
              {activeListId === "my-day"
                ? "My Day"
                : activeListId === "important"
                  ? "Important"
                  : activeListId === "planned"
                    ? "Planned"
                    : activeProfile?.lists.find((l) => l.id === activeListId)?.name || "Tasks"}
            </h1>
            {activeListId === "my-day" && (
              <p className="text-muted-foreground">
                {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
              </p>
            )}
          </div>
          <ProfileSelector
            profiles={profiles}
            activeProfile={activeProfile}
            onProfileSelect={handleProfileSelect}
            onProfileCreate={(profile) => {
              setProfiles([...profiles, profile])
              handleProfileSelect(profile)
            }}
            onProfileEdit={(updatedProfile) => {
              const updatedProfiles = profiles.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
              setProfiles(updatedProfiles)
              if (activeProfile?.id === updatedProfile.id) {
                setActiveProfile(updatedProfile)
              }
            }}
            onProfileDelete={(profileId) => {
              const updatedProfiles = profiles.filter((p) => p.id !== profileId)
              setProfiles(updatedProfiles)
              if (activeProfile?.id === profileId) {
                if (updatedProfiles.length > 0) {
                  handleProfileSelect(updatedProfiles[0])
                } else {
                  setActiveProfile(null)
                  setTasks([])
                  localStorage.removeItem("activeProfileId")
                }
              }
            }}
          />
        </header>

        <main className="flex-1 overflow-auto p-4">
          {activeProfile ? (
            <>
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="flex-1 relative">
                    <Input
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTask()}
                      placeholder="Add a new task..."
                      className="pr-10"
                    />
                    <Button size="icon" variant="ghost" className="absolute right-0 top-0" onClick={addTask}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {getFilteredTasks().map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      viewMode={activeProfile.settings.viewMode}
                      onUpdate={(updatedTask) => {
                        setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)))
                      }}
                      onDelete={(taskId) => {
                        setTasks(tasks.filter((t) => t.id !== taskId))
                      }}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-lg font-medium mb-2">No Profile Selected</h2>
              <p className="text-muted-foreground mb-4">Create or select a profile to start managing your tasks</p>
            </div>
          )}
        </main>
      </div>

      {activeProfile && (
        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          profile={activeProfile}
          onUpdateSettings={(settings) => {
            const updatedProfile = {
              ...activeProfile,
              settings,
            }
            setProfiles(profiles.map((p) => (p.id === activeProfile.id ? updatedProfile : p)))
            setActiveProfile(updatedProfile)
          }}
        />
      )}
    </div>
  )
}

