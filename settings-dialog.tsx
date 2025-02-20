import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Profile } from "./types"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: Profile
  onUpdateSettings: (settings: Profile["settings"]) => void
}

export function SettingsDialog({ open, onOpenChange, profile, onUpdateSettings }: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="view-mode">View Mode</Label>
              <Select
                value={profile.settings.viewMode}
                onValueChange={(value) =>
                  onUpdateSettings({
                    ...profile.settings,
                    viewMode: value as Profile["settings"]["viewMode"],
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sort-by">Sort Tasks By</Label>
              <Select
                value={profile.settings.sortBy}
                onValueChange={(value) =>
                  onUpdateSettings({
                    ...profile.settings,
                    sortBy: value as Profile["settings"]["sortBy"],
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="created">Created Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-completed">Show Completed Tasks</Label>
              <Switch
                id="show-completed"
                checked={profile.settings.showCompletedTasks}
                onCheckedChange={(checked) =>
                  onUpdateSettings({
                    ...profile.settings,
                    showCompletedTasks: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="enable-sounds">Enable Sounds</Label>
              <Switch
                id="enable-sounds"
                checked={profile.settings.enableSounds}
                onCheckedChange={(checked) =>
                  onUpdateSettings({
                    ...profile.settings,
                    enableSounds: checked,
                  })
                }
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

