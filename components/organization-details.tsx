"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface OrganizationDetailsProps {
  organization: {
    id: string
    name: string
    slug: string
    createdAt: Date
  }
  currentMember: {
    role: string
  }
}

export function OrganizationDetails({
  organization,
  currentMember,
}: OrganizationDetailsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState(organization.name)
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const canEdit = currentMember.role === "owner" || currentMember.role === "admin"

  const handleUpdate = async () => {
    if (!canEdit) return

    setLoading(true)
    try {
      const response = await fetch(`/api/organizations/${organization.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update")
      }

      toast({
        title: "Success",
        description: "Organization updated successfully",
      })
      setIsEditing(false)
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
    <Card>
      <CardHeader>
        <CardTitle>Organization Details</CardTitle>
        <CardDescription>Manage your organization information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          {isEditing ? (
            <div className="space-y-2">
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleUpdate}
                  disabled={loading}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setName(organization.name)
                    setIsEditing(false)
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm">{organization.name}</p>
              {canEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <p className="text-sm text-gray-600">{organization.slug}</p>
        </div>
        <div className="space-y-2">
          <Label>Created</Label>
          <p className="text-sm text-gray-600">
            {new Date(organization.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="space-y-2">
          <Label>Your Role</Label>
          <p className="text-sm font-medium capitalize">{currentMember.role}</p>
        </div>
      </CardContent>
    </Card>
  )
}






