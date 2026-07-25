"use client";

import { motion } from "motion/react";
import { Search, MoreVertical, UserCheck, UserX, Shield, Mail, Phone, Edit, Trash2, CreditCard, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([
    {
      id: "1",
      username: "johndoe",
      email: "john@example.com",
      full_name: "John Doe",
      role: "visitor",
      is_verified: true,
      is_active: true,
      last_login: "2025-01-15T10:30:00Z",
      created_at: "2024-06-15T08:00:00Z",
      orders_count: 12,
      downloads_count: 45,
    },
    {
      id: "2",
      username: "janesmith",
      email: "jane@example.com",
      full_name: "Jane Smith",
      role: "visitor",
      is_verified: true,
      is_active: true,
      last_login: "2025-01-14T15:45:00Z",
      created_at: "2024-07-22T12:00:00Z",
      orders_count: 8,
      downloads_count: 32,
    },
    {
      id: "3",
      username: "admin",
      email: "admin@photoexhibit.com",
      full_name: "Admin User",
      role: "admin",
      is_verified: true,
      is_active: true,
      last_login: "2025-01-15T09:00:00Z",
      created_at: "2024-01-01T00:00:00Z",
      orders_count: 0,
      downloads_count: 0,
    },
    {
      id: "4",
      username: "inactiveuser",
      email: "inactive@example.com",
      full_name: "Inactive User",
      role: "visitor",
      is_verified: false,
      is_active: false,
      last_login: "2024-12-01T10:00:00Z",
      created_at: "2024-11-15T14:00:00Z",
      orders_count: 0,
      downloads_count: 0,
    },
  ]);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage registered users and their permissions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            {user.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{user.full_name}</p>
                            <p className="text-xs text-muted-foreground">@{user.username}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                          {user.role === "admin" ? (
                            <>
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-3 w-3 mr-1" />
                              Visitor
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? "default" : "secondary"}>
                          {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_verified ? "default" : "outline"}>
                          {user.is_verified ? "Verified" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.orders_count}</TableCell>
                      <TableCell>{user.downloads_count}</TableCell>
                      <TableCell>{user.last_login ? format(new Date(user.last_login), "MMM d, yyyy") : "Never"}</TableCell>
                      <TableCell>{format(new Date(user.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Email User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="h-4 w-4 mr-2" />
                              View Orders
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              View Downloads
                            </DropdownMenuItem>
                            {user.role !== "admin" && (
                              <DropdownMenuItem onClick={() => console.log("Promote", user.id)}>
                                <Shield className="h-4 w-4 mr-2" />
                                Make Admin
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => {
                                setUsers((prev) =>
                                  prev.map((u) =>
                                    u.id === user.id ? { ...u, is_active: !u.is_active } : u
                                  )
                                );
                              }}
                            >
                              {user.is_active ? (
                                <>
                                  <UserX className="h-4 w-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log("Delete", user.id)} className="text-red-500">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}