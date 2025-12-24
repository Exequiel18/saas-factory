"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface UserSettingsProps {
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
    createdAt: Date
  }
}

export function UserSettings({ user }: UserSettingsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState(user.name || "")
  const [loading, setLoading] = useState(false)

  const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
    try {
      if (name && typeof name === 'string' && name.trim()) {
        const parts = name.trim().split(/\s+/).filter(Boolean)
        return parts
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      }
      if (email && typeof email === 'string' && email.trim()) {
        return email.trim()[0].toUpperCase()
      }
    } catch (e) { }
    return "U"
  }

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update profile")
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="text-lg">
                {getInitials(user.name, user.email)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name || user.email}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">
              Email cannot be changed
            </p>
          </div>

          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Member since</Label>
            <p className="text-sm text-gray-600">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}






