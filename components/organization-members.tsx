"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Trash2, UserPlus } from "lucide-react"

interface Member {
  id: string
  role: string
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
}

interface OrganizationMembersProps {
  organizationId: string
  members: Member[]
  currentMember: {
    id: string
    role: string
  }
}

export function OrganizationMembers({
  organizationId,
  members,
  currentMember,
}: OrganizationMembersProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("member")
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  const canManage = currentMember.role === "owner" || currentMember.role === "admin"

  const handleAddMember = async () => {
    if (!email) return

    setLoading(true)
    try {
      const response = await fetch(`/api/organizations/${organizationId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to add member")
      }

      toast({
        title: "Success",
        description: "Member added successfully",
      })
      setEmail("")
      setRole("member")
      setShowAddForm(false)
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

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/organizations/${organizationId}/members/${memberId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update role")
      }

      toast({
        title: "Success",
        description: "Member role updated",
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

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return

    setLoading(true)
    try {
      const response = await fetch(
        `/api/organizations/${organizationId}/members/${memberId}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to remove member")
      }

      toast({
        title: "Success",
        description: "Member removed",
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

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        ?.map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return email ? email[0].toUpperCase() : "U"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>Manage organization members</CardDescription>
          </div>
          {canManage && (
            <Button
              size="sm"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && canManage && (
          <div className="p-4 border rounded-lg space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAddMember}
                disabled={loading || !email}
              >
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setEmail("")
                  setRole("member")
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {members?.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.user.image || undefined} />
                  <AvatarFallback>
                    {getInitials(member.user.name, member.user.email)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {member.user.name || member.user.email}
                  </p>
                  <p className="text-xs text-gray-600">{member.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {canManage && member.id !== currentMember.id ? (
                  <>
                    <Select
                      value={member.role}
                      onValueChange={(newRole) =>
                        handleUpdateRole(member.id, newRole)
                      }
                      disabled={loading}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        {currentMember.role === "owner" && (
                          <SelectItem value="owner">Owner</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </>
                ) : (
                  <span className="text-sm capitalize px-2 py-1 bg-gray-100 rounded">
                    {member.role}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}






