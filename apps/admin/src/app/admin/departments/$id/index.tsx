"use client";

import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import { useSession } from "@/components/session-provider";
import { Pencil, ArrowLeft, Users, BarChart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Department } from "@/types/department";
import { getDepartmentById } from "@/lib/api/departments";
import { createFileRoute, useParams } from "@tanstack/react-router";


export const Route = createFileRoute("/admin/departments/$id/")({ 
  component: DepartmentDetailPage,
}) 

function DepartmentDetailPage() {
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = Route.useParams();

  const organizationId = session?.user?.organizationId;

  useEffect(() => {
    if (organizationId) {
      fetchDepartment();
    }
  }, [organizationId, id]);

  const fetchDepartment = async () => {
    if (!organizationId) return;

    setLoading(true);
    try {
      const data = await getDepartmentById(id, organizationId);
      setDepartment(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch department details",
        variant: "destructive",
      });
      console.error("Error fetching department:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="h-40 flex items-center justify-center">
          <p>Loading department details...</p>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <h2 className="text-xl font-semibold mb-2">
                Department Not Found
              </h2>
              <p className="text-muted-foreground mb-4">
                The department you're looking for doesn't exist or you don't
                have permission to view it.
              </p>
              <Button asChild>
                <Link to="/admin/departments">Go to Departments</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{department.name}</h1>
          <div className="flex items-center mt-2 space-x-2">
            <Badge variant={department.isActive ? "default" : "secondary"}>
              {department.isActive ? "Active" : "Inactive"}
            </Badge>
            {department.code && (
              <Badge variant="outline">{department.code}</Badge>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button asChild variant="outline">
            <Link to="/admin/departments/$id" params={{ id: department.id }}>
              <Users className="mr-2 h-4 w-4" />
              Manage Members
            </Link>
          </Button>
          <Button asChild>
            <Link to="/admin/departments/$id" params={{ id: department.id }}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Department
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Department Information</CardTitle>
              </CardHeader>
              <CardContent>
                {department.description ? (
                  <p className="text-sm leading-relaxed">
                    {department.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No description provided
                  </p>
                )}

                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Slug
                      </h3>
                      <p className="text-sm mt-1">{department.slug}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Code
                      </h3>
                      <p className="text-sm mt-1">{department.code || "N/A"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Parent Department
                      </h3>
                      <p className="text-sm mt-1">
                        {department.parentDepartment ? (
                          <Link
                            to="/admin/departments/$id" params={{ id: department.parentDepartment.id }}
                            className="text-primary hover:underline"
                          >
                            {department.parentDepartment.name}
                          </Link>
                        ) : (
                          "None (Top Level)"
                        )}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Created
                      </h3>
                      <p className="text-sm mt-1">
                        {new Date(department.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Department Contact
                    </h3>
                    <div className="text-sm mt-1">
                      {department.settings?.contactEmail ? (
                        <p>Email: {department.settings.contactEmail}</p>
                      ) : null}
                      {department.settings?.contactPhone ? (
                        <p>Phone: {department.settings.contactPhone}</p>
                      ) : null}
                      {department.settings?.location ? (
                        <p>Location: {department.settings.location}</p>
                      ) : null}
                      {!department.settings?.contactEmail &&
                        !department.settings?.contactPhone &&
                        !department.settings?.location && (
                          <p className="text-muted-foreground italic">
                            No contact information
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium">Total Members</span>
                    <span className="text-sm">
                      {department.users?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium">
                      Child Departments
                    </span>
                    <span className="text-sm">
                      {department.childDepartments?.length || 0}
                    </span>
                  </div>
                  {department.childDepartments &&
                    department.childDepartments.length > 0 && (
                      <div className="pt-2">
                        <h3 className="text-sm font-medium mb-2">
                          Sub-departments
                        </h3>
                        <ul className="space-y-2">
                          {department.childDepartments.map((child) => (
                            <li key={child.id}>
                              <Link
                                to="/admin/departments/$id" params={{ id: child.id }}
                                className="text-sm text-primary hover:underline block p-2 rounded-md border"
                              >
                                {child.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Department Members</span>
                <Button asChild size="sm">
                  <Link to="/admin/departments/$id" params={{ id: department.id }}>
                    <Users className="mr-2 h-4 w-4" />
                    Manage Members
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {department.users && department.users.length > 0 ? (
                <div className="space-y-4">
                  {department.users.map((user) => (
                    <div
                      key={user.id}
                      className="flex justify-between items-center p-3 rounded-md border"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <span className="text-xs font-medium">
                              {user.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">
                    No members in this department
                  </p>
                  <Button asChild>
                    <Link to="/admin/departments/$id" params={{ id: department.id }}>
                      Add Members
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Department Settings</span>
                <Button asChild size="sm">
                  <Link to="/admin/departments/$id" params={{ id: department.id }}>
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Settings
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Appearance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded-md border"
                        style={{
                          backgroundColor:
                            department.settings?.color || "#3498db",
                        }}
                      />
                      <span className="text-sm">
                        {department.settings?.color || "#3498db"}
                      </span>
                    </div>
                    {department.settings?.icon && (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 flex items-center justify-center">
                          <span className="text-sm">
                            {department.settings.icon}
                          </span>
                        </div>
                        <span className="text-sm">Department Icon</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Ticket Settings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Auto-assign Tickets</span>
                      <Badge
                        variant={
                          department.settings?.autoAssignTickets
                            ? "default"
                            : "secondary"
                        }
                      >
                        {department.settings?.autoAssignTickets
                          ? "Enabled"
                          : "Disabled"}
                      </Badge>
                    </div>

                    {department.settings?.defaultTicketAssignee && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Default Assignee</span>
                        <span className="text-sm">
                          {department.settings.defaultTicketAssignee}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Notification Preferences
                  </h3>
                  {department.settings?.notificationPreferences ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">New Tickets</span>
                        <Badge
                          variant={
                            department.settings.notificationPreferences
                              .newTicket
                              ? "default"
                              : "secondary"
                          }
                        >
                          {department.settings.notificationPreferences.newTicket
                            ? "Enabled"
                            : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Ticket Assignments</span>
                        <Badge
                          variant={
                            department.settings.notificationPreferences
                              .ticketAssigned
                              ? "default"
                              : "secondary"
                          }
                        >
                          {department.settings.notificationPreferences
                            .ticketAssigned
                            ? "Enabled"
                            : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Ticket Closures</span>
                        <Badge
                          variant={
                            department.settings.notificationPreferences
                              .ticketClosed
                              ? "default"
                              : "secondary"
                          }
                        >
                          {department.settings.notificationPreferences
                            .ticketClosed
                            ? "Enabled"
                            : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Daily Summary</span>
                        <Badge
                          variant={
                            department.settings.notificationPreferences
                              .dailySummary
                              ? "default"
                              : "secondary"
                          }
                        >
                          {department.settings.notificationPreferences
                            .dailySummary
                            ? "Enabled"
                            : "Disabled"}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No notification preferences configured
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
