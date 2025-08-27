
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore shortcuts when user is typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as any)?.contentEditable === "true"
      ) {
        // Allow some shortcuts even in inputs
        if (event.key === "Escape") {
          (event.target as HTMLElement).blur();
        }
        return;
      }

      // Handle different key combinations
      if (event.key === "?") {
        event.preventDefault();
        setShowShortcuts(true);
        return;
      }

      if (event.key === "Escape") {
        setShowShortcuts(false);
        return;
      }

      // Navigation shortcuts (Ctrl/Cmd + key)
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "k":
            event.preventDefault();
            // Focus search input
            const searchInput = document.querySelector('input[placeholder*="search" i], input[placeholder*="Search" i]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
            }
            break;
          case "s":
            event.preventDefault();
            // Trigger save for forms
            const saveButton = document.querySelector('button[type="submit"], button:contains("Save")') as HTMLButtonElement;
            if (saveButton && !saveButton.disabled) {
              saveButton.click();
            }
            break;
          case "e":
            event.preventDefault();
            // Trigger export
            const exportButton = document.querySelector('button:contains("Export")') as HTMLButtonElement;
            if (exportButton && !exportButton.disabled) {
              exportButton.click();
            }
            break;
          case "i":
            event.preventDefault();
            // Trigger import
            const importButton = document.querySelector('button:contains("Import")') as HTMLButtonElement;
            if (importButton && !importButton.disabled) {
              importButton.click();
            }
            break;
        }
        return;
      }

      // Simple navigation shortcuts
      switch (event.key) {
        case "n":
          event.preventDefault();
          // Create new item based on current page
          const addButton = document.querySelector('button:contains("Add"), button:contains("New"), button:contains("Create")') as HTMLButtonElement;
          if (addButton && !addButton.disabled) {
            addButton.click();
          }
          break;
        case "/":
          event.preventDefault();
          // Focus search input if available
          const searchInput = document.querySelector('input[placeholder*="search" i], input[placeholder*="Search" i]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
          break;
      }

      // Two-key navigation shortcuts (G + key)
      if (event.key === "g") {
        const handleSecondKey = (secondEvent: KeyboardEvent) => {
          switch (secondEvent.key) {
            case "f":
              navigate("/features");
              break;
            case "i":
              navigate("/ideas");
              break;
            case "t":
              navigate("/tasks");
              break;
            case "r":
              navigate("/reports");
              break;
            case "s":
              navigate("/settings");
              break;
          }
          document.removeEventListener("keydown", handleSecondKey);
        };

        document.addEventListener("keydown", handleSecondKey);
        
        // Remove listener after 2 seconds if no second key is pressed
        setTimeout(() => {
          document.removeEventListener("keydown", handleSecondKey);
        }, 2000);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return {
    showShortcuts,
    setShowShortcuts
  };
};
