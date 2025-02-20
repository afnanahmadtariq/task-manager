"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, Star, Sun, Circle, Plus, Settings } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { TaskList } from "./types"

interface SidebarProps {
  lists: TaskList[]
  activeListId: string | null
  onListSelect: (listId: string | null) => void
  onListCreate: (list: TaskList) => void
  onSettingsClick: () => void
  taskCounts: {
    myDay: number
    important: number
    planned: number
    [key: string]: number
  }
}

export function Sidebar({
  lists,
  activeListId,
  onListSelect,
  onListCreate,
  onSettingsClick,
  taskCounts,
}: SidebarProps) {
  const [newListName, setNewListName] = useState("")

  const handleCreateList = () => {
    if (newListName.trim()) {
      const newList: TaskList = {
        id: Date.now().toString(),
        name: newListName.trim(),
        color: `bg-${["blue", "green", "red", "yellow", "purple", "pink"][Math.floor(Math.random() * 6)]}-500`,
      }
      onListCreate(newList)
      setNewListName("")
    }
  }

  return (
    <div className="w-64 h-full border-r bg-muted/30">
      <div className="p-4 space-y-4">
        <nav className="space-y-2">
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", activeListId === "my-day" && "bg-muted")}
            onClick={() => onListSelect("my-day")}
          >
            <Sun className="h-4 w-4" />
            My Day
            {taskCounts.myDay > 0 && <span className="ml-auto text-muted-foreground">{taskCounts.myDay}</span>}
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", activeListId === "important" && "bg-muted")}
            onClick={() => onListSelect("important")}
          >
            <Star className="h-4 w-4" />
            Important
            {taskCounts.important > 0 && <span className="ml-auto text-muted-foreground">{taskCounts.important}</span>}
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", activeListId === "planned" && "bg-muted")}
            onClick={() => onListSelect("planned")}
          >
            <Calendar className="h-4 w-4" />
            Planned
            {taskCounts.planned > 0 && <span className="ml-auto text-muted-foreground">{taskCounts.planned}</span>}
          </Button>
        </nav>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">Lists</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New List</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="list-name">List Name</Label>
                    <Input
                      id="list-name"
                      placeholder="Enter list name"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" onClick={handleCreateList} disabled={!newListName.trim()}>
                    Create List
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <nav className="space-y-2">
            {lists.map((list) => (
              <Button
                key={list.id}
                variant="ghost"
                className={cn("w-full justify-start gap-2", activeListId === list.id && "bg-muted")}
                onClick={() => onListSelect(list.id)}
              >
                <Circle className={cn("h-4 w-4", list.color)} />
                {list.name}
                {taskCounts[list.id] > 0 && (
                  <span className="ml-auto text-muted-foreground">{taskCounts[list.id]}</span>
                )}
              </Button>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t">
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={onSettingsClick}>
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  )
}

