
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Keyboard } from "lucide-react";

interface KeyboardShortcutsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ open, onOpenChange }) => {
  const shortcuts = [
    {
      category: "General",
      items: [
        { keys: ["Ctrl/Cmd", "K"], description: "Open command palette" },
        { keys: ["?"], description: "Show keyboard shortcuts" },
        { keys: ["Esc"], description: "Close dialogs/modals" },
        { keys: ["Ctrl/Cmd", "S"], description: "Save current form" },
      ]
    },
    {
      category: "Navigation", 
      items: [
        { keys: ["G", "F"], description: "Go to Features" },
        { keys: ["G", "I"], description: "Go to Ideas" },
        { keys: ["G", "T"], description: "Go to Tasks" },
        { keys: ["G", "R"], description: "Go to Reports" },
        { keys: ["G", "S"], description: "Go to Settings" },
      ]
    },
    {
      category: "Features & Ideas",
      items: [
        { keys: ["Ctrl/Cmd", "A"], description: "Select all items" },
        { keys: ["Ctrl/Cmd", "D"], description: "Deselect all items" },
        { keys: ["Delete"], description: "Delete selected items" },
        { keys: ["N"], description: "Create new item" },
        { keys: ["E"], description: "Edit selected item" },
        { keys: ["Space"], description: "Toggle item selection" },
        { keys: ["/"], description: "Focus search input" },
      ]
    },
    {
      category: "Data Management",
      items: [
        { keys: ["Ctrl/Cmd", "E"], description: "Export data" },
        { keys: ["Ctrl/Cmd", "I"], description: "Import data" },
        { keys: ["Ctrl/Cmd", "Z"], description: "Undo last action" },
        { keys: ["Ctrl/Cmd", "Shift", "Z"], description: "Redo last action" },
      ]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate and interact with the application more efficiently.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {shortcuts.map((category, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.items.map((shortcut, shortcutIndex) => (
                    <div key={shortcutIndex} className="flex items-center justify-between">
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <Badge variant="outline" className="font-mono text-xs px-2 py-1">
                              {key}
                            </Badge>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-muted-foreground text-xs">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Press <Badge variant="outline" className="font-mono">?</Badge> anytime to view these shortcuts
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcuts;
