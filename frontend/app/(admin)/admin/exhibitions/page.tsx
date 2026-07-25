"use client";

import { motion } from "motion/react";
import { Plus, Search, Edit, Trash2, MoreVertical, Calendar, MapPin, Globe, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";

export default function ExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState([
    {
      id: "1",
      title: "Nature's Canvas",
      venue: "City Art Gallery",
      location: "New York, NY",
      start_date: "2025-01-15",
      end_date: "2025-03-15",
      is_virtual: false,
      is_published: true,
      photo_count: 24,
    },
    {
      id: "2",
      title: "Urban Perspectives",
      venue: "Modern Art Museum",
      location: "Los Angeles, CA",
      start_date: "2025-04-01",
      end_date: "2025-06-30",
      is_virtual: true,
      exhibition_url: "https://virtual.exhibit/urban",
      is_published: true,
      photo_count: 18,
    },
    {
      id: "3",
      title: "Wildlife Wonders",
      venue: "National History Museum",
      location: "Washington, DC",
      start_date: "2025-07-01",
      end_date: "2025-09-30",
      is_virtual: false,
      is_published: false,
      photo_count: 32,
    },
  ]);
  const [search, setSearch] = useState("");

  const filteredExhibitions = exhibitions.filter(
    (e) => e.title.toLowerCase().includes(search.toLowerCase()) || e.venue.toLowerCase().includes(search.toLowerCase())
  );

  const getStatus = (ex: typeof exhibitions[0]) => {
    const now = new Date();
    const start = new Date(ex.start_date);
    const end = new Date(ex.end_date);
    
    if (!ex.is_published) return { label: "Draft", variant: "secondary" as const };
    if (now < start) return { label: "Upcoming", variant: "default" as const };
    if (now > end) return { label: "Ended", variant: "outline" as const };
    return { label: "Active", variant: "default" as const };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exhibitions Management</h1>
          <p className="text-muted-foreground">Manage exhibitions and shows</p>
        </div>
        <Link href="/admin/exhibitions/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Exhibition
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exhibitions..."
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
                  <TableHead>Cover</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Venue / Location</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Photos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExhibitions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No exhibitions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExhibitions.map((ex, index) => {
                    const status = getStatus(ex);
                    return (
                      <motion.tr
                        key={ex.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <TableCell className="w-20">
                          <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden relative">
                            <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto my-auto" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium truncate max-w-xs">{ex.title}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{ex.venue}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {ex.location}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(ex.start_date), "MMM d, yyyy")} - {format(new Date(ex.end_date), "MMM d, yyyy")}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={ex.is_virtual ? "secondary" : "default"}>
                            {ex.is_virtual ? (
                              <>
                                <Globe className="h-3 w-3 mr-1" />
                                Virtual
                              </>
                            ) : (
                              <>
                                <MapPin className="h-3 w-3 mr-1" />
                                Physical
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>{ex.photo_count} photos</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <ImageIcon className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log("Edit", ex.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log("Manage Photos", ex.id)}>
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Manage Photos
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log("Delete", ex.id)} className="text-red-500">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    );
                  }
                )
              )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}