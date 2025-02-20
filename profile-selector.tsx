"use client"

import { useState } from "react"
import type { Profile } from "./types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Plus, User, Settings } from "lucide-react"

interface ProfileSelectorProps {
  profiles: Profile[]
  activeProfile: Profile | null
  onProfileSelect: (profile: Profile) => void
  onProfileCreate: (profile: Profile) => void
  onProfileEdit: (profile: Profile) => void
  onProfileDelete: (profileId: string) => void
}

export function ProfileSelector({
  profiles,
  activeProfile,
  onProfileSelect,
  onProfileCreate,
  onProfileEdit,
  onProfileDelete,
}: ProfileSelectorProps) {
  const [newProfileName, setNewProfileName] = useState("")
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)

  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
  ]

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      const newProfile: Profile = {
        id: Date.now().toString(),
        name: newProfileName.trim(),
        color: colors[Math.floor(Math.random() * colors.length)],
        createdAt: new Date().toISOString(),
        lists: [],
        settings: {
          viewMode: "comfortable",
          sortBy: "created",
          showCompletedTasks: true,
          enableSounds: true,
        },
      }
      onProfileCreate(newProfile)
      setNewProfileName("")
    }
  }

  const handleEditProfile = () => {
    if (editingProfile && editingProfile.name.trim()) {
      onProfileEdit(editingProfile)
      setEditingProfile(null)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            {activeProfile ? (
              <>
                <span className={`h-2 w-2 rounded-full ${activeProfile.color}`} />
                {activeProfile.name}
              </>
            ) : (
              <>
                <User className="h-4 w-4" />
                Select Profile
              </>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          {profiles.map((profile) => (
            <DropdownMenuItem
              key={profile.id}
              onClick={() => onProfileSelect(profile)}
              className="flex items-center gap-2"
            >
              <span className={`h-2 w-2 rounded-full ${profile.color}`} />
              {profile.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Profile name"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={handleCreateProfile} disabled={!newProfileName.trim()}>
              Create Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {activeProfile && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  placeholder="Profile name"
                  value={editingProfile?.name ?? activeProfile.name}
                  onChange={(e) =>
                    setEditingProfile({
                      ...activeProfile,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-between gap-4">
                <Button variant="destructive" className="flex-1" onClick={() => onProfileDelete(activeProfile.id)}>
                  Delete Profile
                </Button>
                <Button className="flex-1" onClick={handleEditProfile} disabled={!editingProfile?.name.trim()}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

