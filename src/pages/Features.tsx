
import { useState, useMemo } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/contexts/AppContext";
import { Feature } from "@/types";
import { v4 as uuidv4 } from "uuid";
import FeatureHeader from "@/components/features/FeatureHeader";
import FeatureTabContent from "@/components/features/FeatureTabContent";
import FeatureListControls from "@/components/features/FeatureListControls";
import EnhancedFeatureList from "@/components/features/EnhancedFeatureList";
import { toast } from "sonner";

type FeatureStatus = "not_started" | "in_progress" | "review" | "completed" | "idea" | "backlog" | "planned";
type FeaturePriority = "low" | "medium" | "high" | "critical";

const Features = () => {
  const [activeTab, setActiveTab] = useState("list");
  const { features, epics, addFeature, updateFeature, deleteFeature } = useAppContext();
  const [newFeatureDialogOpen, setNewFeatureDialogOpen] = useState(false);
  
  // Enhanced filtering and sorting state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  const handleAddFeature = (feature: Feature) => {
    const newFeature = {
      ...feature,
      id: feature.id || uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    addFeature(newFeature);
    setNewFeatureDialogOpen(false);
  };

  // Enhanced filtering and sorting logic
  const filteredAndSortedFeatures = useMemo(() => {
    let filtered = features.filter(feature => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          feature.title.toLowerCase().includes(query) ||
          feature.description.toLowerCase().includes(query) ||
          (feature.tags && feature.tags.some(tag => tag.toLowerCase().includes(query)));
        
        if (!matchesSearch) return false;
      }
      
      // Status filter
      if (statusFilter !== "all" && feature.status !== statusFilter) {
        return false;
      }
      
      // Priority filter
      if (priorityFilter !== "all" && feature.priority !== priorityFilter) {
        return false;
      }
      
      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "priority":
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "status":
          aValue = a.status || "";
          bValue = b.status || "";
          break;
        default:
          aValue = a.title;
          bValue = b.title;
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [features, searchQuery, sortBy, sortOrder, statusFilter, priorityFilter]);

  const handleSelectFeature = (featureId: string, selected: boolean) => {
    setSelectedFeatures(prev => 
      selected 
        ? [...prev, featureId]
        : prev.filter(id => id !== featureId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFeatures(filteredAndSortedFeatures.map(f => f.id));
    } else {
      setSelectedFeatures([]);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedFeatures.length} selected features?`)) {
      selectedFeatures.forEach(featureId => {
        deleteFeature(featureId);
      });
      setSelectedFeatures([]);
      toast.success(`${selectedFeatures.length} features deleted`);
    }
  };

  const handleBulkArchive = () => {
    selectedFeatures.forEach(featureId => {
      const feature = features.find(f => f.id === featureId);
      if (feature) {
        updateFeature({
          ...feature,
          status: "archived" as any,
          updatedAt: new Date()
        });
      }
    });
    setSelectedFeatures([]);
    toast.success(`${selectedFeatures.length} features archived`);
  };

  const handleExport = () => {
    const dataToExport = filteredAndSortedFeatures.map(feature => ({
      title: feature.title,
      description: feature.description,
      priority: feature.priority,
      status: feature.status,
      progress: feature.progress,
      createdAt: feature.createdAt,
      tags: feature.tags
    }));

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'features-export.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Features exported successfully");
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedFeatures = JSON.parse(e.target?.result as string);
            importedFeatures.forEach((feature: any) => {
              addFeature({
                ...feature,
                id: uuidv4(),
                createdAt: new Date(),
                updatedAt: new Date()
              });
            });
            toast.success(`${importedFeatures.length} features imported successfully`);
          } catch (error) {
            toast.error("Failed to import features. Please check the file format.");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleSortChange = (field: string, order: "asc" | "desc") => {
    setSortBy(field);
    setSortOrder(order);
  };
  
  return (
    <>
      <PageTitle
        title="Feature Management"
        description="Manage product features and their dependencies"
      />
      
      <FeatureHeader 
        newFeatureDialogOpen={newFeatureDialogOpen}
        setNewFeatureDialogOpen={setNewFeatureDialogOpen}
        onAddFeature={handleAddFeature}
      />
      
      <Tabs 
        defaultValue="list" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="list">Feature List</TabsTrigger>
          <TabsTrigger value="board">Kanban Board</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
        </TabsList>
        
        {activeTab === "list" && (
          <div className="space-y-6">
            <FeatureListControls
              features={filteredAndSortedFeatures}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              onStatusFilterChange={setStatusFilter}
              onPriorityFilterChange={setPriorityFilter}
              selectedFeatures={selectedFeatures}
              onSelectAll={handleSelectAll}
              onBulkDelete={handleBulkDelete}
              onBulkArchive={handleBulkArchive}
              onExport={handleExport}
              onImport={handleImport}
            />
            
            <EnhancedFeatureList
              features={filteredAndSortedFeatures}
              epics={epics}
              selectedFeatures={selectedFeatures}
              onSelectFeature={handleSelectFeature}
              onEditFeature={(feature) => {
                // This would open the edit dialog
                console.log("Edit feature:", feature);
              }}
              onDeleteFeature={(featureId) => {
                deleteFeature(featureId);
                setSelectedFeatures(prev => prev.filter(id => id !== featureId));
              }}
            />
          </div>
        )}
        
        <FeatureTabContent 
          activeTab={activeTab}
          features={features}
          epics={epics}
        />
      </Tabs>
    </>
  );
};

export default Features;
