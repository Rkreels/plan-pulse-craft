
import { Feature, Feedback } from "@/types";
import { toast } from "sonner";

export const createFeatureActions = (
  setFeatures: React.Dispatch<React.SetStateAction<Feature[]>>,
  setFeedback: React.Dispatch<React.SetStateAction<Feedback[]>>
) => {
  // Feature CRUD operations
  const addFeature = (newFeature: Feature) => {
    setFeatures(prev => [...prev, newFeature]);
    toast({
      title: "Feature added",
      description: `${newFeature.title} has been added successfully.`
    });
  };

  const updateFeature = (updatedFeature: Feature) => {
    setFeatures(prev => prev.map(f => 
      f.id === updatedFeature.id ? updatedFeature : f
    ));
    toast({
      title: "Feature updated",
      description: `${updatedFeature.title} has been updated successfully.`
    });
  };

  const deleteFeature = (featureId: string) => {
    const featureToDelete = setFeatures(prev => {
      const feature = prev.find(f => f.id === featureId);
      return prev.filter(f => f.id !== featureId);
    });
    toast({
      title: "Feature deleted",
      description: "Feature has been deleted."
    });
  };

  // Feedback CRUD operations
  const updateFeedback = (updatedFeedback: Feedback) => {
    setFeedback(prev => prev.map(f => 
      f.id === updatedFeedback.id ? updatedFeedback : f
    ));
    toast({
      title: "Feedback updated",
      description: `${updatedFeedback.title} has been updated successfully.`
    });
  };

  const deleteFeedback = (feedbackId: string) => {
    const feedbackToDelete = setFeedback(prev => {
      const feedback = prev.find(f => f.id === feedbackId);
      return prev.filter(f => f.id !== feedbackId);
    });
    toast({
      title: "Feedback deleted",
      description: "Feedback has been deleted."
    });
  };

  // Function to add new feedback
  const addFeedback = (newFeedback: Feedback) => {
    setFeedback(prev => [...prev, newFeedback]);
    toast({
      title: "Feedback added",
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
