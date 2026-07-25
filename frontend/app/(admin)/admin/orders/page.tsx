"use client";

import { motion } from "motion/react";
import { Search, MoreVertical, Eye, CreditCard, Package, RefreshCw, CheckCircle, XCircle, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, formatDistanceToNow } from "date-fns";
import { useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([
    {
      id: "1",
      order_number: "ORD-2025-000001",
      user: { username: "johndoe", email: "john@example.com", full_name: "John Doe" },
      status: "paid",
      total_amount: 149.97,
      currency: "USD",
      payment_provider: "stripe",
      items: [
        { photo_title: "Mountain Sunset", price: 49.99 },
        { photo_title: "Ocean Waves", price: 49.99 },
        { photo_title: "Forest Path", price: 49.99 },
      ],
      created_at: "2025-01-10T14:30:00Z",
      paid_at: "2025-01-10T14:32:00Z",
    },
    {
      id: "2",
      order_number: "ORD-2025-000002",
      user: { username: "janesmith", email: "jane@example.com", full_name: "Jane Smith" },
      status: "pending",
      total_amount: 79.98,
      currency: "USD",
      payment_provider: "paypal",
      items: [{ photo_title: "City Lights", price: 79.98 }],
      created_at: "2025-01-12T09:15:00Z",
      paid_at: null,
    },
    {
      id: "3",
      order_number: "ORD-2025-000003",
      user: { username: "johndoe", email: "john@example.com", full_name: "John Doe" },
      status: "completed",
      total_amount: 249.95,
      currency: "USD",
      payment_provider: "stripe",
      items: [
        { photo_title: "Wildlife Series", price: 199.99 },
        { photo_title: "Golden Hour", price: 49.99 },
      ],
      created_at: "2025-01-08T16:45:00Z",
      paid_at: "2025-01-08T16:47:00Z",
    },
    {
      id: "4",
      order_number: "ORD-2025-000004",
      user: { username: "bobwilson", email: "bob@example.com", full_name: "Bob Wilson" },
      status: "failed",
      total_amount: 99.99,
      currency: "USD",
      payment_provider: "razorpay",
      items: [{ photo_title: "Desert Dunes", price: 99.99 }],
      created_at: "2025-01-05T11:20:00Z",
      paid_at: null,
    },
  ]);
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter(
    (o) =>
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.user.username.toLowerCase().includes(search.toLowerCase()) ||
      o.user.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      paid: "default",
      completed: "default",
      pending: "secondary",
      failed: "destructive",
      refunded: "outline",
    };
    return <Badge variant={variants[status] || "secondary"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">View and manage customer orders</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
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
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TableCell className="font-mono font-medium">{order.order_number}</TableCell>
                      <TableCell>
                        <p className="font-medium">{order.user.full_name}</p>
                        <p className="text-xs text-muted-foreground">@{order.user.username}</p>
                        <p className="text-xs text-muted-foreground">{order.user.email}</p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.items.map((item, i) => (
                            <p key={i} className="text-sm truncate max-w-xs">
                              {item.photo_title} - ${item.price.toFixed(2)}
                            </p>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <DollarSign className="h-4 w-4 inline mr-1" />
                        {order.total_amount.toFixed(2)} {order.currency}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {order.payment_provider}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{format(new Date(order.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => console.log("View", order.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log("Invoice", order.id)}>
                              <CreditCard className="h-4 w-4 mr-2" />
                              Download Invoice
                            </DropdownMenuItem>
                            {order.status === "paid" && (
                              <DropdownMenuItem onClick={() => console.log("Refund", order.id)}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Process Refund
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => console.log("Resend", order.id)} className="text-blue-500">
                              Resend Confirmation Email
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