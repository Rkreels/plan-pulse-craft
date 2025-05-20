
import { Goal, Epic, Release, Initiative, User } from "@/types";
import { toast } from "sonner";

export const createProjectActions = (
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>,
  setEpics: React.Dispatch<React.SetStateAction<Epic[]>>,
  setReleases: React.Dispatch<React.SetStateAction<Release[]>>,
  setInitiatives: React.Dispatch<React.SetStateAction<Initiative[]>>,
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>
) => {
  // Epic CRUD operations
  const addEpic = (newEpic: Epic) => {
    setEpics(prev => [...prev, newEpic]);
    toast.success("Epic added", {
      description: `${newEpic.title} has been added successfully.`
    });
  };

  const updateEpic = (updatedEpic: Epic) => {
    setEpics(prev => prev.map(e => 
      e.id === updatedEpic.id ? updatedEpic : e
    ));
    toast.success("Epic updated", {
      description: `${updatedEpic.title} has been updated successfully.`
    });
  };

  const deleteEpic = (epicId: string) => {
    setEpics(prev => prev.filter(e => e.id !== epicId));
    toast.success("Epic deleted", {
      description: "Epic has been deleted."
    });
  };

  // Goal CRUD operations
  const addGoal = (newGoal: Goal) => {
    setGoals(prev => [...prev, newGoal]);
    toast.success("Goal added", {
      description: `${newGoal.title} has been added successfully.`
    });
  };

  const updateGoal = (updatedGoal: Goal) => {
    setGoals(prev => prev.map(g => 
      g.id === updatedGoal.id ? updatedGoal : g
    ));
    toast.success("Goal updated", {
      description: `${updatedGoal.title} has been updated successfully.`
    });
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
    toast.success("Goal deleted", {
      description: "Goal has been deleted."
    });
  };

  // Release CRUD operations
  const addRelease = (newRelease: Release) => {
    setReleases(prev => [...prev, newRelease]);
    toast.success("Release added", {
      description: `${newRelease.name} has been added successfully.`
    });
  };

  const updateRelease = (updatedRelease: Release) => {
    setReleases(prev => prev.map(r => 
      r.id === updatedRelease.id ? updatedRelease : r
    ));
    toast.success("Release updated", {
      description: `${updatedRelease.name} has been updated successfully.`
    });
  };

  const deleteRelease = (releaseId: string) => {
    setReleases(prev => prev.filter(r => r.id !== releaseId));
    toast.success("Release deleted", {
      description: "Release has been deleted."
    });
  };

  // Initiative CRUD operations
  const addInitiative = (newInitiative: Initiative) => {
    setInitiatives(prev => [...prev, newInitiative]);
    toast.success("Initiative added", {
      description: `${newInitiative.title} has been added successfully.`
    });
  };

  const updateInitiative = (updatedInitiative: Initiative) => {
    setInitiatives(prev => prev.map(i => 
      i.id === updatedInitiative.id ? updatedInitiative : i
    ));
    toast.success("Initiative updated", {
      description: `${updatedInitiative.title} has been updated successfully.`
    });
  };

  const deleteInitiative = (initiativeId: string) => {
    setInitiatives(prev => prev.filter(i => i.id !== initiativeId));
    toast.success("Initiative deleted", {
      description: "Initiative has been deleted."
    });
  };

  const linkInitiativeToGoal = (initiativeId: string, goalId: string) => {
    setInitiatives(prev => prev.map(initiative => {
      if (initiative.id === initiativeId) {
        const goals = initiative.goals || [];
        if (!goals.includes(goalId)) {
          return {
            ...initiative,
            goals: [...goals, goalId],
          };
        }
      }
      return initiative;
    }));
    toast.success("Initiative linked", {
      description: "Initiative has been linked to goal."
    });
  };

  const unlinkInitiativeFromGoal = (initiativeId: string, goalId: string) => {
    setInitiatives(prev => prev.map(initiative => {
      if (initiative.id === initiativeId) {
        return {
          ...initiative,
          goals: (initiative.goals || []).filter(id => id !== goalId),
        };
      }
      return initiative;
    }));
    toast.success("Initiative unlinked", {
      description: "Initiative has been unlinked from goal."
    });
  };

  // For testing different roles
  const switchRole = (role: User["role"]) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        role
      };
    });
    toast.success("Role switched", {
      description: `Now viewing as ${role.replace('_', ' ')}`
    });
  };

  return {
    addEpic,
    updateEpic,
    deleteEpic,
    addGoal,
    updateGoal,
    deleteGoal,
    addRelease,
    updateRelease,
    deleteRelease,
    addInitiative,
    updateInitiative,
    deleteInitiative,
    linkInitiativeToGoal,
    unlinkInitiativeFromGoal,
    switchRole
  };
};
