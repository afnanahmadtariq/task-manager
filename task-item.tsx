"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import type { Task, SubTask } from "./types"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Clock, Star, Sun, Trash2, Link, AlertCircle, Bell, RepeatIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { playCompleteSound } from "./sounds"

interface TaskItemProps {
  task: Task
  viewMode: "comfortable" | "compact"
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
}

export function TaskItem({ task, viewMode, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)
  const [newSubTask, setNewSubTask] = useState("")

  const handleComplete = (checked: boolean) => {
    if (checked) {
      playCompleteSound()
    }
    onUpdate({ ...task, completed: checked })
  }

  const handleAddSubTask = () => {
    if (newSubTask.trim()) {
      const subTask: SubTask = {
        id: Date.now().toString(),
        description: newSubTask.trim(),
        completed: false,
      }
      setEditedTask({
        ...editedTask,
        subTasks: [...editedTask.subTasks, subTask],
      })
      setNewSubTask("")
    }
  }

  const handleSave = () => {
    onUpdate(editedTask)
    setIsEditing(false)
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed

  return (
    <div
      className={cn(
        "group flex items-start gap-4 p-4 rounded-lg border transition-colors hover:bg-muted/50",
        task.completed && "bg-muted/30",
        viewMode === "compact" && "py-2",
      )}
    >
      <Checkbox checked={task.completed} onCheckedChange={handleComplete} className="mt-1" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn("font-medium truncate", task.completed && "line-through text-muted-foreground")}>
            {task.description}
          </p>
          <div className="flex gap-1">
            {task.important && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
            {task.inMyDay && <Sun className="h-4 w-4 fill-blue-400 text-blue-400" />}
            {isOverdue && <AlertCircle className="h-4 w-4 text-red-500" />}
            {task.reminder && <Bell className="h-4 w-4 text-purple-500" />}
            {task.repeat && <RepeatIcon className="h-4 w-4 text-green-500" />}
          </div>
        </div>

        {viewMode === "comfortable" && (
          <>
            {task.subTasks.length > 0 && (
              <div className="mt-2 space-y-1">
                {task.subTasks.map((subTask) => (
                  <div key={subTask.id} className="flex items-center gap-2 pl-4">
                    <Checkbox
                      checked={subTask.completed}
                      onCheckedChange={(checked) => {
                        const updatedSubTasks = task.subTasks.map((st) =>
                          st.id === subTask.id ? { ...st, completed: checked as boolean } : st,
                        )
                        onUpdate({ ...task, subTasks: updatedSubTasks })
                      }}
                      className="h-4 w-4"
                    />
                    <span className={cn("text-sm", subTask.completed && "line-through text-muted-foreground")}>
                      {subTask.description}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {task.notes && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{task.notes}</p>}

            <div className="mt-2 flex flex-wrap gap-2">
              {task.dueDate && (
                <Badge variant="outline" className={cn(isOverdue && "text-red-500 border-red-500")}>
                  {format(new Date(task.dueDate), "MMM d, yyyy")}
                  {task.dueTime && ` at ${task.dueTime}`}
                </Badge>
              )}
              <Badge variant="secondary">{task.category}</Badge>
              {task.attachments.map((url, index) => (
                <Badge key={index} variant="outline" className="flex gap-1">
                  <Link className="h-3 w-3" />
                  Attachment {index + 1}
                </Badge>
              ))}
            </div>
          </>
        )}
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
            <Clock className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={editedTask.notes || ""}
                onChange={(e) => setEditedTask({ ...editedTask, notes: e.target.value })}
                placeholder="Add notes..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editedTask.dueDate ? format(new Date(editedTask.dueDate), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editedTask.dueDate ? new Date(editedTask.dueDate) : undefined}
                      onSelect={(date) =>
                        setEditedTask({
                          ...editedTask,
                          dueDate: date?.toISOString() ?? "",
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Due Time</Label>
                <Input
                  type="time"
                  value={editedTask.dueTime || ""}
                  onChange={(e) => setEditedTask({ ...editedTask, dueTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sub-tasks</Label>
              <div className="space-y-2">
                {editedTask.subTasks.map((subTask, index) => (
                  <div key={subTask.id} className="flex gap-2">
                    <Input
                      value={subTask.description}
                      onChange={(e) => {
                        const updatedSubTasks = [...editedTask.subTasks]
                        updatedSubTasks[index] = {
                          ...subTask,
                          description: e.target.value,
                        }
                        setEditedTask({ ...editedTask, subTasks: updatedSubTasks })
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updatedSubTasks = editedTask.subTasks.filter((st) => st.id !== subTask.id)
                        setEditedTask({ ...editedTask, subTasks: updatedSubTasks })
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add sub-task..."
                    value={newSubTask}
                    onChange={(e) => setNewSubTask(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddSubTask()
                      }
                    }}
                  />
                  <Button onClick={handleAddSubTask}>Add</Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={editedTask.priority}
                  onValueChange={(value) =>
                    setEditedTask({
                      ...editedTask,
                      priority: value as Task["priority"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Repeat</Label>
                <Select
                  value={editedTask.repeat || "none"}
                  onValueChange={(value) =>
                    setEditedTask({
                      ...editedTask,
                      repeat: value === "none" ? null : (value as Task["repeat"]),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No repeat</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete(task.id)
                  setIsEditing(false)
                }}
              >
                Delete Task
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditedTask(task)
                    setIsEditing(false)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100"
        onClick={() => onDelete(task.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

