"use client";

import { motion } from "motion/react";
import {
  MoreVertical,
  Shield,
  UserCheck,
  UserX,
  Trash2,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

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

interface UserTableProps {
  users: AdminUser[];
  isLoading?: boolean;
  onToggleActive?: (id: string, active: boolean) => void;
  onChangeRole?: (id: string, role: string) => void;
  onDelete?: (id: string) => void;
}

export function UserTable({
  users,
  isLoading,
  onToggleActive,
  onChangeRole,
  onDelete,
}: UserTableProps) {
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="text-center py-8">
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Loading users...</span>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (users.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
          No users found
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {users.map((user, index) => (
        <motion.tr
          key={user.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <TableCell>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
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
                "Visitor"
              )}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge variant={user.is_verified ? "default" : "outline"}>
              {user.is_verified ? "Verified" : "Pending"}
            </Badge>
          </TableCell>
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
                {user.role !== "admin" && (
                  <DropdownMenuItem onClick={() => onChangeRole?.(user.id, "admin")}>
                    <Shield className="h-4 w-4 mr-2" />
                    Make Admin
                  </DropdownMenuItem>
                )}
                {user.role === "admin" && (
                  <DropdownMenuItem onClick={() => onChangeRole?.(user.id, "visitor")}>
                    <Shield className="h-4 w-4 mr-2" />
                    Remove Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => onToggleActive?.(user.id, !user.is_active)}
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
                <DropdownMenuItem
                  onClick={() => onDelete?.(user.id)}
                  className="text-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </motion.tr>
      ))}
    </>
  );
}
