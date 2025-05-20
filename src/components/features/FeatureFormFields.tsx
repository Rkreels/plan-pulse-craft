
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Feature, Epic, Release } from "@/types";

interface FeatureFormFieldsProps {
  formData: Partial<Feature>;
  onChange: (field: string, value: any) => void;
  epics: Epic[];
  releases: Release[];
}

const FeatureFormFields: React.FC<FeatureFormFieldsProps> = ({ formData, onChange, epics, releases }) => {
  const [currentTag, setCurrentTag] = useState("");
  const [currentCriterion, setCurrentCriterion] = useState("");

  const addTag = () => {
    if (currentTag.trim() && !formData.tags?.includes(currentTag.trim())) {
      onChange("tags", [...(formData.tags || []), currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange("tags", (formData.tags || []).filter(tag => tag !== tagToRemove));
  };

  const addCriterion = () => {
    if (currentCriterion.trim()) {
      onChange("acceptanceCriteria", [
        ...(formData.acceptanceCriteria || []), 
        currentCriterion.trim()
      ]);
      setCurrentCriterion("");
    }
  };

  const removeCriterion = (index: number) => {
    onChange(
      "acceptanceCriteria",
      (formData.acceptanceCriteria || []).filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Feature Title</Label>
        <Input 
          id="title"
          value={formData.title || ""}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="e.g., Interactive Product Tour"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description"
          value={formData.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Describe this feature and its benefits"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="userStory">User Story</Label>
        <Textarea 
          id="userStory"
          value={formData.userStory || ""}
          onChange={(e) => onChange("userStory", e.target.value)}
          placeholder="As a [type of user], I want [goal] so that [benefit]"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Acceptance Criteria</Label>
        <div className="flex gap-2">
          <Input
            value={currentCriterion}
            onChange={(e) => setCurrentCriterion(e.target.value)}
            placeholder="Add acceptance criterion"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCriterion();
              }
            }}
          />
          <Button type="button" onClick={addCriterion}>Add</Button>
        </div>
        {formData.acceptanceCriteria && formData.acceptanceCriteria.length > 0 && (
          <div className="mt-2 space-y-2">
            {formData.acceptanceCriteria.map((criterion, index) => (
              <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                <span className="text-sm">{criterion}</span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeCriterion(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => onChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="idea">Idea</SelectItem>
              <SelectItem value="backlog">Backlog</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="not_started">Not Started</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select 
            value={formData.priority} 
            onValueChange={(value) => onChange("priority", value)}
          >
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="effort">Effort (1-10)</Label>
          <Input 
            id="effort"
            type="number"
            min="1"
            max="10"
            value={formData.effort || 5}
            onChange={(e) => onChange("effort", parseInt(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="value">Value (1-10)</Label>
          <Input 
            id="value"
            type="number"
            min="1"
            max="10"
            value={formData.value || 5}
            onChange={(e) => onChange("value", parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="epicId">Epic</Label>
          <Select 
            value={formData.epicId || "none"} 
            onValueChange={(value) => onChange("epicId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select epic (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {epics.map((epic) => (
                <SelectItem key={epic.id} value={epic.id}>{epic.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="releaseId">Release</Label>
          <Select 
            value={formData.releaseId || "none"} 
            onValueChange={(value) => onChange("releaseId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select release (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {releases.map((release) => (
                <SelectItem key={release.id} value={release.id}>{release.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            placeholder="Add a tag"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button type="button" onClick={addTag}>Add</Button>
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1 pl-2 pr-1">
                {tag}
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 ml-1 hover:bg-muted"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureFormFields;
