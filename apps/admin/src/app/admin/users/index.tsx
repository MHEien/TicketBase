"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
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
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  availablePermissions,
  rolePermissions,
  type User,
  type UserRole,
  type CreateUserDto,
  type UpdateUserDto,
  type PaginatedUsersResponse,
} from "@/lib/api/users-api";
import { useToast } from "@/hooks/use-toast";
import { createFileRoute } from "@tanstack/react-router";
import { 
  useCanCreateUsers, 
  useCanUpdateUsers, 
  useCanDeleteUsers, 
  useCanViewActivities 
} from "@/hooks/use-permissions";
import { ActivityLog } from "@/components/activity-log";

export const Route = createFileRoute("/admin/users/")({
  component: UsersPage,
});

function UsersPage() {
  const router = useRouter();
  const { toast } = useToast();

  // State for users data
  const [usersData, setUsersData] = useState<PaginatedUsersResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters and search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "role" | "lastActive">(
    "lastActive",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // State for dialogs
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);

  // Permission checks
  const canCreateUsers = useCanCreateUsers();
  const canUpdateUsers = useCanUpdateUsers();
  const canDeleteUsers = useCanDeleteUsers();
  const canViewActivities = useCanViewActivities();

  // State for form data
  const [newUserData, setNewUserData] = useState<Partial<CreateUserDto>>({
    role: "support",
    status: "pending",
    twoFactorEnabled: false,
    permissions: rolePermissions.support,
  });
  const [editUserData, setEditUserData] = useState<Partial<UpdateUserDto>>({});

  // Fetch users data
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        search: searchQuery || undefined,
        role: (filterRole as any) || undefined,
        status: (filterStatus as any) || undefined,
        page: currentPage,
        limit: pageSize,
        sortBy: sortBy,
        sortOrder: sortOrder.toUpperCase() as "ASC" | "DESC",
      };

      const data = await fetchUsers(params);
      setUsersData(data);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Failed to load users. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount and when filters change
  useEffect(() => {
    loadUsers();
  }, [searchQuery, filterRole, filterStatus, sortBy, sortOrder, currentPage]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSort = (column: "name" | "role" | "lastActive") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleAddUser = async () => {
    try {
      if (!newUserData.name || !newUserData.email || !newUserData.password) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      await createUser(newUserData as CreateUserDto);

      toast({
        title: "User Added",
        description: "The new user has been added successfully.",
      });

      setIsAddUserOpen(false);
      setNewUserData({
        role: "support",
        status: "pending",
        twoFactorEnabled: false,
        permissions: rolePermissions.support,
      });
      loadUsers(); // Refresh the list
    } catch (err) {
      console.error("Error creating user:", err);
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      await updateUser(selectedUser.id, editUserData);

      toast({
        title: "User Updated",
        description: `${selectedUser.name}'s information has been updated.`,
      });

      setIsEditUserOpen(false);
      setEditUserData({});
      loadUsers(); // Refresh the list
    } catch (err) {
      console.error("Error updating user:", err);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);

      toast({
        title: "User Deleted",
        description: `${selectedUser.name} has been removed from the platform.`,
        variant: "destructive",
      });

      setIsDeleteUserOpen(false);
      loadUsers(); // Refresh the list
    } catch (err) {
      console.error("Error deleting user:", err);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setNewUserData({
      ...newUserData,
      role,
      permissions: rolePermissions[role],
    });
  };

  const handleEditRoleChange = (role: UserRole) => {
    setEditUserData({
      ...editUserData,
      role,
      permissions: rolePermissions[role],
    });
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

  if (loading && !usersData) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading users...</span>
        </div>
      </div>
    );
  }

  if (error && !usersData) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadUsers}>Try Again</Button>
        </div>
      </div>
    );
  }

  const users = usersData?.users || [];
  const totalUsers = usersData?.total || 0;
  const totalPages = usersData?.totalPages || 1;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        {canCreateUsers && (
          <Button
            onClick={() => setIsAddUserOpen(true)}
            className="gap-2 rounded-full"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </Button>
        )}
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
            <CardDescription>
              {loading ? "Loading..." : `${totalUsers} users total`}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading users...</span>
            </div>
          ) : (
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
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={user.avatar || "/abstract-profile.png"}
                              alt={user.name}
                            />
                            <AvatarFallback>
                              {user.name.charAt(0)}
                            </AvatarFallback>
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
                            {canUpdateUsers && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setEditUserData({
                                    name: user.name,
                                    email: user.email,
                                    role: user.role,
                                    status: user.status,
                                    permissions: user.permissions,
                                    twoFactorEnabled: user.twoFactorEnabled,
                                    departmentId: user.departmentId,
                                  });
                                  setIsEditUserOpen(true);
                                }}
                              >
                                Edit User
                              </DropdownMenuItem>
                            )}
                            {canViewActivities && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsActivityLogOpen(true);
                                }}
                              >
                                View Activity Log
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                            {(canUpdateUsers || canDeleteUsers) && <DropdownMenuSeparator />}
                            {canDeleteUsers && (
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
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers} users
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Activity Log Dialog */}
      {selectedUser && (
        <ActivityLog
          isOpen={isActivityLogOpen}
          onOpenChange={setIsActivityLogOpen}
          userId={selectedUser.id}
          title={`Activity Log - ${selectedUser.name}`}
        />
      )}

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
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={newUserData.name || ""}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newUserData.email || ""}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={newUserData.password || ""}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, password: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUserData.role}
                  onValueChange={(value) => handleRoleChange(value as UserRole)}
                >
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
                <Select
                  value={newUserData.status}
                  onValueChange={(value) =>
                    setNewUserData({ ...newUserData, status: value as any })
                  }
                >
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
                  <Switch
                    id="two-factor"
                    checked={newUserData.twoFactorEnabled}
                    onCheckedChange={(checked) =>
                      setNewUserData({
                        ...newUserData,
                        twoFactorEnabled: checked,
                      })
                    }
                  />
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
                        <Checkbox
                          id={`permission-${permission.id}`}
                          checked={newUserData.permissions?.includes(
                            permission.id,
                          )}
                          onCheckedChange={(checked) => {
                            const currentPermissions =
                              newUserData.permissions || [];
                            const newPermissions = checked
                              ? [...currentPermissions, permission.id]
                              : currentPermissions.filter(
                                  (p) => p !== permission.id,
                                );
                            setNewUserData({
                              ...newUserData,
                              permissions: newPermissions,
                            });
                          }}
                        />
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
                  <Input
                    id="edit-name"
                    value={editUserData.name || ""}
                    onChange={(e) =>
                      setEditUserData({ ...editUserData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email Address</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editUserData.email || ""}
                    onChange={(e) =>
                      setEditUserData({
                        ...editUserData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select
                    value={editUserData.role}
                    onValueChange={(value) =>
                      handleEditRoleChange(value as UserRole)
                    }
                  >
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
                  <Select
                    value={editUserData.status}
                    onValueChange={(value) =>
                      setEditUserData({ ...editUserData, status: value as any })
                    }
                  >
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
                      checked={editUserData.twoFactorEnabled}
                      onCheckedChange={(checked) =>
                        setEditUserData({
                          ...editUserData,
                          twoFactorEnabled: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Permissions</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-xs"
                    onClick={() => {
                      if (editUserData.role) {
                        setEditUserData({
                          ...editUserData,
                          permissions: rolePermissions[editUserData.role],
                        });
                      }
                    }}
                  >
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
                          checked={editUserData.permissions?.includes(
                            permission.id,
                          )}
                          onCheckedChange={(checked) => {
                            const currentPermissions =
                              editUserData.permissions || [];
                            const newPermissions = checked
                              ? [...currentPermissions, permission.id]
                              : currentPermissions.filter(
                                  (p) => p !== permission.id,
                                );
                            setEditUserData({
                              ...editUserData,
                              permissions: newPermissions,
                            });
                          }}
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

function Checkbox(
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  },
) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        {...props}
        checked={props.checked}
        onChange={(e) => props.onCheckedChange?.(e.target.checked)}
      />
    </div>
  );
}
