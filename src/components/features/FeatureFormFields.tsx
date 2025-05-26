
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { Feature, Epic, Release } from "@/types";

interface FeatureFormFieldsProps {
  formData: Partial<Feature>;
  onChange: (field: string, value: any) => void;
  epics: Epic[];
  releases: Release[];
}

const FeatureFormFields: React.FC<FeatureFormFieldsProps> = ({
  formData,
  onChange,
  epics = [],
  releases = [],
}) => {
  const handleTagAdd = (newTag: string) => {
    if (newTag && !formData.tags?.includes(newTag)) {
      onChange("tags", [...(formData.tags || []), newTag]);
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    onChange("tags", (formData.tags || []).filter(tag => tag !== tagToRemove));
  };

  const handleCriteriaAdd = (newCriteria: string) => {
    if (newCriteria) {
      onChange("acceptanceCriteria", [...(formData.acceptanceCriteria || []), newCriteria]);
    }
  };

  const handleCriteriaRemove = (index: number) => {
    const updated = [...(formData.acceptanceCriteria || [])];
    updated.splice(index, 1);
    onChange("acceptanceCriteria", updated);
  };

  return (
    <div className="grid gap-4 py-4">
      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title || ""}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Feature title"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status || "idea"} onValueChange={(value) => onChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="idea">Idea</SelectItem>
              <SelectItem value="backlog">Backlog</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Describe the feature"
          rows={3}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="userStory">User Story</Label>
        <Textarea
          id="userStory"
          value={formData.userStory || ""}
          onChange={(e) => onChange("userStory", e.target.value)}
          placeholder="As a [user type], I want [functionality] so that [benefit]"
          rows={2}
        />
      </div>

      {/* Priority and Effort */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority || "medium"} onValueChange={(value) => onChange("priority", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="progress">Progress (%)</Label>
          <Input
            id="progress"
            type="number"
            min={0}
            max={100}
            value={formData.progress || 0}
            onChange={(e) => onChange("progress", Number(e.target.value))}
          />
        </div>
      </div>

      {/* Effort and Value Sliders */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Effort: {formData.effort || 5}</Label>
          <Slider
            value={[formData.effort || 5]}
            onValueChange={(value) => onChange("effort", value[0])}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
        </div>
        <div className="grid gap-2">
          <Label>Value: {formData.value || 5}</Label>
          <Slider
            value={[formData.value || 5]}
            onValueChange={(value) => onChange("value", value[0])}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* Epic and Release */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="epic">Epic</Label>
          <Select 
            value={formData.epicId || "none"} 
            onValueChange={(value) => onChange("epicId", value === "none" ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select epic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Epic</SelectItem>
              {epics.map(epic => (
                <SelectItem key={epic.id} value={epic.id}>{epic.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="release">Release</Label>
          <Select 
            value={formData.releaseId || "none"} 
            onValueChange={(value) => onChange("releaseId", value === "none" ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select release" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Release</SelectItem>
              {releases.map(release => (
                <SelectItem key={release.id} value={release.id}>{release.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tags */}
      <div className="grid gap-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(formData.tags || []).map(tag => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0"
                onClick={() => handleTagRemove(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add tag"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleTagAdd(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const input = document.querySelector('input[placeholder="Add tag"]') as HTMLInputElement;
              if (input?.value) {
                handleTagAdd(input.value);
                input.value = '';
              }
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Acceptance Criteria */}
      <div className="grid gap-2">
        <Label>Acceptance Criteria</Label>
        <div className="space-y-2">
          {(formData.acceptanceCriteria || []).map((criteria, index) => (
            <div key={index} className="flex gap-2">
              <Input value={criteria} readOnly className="flex-1" />
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCriteriaRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add acceptance criteria"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCriteriaAdd(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const input = document.querySelector('input[placeholder="Add acceptance criteria"]') as HTMLInputElement;
              if (input?.value) {
                handleCriteriaAdd(input.value);
                input.value = '';
              }
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeatureFormFields;
