export type Priority = "low" | "medium" | "high"
export type TaskCategory = "work" | "personal" | "shopping" | "other"
export type ViewMode = "comfortable" | "compact"
export type SortOption = "alphabetical" | "dueDate" | "created" | "priority"

export interface SubTask {
  id: string
  description: string
  completed: boolean
}

export interface Task {
  id: string
  description: string
  completed: boolean
  priority: Priority
  category: TaskCategory
  dueDate: string
  dueTime?: string
  createdAt: string
  important: boolean
  notes?: string
  subTasks: SubTask[]
  repeat?: "daily" | "weekly" | "monthly" | "yearly" | null
  attachments: string[] // URLs for now
  inMyDay: boolean
  listId: string
  reminder?: string
}

export interface TaskList {
  id: string
  name: string
  color: string
  icon?: string
}

export interface Profile {
  id: string
  name: string
  color: string
  createdAt: string
  lists: TaskList[]
  settings: {
    viewMode: ViewMode
    sortBy: SortOption
    showCompletedTasks: boolean
    enableSounds: boolean
  }
}

