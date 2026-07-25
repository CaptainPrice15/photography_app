"use client";

import { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS } from "@/lib/constants";

interface PhotoFiltersProps {
  search?: string;
  category?: string;
  sort?: string;
  onSearchChange?: (value: string) => void;
  onCategoryChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
  categories?: { value: string; label: string }[];
}

const DEFAULT_CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "landscapes", label: "Landscapes" },
  { value: "portraits", label: "Portraits" },
  { value: "street", label: "Street" },
  { value: "nature", label: "Nature" },
  { value: "architecture", label: "Architecture" },
];

export function PhotoFilters({
  search = "",
  category = "all",
  sort = "newest",
  onSearchChange,
  onCategoryChange,
  onSortChange,
  categories = DEFAULT_CATEGORIES,
}: PhotoFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search photographs..."
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-10"
          />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => onSearchChange?.("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg">
          <Select
            value={category ?? "all"}
            onValueChange={(v) => onCategoryChange?.(v ?? "all")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sort ?? "newest"}
            onValueChange={(v) => onSortChange?.(v ?? "newest")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
