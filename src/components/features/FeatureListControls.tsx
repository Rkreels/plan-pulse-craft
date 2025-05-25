
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, SortAsc, Download, Upload, Trash2, Archive } from "lucide-react";
import { Feature } from "@/types";

interface FeatureListControlsProps {
  features: Feature[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (field: string, order: "asc" | "desc") => void;
  statusFilter: string;
  priorityFilter: string;
  onStatusFilterChange: (status: string) => void;
  onPriorityFilterChange: (priority: string) => void;
  selectedFeatures: string[];
  onSelectAll: (checked: boolean) => void;
  onBulkDelete: () => void;
  onBulkArchive: () => void;
  onExport: () => void;
  onImport: () => void;
}

const FeatureListControls: React.FC<FeatureListControlsProps> = ({
  features,
  searchQuery,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
  statusFilter,
  priorityFilter,
  onStatusFilterChange,
  onPriorityFilterChange,
  selectedFeatures,
  onSelectAll,
  onBulkDelete,
  onBulkArchive,
  onExport,
  onImport
}) => {
  const hasSelectedFeatures = selectedFeatures.length > 0;
  const allFeaturesSelected = features.length > 0 && selectedFeatures.length === features.length;

  return (
    <div className="space-y-4">
      {/* Search and Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search features by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={onImport} className="gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={allFeaturesSelected}
            onCheckedChange={onSelectAll}
            id="select-all"
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            Select All ({selectedFeatures.length})
          </label>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="idea">Idea</SelectItem>
              <SelectItem value="backlog">Backlog</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={`${sortBy}-${sortOrder}`} 
            onValueChange={(value) => {
              const [field, order] = value.split('-') as [string, "asc" | "desc"];
              onSortChange(field, order);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title-asc">Title A-Z</SelectItem>
              <SelectItem value="title-desc">Title Z-A</SelectItem>
              <SelectItem value="priority-desc">Priority High-Low</SelectItem>
              <SelectItem value="priority-asc">Priority Low-High</SelectItem>
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              <SelectItem value="status-asc">Status A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Actions */}
      {hasSelectedFeatures && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border">
          <span className="text-sm font-medium">
            {selectedFeatures.length} feature{selectedFeatures.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2 ml-auto">
            <Button size="sm" variant="outline" onClick={onBulkArchive} className="gap-1">
              <Archive className="h-4 w-4" />
              Archive
            </Button>
            <Button size="sm" variant="destructive" onClick={onBulkDelete} className="gap-1">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(statusFilter !== "all" || priorityFilter !== "all" || searchQuery) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchQuery}
              <button onClick={() => onSearchChange("")} className="ml-1 hover:bg-muted rounded">×</button>
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Status: {statusFilter}
              <button onClick={() => onStatusFilterChange("all")} className="ml-1 hover:bg-muted rounded">×</button>
            </Badge>
          )}
          {priorityFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Priority: {priorityFilter}
              <button onClick={() => onPriorityFilterChange("all")} className="ml-1 hover:bg-muted rounded">×</button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default FeatureListControls;
