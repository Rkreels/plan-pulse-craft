
import { Feature, Feedback } from "@/types";
import { toast } from "sonner";

export const createFeatureActions = (
  setFeatures: React.Dispatch<React.SetStateAction<Feature[]>>,
  setFeedback: React.Dispatch<React.SetStateAction<Feedback[]>>
) => {
  // Feature CRUD operations
  const addFeature = (newFeature: Feature) => {
    setFeatures(prev => [...prev, newFeature]);
    toast.success("Feature added", {
      description: `${newFeature.title} has been added successfully.`
    });
  };

  const updateFeature = (updatedFeature: Feature) => {
    setFeatures(prev => prev.map(f => 
      f.id === updatedFeature.id ? updatedFeature : f
    ));
    toast.success("Feature updated", {
      description: `${updatedFeature.title} has been updated successfully.`
    });
  };

  const deleteFeature = (featureId: string) => {
    setFeatures(prev => {
      const featureToDelete = prev.find(f => f.id === featureId);
      const result = prev.filter(f => f.id !== featureId);
      
      toast.success("Feature deleted", {
        description: "Feature has been deleted."
      });
      
      return result;
    });
  };

  // Feedback CRUD operations
  const updateFeedback = (updatedFeedback: Feedback) => {
    setFeedback(prev => prev.map(f => 
      f.id === updatedFeedback.id ? updatedFeedback : f
    ));
    toast.success("Feedback updated", {
      description: `${updatedFeedback.title} has been updated successfully.`
    });
  };

  const deleteFeedback = (feedbackId: string) => {
    setFeedback(prev => {
      const feedbackToDelete = prev.find(f => f.id === feedbackId);
      const result = prev.filter(f => f.id !== feedbackId);
      
      toast.success("Feedback deleted", {
        description: "Feedback has been deleted."
      });
      
      return result;
    });
  };

  // Function to add new feedback
  const addFeedback = (newFeedback: Feedback) => {
    setFeedback(prev => [...prev, newFeedback]);
    toast.success("Feedback added", {
      description: `${newFeedback.title} has been added successfully.`
    });
  };

  return {
    addFeature,
    updateFeature,
    deleteFeature,
    addFeedback,
    updateFeedback,
    deleteFeedback
  };
};
