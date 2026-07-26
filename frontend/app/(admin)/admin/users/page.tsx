"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { UserTable } from "@/components/admin/UserTable";
import api from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_verified: boolean;
  is_active?: boolean;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearch = useDebounce(search, 500);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/admin/users");
      const items = data.items || data;
      setUsers(Array.isArray(items) ? items : []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await api.put(`/admin/users/${id}/role`, null, {
        params: { role: users.find((u) => u.id === id)?.role || "visitor" },
      });
      toast.success(active ? "User activated" : "User deactivated");
      fetchUsers();
    } catch {
      toast.error("Failed to update user");
    }
  };

  const handleChangeRole = async (id: string, role: string) => {
    try {
      await api.put(`/admin/users/${id}/role`, null, { params: { role } });
      toast.success(`User role changed to ${role}`);
      fetchUsers();
    } catch {
      toast.error("Failed to update user role");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      u.full_name.toLowerCase().includes(debouncedSearch.toLowerCase())
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
                  <TableHead>Verified</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <UserTable
                  users={filteredUsers}
                  isLoading={isLoading}
                  onToggleActive={handleToggleActive}
                  onChangeRole={handleChangeRole}
                  onDelete={handleDelete}
                />
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
