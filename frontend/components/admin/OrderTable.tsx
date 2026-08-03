"use client";

import { motion } from "motion/react";
import { MoreVertical, Eye, RotateCcw } from "lucide-react";
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
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Order } from "@/lib/types";

interface OrderTableProps {
  orders: Order[];
  isLoading?: boolean;
  onRefund?: (id: string) => void;
  onView?: (id: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-orange-100 text-orange-800",
};

export function OrderTable({
  orders,
  isLoading,
  onRefund,
  onView,
}: OrderTableProps) {
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center py-8">
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Loading orders...</span>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (orders.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
          No orders found
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {orders.map((order, index) => (
        <motion.tr
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <TableCell>
            <p className="font-mono text-sm">{order.order_number}</p>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <span className="font-medium">{formatCurrency(order.total_amount)}</span>
              <span className="text-xs text-muted-foreground">{order.currency}</span>
            </div>
          </TableCell>
          <TableCell>
            <Badge variant="outline" className="capitalize">
              {order.payment_provider}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge className={STATUS_STYLES[order.status] || ""}>
              {order.status}
            </Badge>
          </TableCell>
          <TableCell>{formatDate(order.created_at)}</TableCell>
          <TableCell className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView?.(order.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                {order.status === "paid" && (
                  <DropdownMenuItem
                    onClick={() => onRefund?.(order.id)}
                    className="text-orange-500"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Refund
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </motion.tr>
      ))}
    </>
  );
}
