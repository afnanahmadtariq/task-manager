import { useState } from "react"
import type { Task, Priority, TaskCategory } from "./types"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Trash2, Edit } from "lucide-react"
import { cn } from "@/lib/utils"
import { priorityColors, isOverdue } from "./utils"

interface TaskListProps {
  tasks: Task[]
  onTaskUpdate: (task: Task) => void
  onTaskDelete: (taskId: string) => void
}

export function TaskList({ tasks, onTaskUpdate, onTaskDelete }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleTaskUpdate = (updatedTask: Task) => {
    onTaskUpdate(updatedTask)
    setEditingTask(null)
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn("flex items-center gap-4 p-4 rounded-lg border", task.completed && "bg-muted/50")}
        >
          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) => onTaskUpdate({ ...task, completed: checked as boolean })}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", priorityColors[task.priority])} />
              <p className={cn("font-medium truncate", task.completed && "line-through text-muted-foreground")}>
                {task.description}
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{task.category}</Badge>
              <Badge
                variant="outline"
                className={cn(isOverdue(task.dueDate) && !task.completed && "text-red-500 border-red-500")}
              >
                Due {format(new Date(task.dueDate), "MMM d, yyyy")}
              </Badge>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setEditingTask(task)}>
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Input
                    defaultValue={task.description}
                    onChange={(e) => setEditingTask((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Select
                      defaultValue={task.priority}
                      onValueChange={(value) =>
                        setEditingTask((prev) => (prev ? { ...prev, priority: value as Priority } : null))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Select
                      defaultValue={task.category}
                      onValueChange={(value) =>
                        setEditingTask((prev) => (prev ? { ...prev, category: value as TaskCategory } : null))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editingTask?.dueDate ? format(new Date(editingTask.dueDate), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editingTask?.dueDate ? new Date(editingTask.dueDate) : undefined}
                        onSelect={(date) =>
                          setEditingTask((prev) =>
                            prev ? { ...prev, dueDate: date?.toISOString() ?? prev.dueDate } : null,
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button className="w-full" onClick={() => editingTask && handleTaskUpdate(editingTask)}>
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" size="icon" onClick={() => onTaskDelete(task.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

