"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from '@tanstack/react-router'
import { format, formatDistanceToNow } from "date-fns";
import {
  ArrowUpDown,
  Check,
  Filter,
  MoreHorizontal,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Trash2,
  UserCog,
  UserPlus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Badge } from "@repo/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { Switch } from "@repo/ui/switch";
import { Label } from "@repo/ui/label";
import {
  getAllUsers,
  availablePermissions,
  type User,
  type UserRole,
} from "@/lib/user-data";
import { useToast } from "@/hooks/use-toast";


export const Route = createFileRoute({
  component: UsersPage,
});

function UsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "role" | "lastActive">(
    "lastActive",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);

  // Get all users
  const allUsers = getAllUsers();

  // Filter users based on search query, role, and status
  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = !filterRole || user.role === filterRole;
    const matchesStatus = !filterStatus || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "role") {
      comparison = a.role.localeCompare(b.role);
    } else if (sortBy === "lastActive") {
      comparison =
        new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleSort = (column: "name" | "role" | "lastActive") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleAddUser = () => {
    toast({
      title: "User Added",
      description: "The new user has been added successfully.",
    });
    setIsAddUserOpen(false);
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    toast({
      title: "User Updated",
      description: `${selectedUser.name}'s information has been updated.`,
    });
    setIsEditUserOpen(false);
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;

    toast({
      title: "User Deleted",
      description: `${selectedUser.name} has been removed from the platform.`,
      variant: "destructive",
    });
    setIsDeleteUserOpen(false);
  };

  const getRoleBadgeVariant = (role: UserRole) => {
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

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "owner":
        return <ShieldAlert className="h-4 w-4" />;
      case "admin":
        return <ShieldCheck className="h-4 w-4" />;
      case "manager":
        return <Shield className="h-4 w-4" />;
      case "support":
        return <UserCog className="h-4 w-4" />;
      case "analyst":
        return <ShieldQuestion className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      case "pending":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <Button
          onClick={() => setIsAddUserOpen(true)}
          className="gap-2 rounded-full"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add User</span>
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={filterRole || "all"}
            onValueChange={(value) =>
              setFilterRole(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-[150px] gap-1">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="analyst">Analyst</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterStatus || "all"}
            onValueChange={(value) =>
              setFilterStatus(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-[150px] gap-1">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <CardTitle>Platform Users</CardTitle>
            <CardDescription>{sortedUsers.length} users total</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <Button
                    variant="ghost"
                    className="gap-1 p-0 hover:bg-transparent"
                    onClick={() => handleSort("name")}
                  >
                    <span>Name</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="gap-1 p-0 hover:bg-transparent"
                    onClick={() => handleSort("role")}
                  >
                    <span>Role</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="gap-1 p-0 hover:bg-transparent"
                    onClick={() => handleSort("lastActive")}
                  >
                    <span>Last Active</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                sortedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={user.avatar || "/abstract-profile.png"}
                            alt={user.name}
                          />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Created{" "}
                            {format(new Date(user.createdAt), "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getRoleBadgeVariant(user.role)}
                        className="gap-1"
                      >
                        {getRoleIcon(user.role)}
                        <span>
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(user.status)}>
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(user.lastActive), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setIsEditUserOpen(true);
                            }}
                          >
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Activity Log</DropdownMenuItem>
                          <DropdownMenuItem>Reset Password</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteUserOpen(true);
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account and set their permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select defaultValue="support">
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue="pending">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Security Settings</Label>
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between space-y-0">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">
                      Two-factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Require two-factor authentication for this user
                    </p>
                  </div>
                  <Switch id="two-factor" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              <Tabs defaultValue="preset">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preset">Role Presets</TabsTrigger>
                  <TabsTrigger value="custom">Custom Permissions</TabsTrigger>
                </TabsList>
                <TabsContent value="preset" className="space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground">
                    This user will have all permissions associated with the
                    selected role.
                  </p>
                </TabsContent>
                <TabsContent value="custom" className="space-y-4 pt-4">
                  <div className="grid gap-2">
                    {availablePermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox id={`permission-${permission.id}`} />
                        <div className="grid gap-1.5 leading-none">
                          <Label
                            htmlFor={`permission-${permission.id}`}
                            className="text-sm font-medium"
                          >
                            {permission.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      {selectedUser && (
        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and permissions.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedUser.avatar || "/abstract-profile.png"}
                    alt={selectedUser.name}
                  />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input id="edit-name" defaultValue={selectedUser.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email Address</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    defaultValue={selectedUser.email}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select defaultValue={selectedUser.role}>
                    <SelectTrigger id="edit-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select defaultValue={selectedUser.status}>
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Security Settings</Label>
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <Label htmlFor="edit-two-factor">
                        Two-factor Authentication
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Require two-factor authentication for this user
                      </p>
                    </div>
                    <Switch
                      id="edit-two-factor"
                      defaultChecked={selectedUser.twoFactorEnabled}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Permissions</Label>
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <Check className="h-3 w-3" />
                    <span>Reset to Role Default</span>
                  </Button>
                </div>
                <div className="max-h-[200px] overflow-y-auto rounded-md border p-4">
                  <div className="grid gap-2">
                    {availablePermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`edit-permission-${permission.id}`}
                          defaultChecked={selectedUser.permissions.includes(
                            permission.id,
                          )}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label
                            htmlFor={`edit-permission-${permission.id}`}
                            className="text-sm font-medium"
                          >
                            {permission.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditUserOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditUser}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete User Dialog */}
      {selectedUser && (
        <Dialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
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
                  src={selectedUser.avatar || "/abstract-profile.png"}
                  alt={selectedUser.name}
                />
                <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{selectedUser.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.email}
                </p>
                <Badge
                  variant={getRoleBadgeVariant(selectedUser.role)}
                  className="mt-1 gap-1"
                >
                  {getRoleIcon(selectedUser.role)}
                  <span>
                    {selectedUser.role.charAt(0).toUpperCase() +
                      selectedUser.role.slice(1)}
                  </span>
                </Badge>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteUserOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser}>
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function Checkbox(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        {...props}
      />
    </div>
  );
}
