"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Edit,
  Key,
  Lock,
  LogOut,
  Mail,
  MoreHorizontal,
  Shield,
  Trash2,
  UserCog,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getUserById,
  availablePermissions,
  hasPermission,
} from "@/lib/user-data";
import { useToast } from "@/hooks/use-toast";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users/$id/")({
  component: UserDetailPage,
});

function UserDetailPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<ReturnType<typeof getUserById>>(undefined);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState(false);
  const { id } = Route.useParams();
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchedUser = getUserById(id);
    setUser(fetchedUser);
    setLoading(false);
  }, [id]);

  const handleDeleteUser = () => {
    toast({
      title: "User Deleted",
      description: `${user?.name} has been removed from the platform.`,
      variant: "destructive",
    });
    setIsDeleteDialogOpen(false);
    router.navigate({ to: "/admin/users" });
  };

  const handleResetPassword = () => {
    toast({
      title: "Password Reset Email Sent",
      description: `A password reset link has been sent to ${user?.email}.`,
    });
    setIsResetPasswordDialogOpen(false);
  };

  const handleStatusToggle = () => {
    if (!user) return;

    const newStatus = user.status === "active" ? "inactive" : "active";

    toast({
      title: `User ${newStatus === "active" ? "Activated" : "Deactivated"}`,
      description: `${user.name} has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
    });

    // In a real app, this would update the user status
    setUser({
      ...user,
      status: newStatus as any,
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default";
      case "admin":
        return "destructive";
      case "manager":
        return "purple";
      case "support":
        return "blue";
      case "analyst":
        return "green";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-12">
        <Button
          variant="ghost"
          onClick={() => router.navigate({ to: "/admin/users" })}
          className="mb-8 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Users</span>
        </Button>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-muted p-3">
            <UserCog className="h-6 w-6" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">User Not Found</h2>
          <p className="mb-6 text-muted-foreground">
            The user you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => router.navigate({ to: "/admin/users" })}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Users</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Button
        variant="ghost"
        onClick={() => router.navigate({ to: "/admin/users" })}
        className="mb-4 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Users</span>
      </Button>

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={user.avatar || "/abstract-profile.png"}
              alt={user.name}
            />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <Badge variant={getRoleBadgeVariant(user.role)} className="gap-1">
                <Shield className="h-3 w-3" />
                <span>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </Badge>
              <Badge
                variant={
                  user.status === "active"
                    ? "success"
                    : user.status === "pending"
                      ? "warning"
                      : "secondary"
                }
              >
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </Badge>
            </div>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() =>
              router.navigate({
                to: `/admin/users/$id`,
                params: { id: user.id },
              })
            }
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <MoreHorizontal className="h-4 w-4" />
                <span>Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setIsResetPasswordDialogOpen(true)}
              >
                <Key className="mr-2 h-4 w-4" />
                Reset Password
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleStatusToggle}>
                {user.status === "active" ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Deactivate Account
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Activate Account
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Force Logout
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="permissions" className="space-y-4">
            <TabsList>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
              <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
            </TabsList>

            <TabsContent value="permissions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Permissions</CardTitle>
                  <CardDescription>
                    Manage what this user can access and modify on the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    {availablePermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{permission.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {permission.description}
                          </p>
                        </div>
                        <Switch checked={hasPermission(user, permission.id)} />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Reset to Role Default</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>
                    Recent activity for this user on the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: "Logged in",
                        time: new Date(2025, 4, 9, 14, 32),
                        ip: "192.168.1.1",
                        location: "New York, USA",
                      },
                      {
                        action: "Updated event 'Summer Music Festival'",
                        time: new Date(2025, 4, 9, 13, 15),
                        ip: "192.168.1.1",
                        location: "New York, USA",
                      },
                      {
                        action: "Created new event",
                        time: new Date(2025, 4, 8, 16, 45),
                        ip: "192.168.1.1",
                        location: "New York, USA",
                      },
                      {
                        action: "Changed password",
                        time: new Date(2025, 4, 7, 10, 20),
                        ip: "192.168.1.1",
                        location: "New York, USA",
                      },
                      {
                        action: "Logged in",
                        time: new Date(2025, 4, 7, 10, 15),
                        ip: "192.168.1.1",
                        location: "New York, USA",
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span>
                              {format(activity.time, "MMM d, yyyy 'at' h:mm a")}
                            </span>
                            <span>IP: {activity.ip}</span>
                            <span>{activity.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Full Activity Log
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>
                    Devices and locations where this user is currently logged
                    in.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        device: "Chrome on Windows",
                        lastActive: new Date(2025, 4, 9, 14, 32),
                        ip: "192.168.1.1",
                        location: "New York, USA",
                        current: true,
                      },
                      {
                        device: "Safari on iPhone",
                        lastActive: new Date(2025, 4, 9, 12, 15),
                        ip: "192.168.1.2",
                        location: "New York, USA",
                        current: false,
                      },
                      {
                        device: "Firefox on MacOS",
                        lastActive: new Date(2025, 4, 8, 18, 45),
                        ip: "192.168.1.3",
                        location: "New York, USA",
                        current: false,
                      },
                    ].map((session, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{session.device}</p>
                              {session.current && (
                                <Badge variant="outline" className="text-xs">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <span>
                                Last active:{" "}
                                {format(
                                  session.lastActive,
                                  "MMM d, yyyy 'at' h:mm a",
                                )}
                              </span>
                              <span>IP: {session.ip}</span>
                              <span>{session.location}</span>
                            </div>
                          </div>
                        </div>
                        {!session.current && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="destructive" className="w-full">
                    Revoke All Other Sessions
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Account Created
                  </p>
                  <p className="font-medium">
                    {format(new Date(user.createdAt), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Active</p>
                  <p className="font-medium">
                    {format(
                      new Date(user.lastActive),
                      "MMMM d, yyyy 'at' h:mm a",
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Two-Factor Authentication
                  </p>
                  <p className="font-medium">
                    {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Two-factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require two-factor authentication for this user
                  </p>
                </div>
                <Switch
                  id="two-factor"
                  defaultChecked={user.twoFactorEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="force-reset">Force Password Reset</Label>
                  <p className="text-sm text-muted-foreground">
                    User will be required to change password on next login
                  </p>
                </div>
                <Switch id="force-reset" />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => setIsResetPasswordDialogOpen(true)}
              >
                <Key className="h-4 w-4" />
                <span>Reset Password</span>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-destructive/20 p-4">
                <h3 className="mb-2 font-medium text-destructive">
                  Delete User Account
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Permanently delete this user account and all associated data.
                  This action cannot be undone.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-4 py-4">
            <Avatar>
              <AvatarImage
                src={user.avatar || "/abstract-profile.png"}
                alt={user.name}
              />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge
                variant={getRoleBadgeVariant(user.role)}
                className="mt-1 gap-1"
              >
                <Shield className="h-3 w-3" />
                <span>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </Badge>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog
        open={isResetPasswordDialogOpen}
        onOpenChange={setIsResetPasswordDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Send a password reset link to this user's email address.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-4 py-4">
            <Avatar>
              <AvatarImage
                src={user.avatar || "/abstract-profile.png"}
                alt={user.name}
              />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResetPasswordDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleResetPassword}>Send Reset Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
