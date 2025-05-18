
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { EmptyState } from "@/components/common/EmptyState";
import { 
  FileText, 
  Plus, 
  Search, 
  FolderPlus,
  File, 
  Folder, 
  MoreVertical,
  FileText as FileTextIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppContext } from "@/contexts/AppContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Example document interface
interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  authorId: string;
}

const Documentation = () => {
  const { currentUser } = useAppContext();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "doc-1",
      title: "Product Feature Specs",
      content: "This document contains all product feature specifications for the current release.",
      createdAt: new Date(2023, 1, 15),
      updatedAt: new Date(2023, 3, 20),
      version: 3,
      authorId: "u1"
    },
    {
      id: "doc-2",
      title: "User Research Findings",
      content: "Results from our latest user research study including key insights and recommendations.",
      createdAt: new Date(2023, 2, 10),
      updatedAt: new Date(2023, 2, 10),
      version: 1,
      authorId: "u2"
    }
  ]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedContent, setEditedContent] = useState<string>("");
  
  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNewDocument = () => {
    setSelectedDocument(null);
    setEditedTitle("");
    setEditedContent("");
    setIsEditing(true);
  };

  const handleEditDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setEditedTitle(doc.title);
    setEditedContent(doc.content);
    setIsEditing(true);
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsEditing(false);
  };

  const handleSaveDocument = () => {
    if (!editedTitle.trim()) {
      toast.error("Document title is required");
      return;
    }
    
    const now = new Date();
    
    if (selectedDocument) {
      // Update existing document
      const updatedDoc = {
        ...selectedDocument,
        title: editedTitle,
        content: editedContent,
        updatedAt: now,
        version: selectedDocument.version + 1
      };
      setDocuments(prev => prev.map(d => d.id === selectedDocument.id ? updatedDoc : d));
      setSelectedDocument(updatedDoc);
    } else {
      // Add new document
      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        title: editedTitle,
        content: editedContent,
        createdAt: now,
        updatedAt: now,
        version: 1,
        authorId: currentUser?.id || "unknown",
      };
      setDocuments(prev => [...prev, newDoc]);
      setSelectedDocument(newDoc);
    }
    
    setIsEditing(false);
    toast.success("Document saved successfully");
  };

  const handleDeleteDocument = (docId: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      setDocuments(prev => prev.filter(d => d.id !== docId));
      if (selectedDocument && selectedDocument.id === docId) {
        setSelectedDocument(null);
      }
      toast.success("Document deleted successfully");
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      toast.success(`Folder "${newFolderName}" created`);
      setIsNewFolderDialogOpen(false);
      setNewFolderName("");
    } else {
      toast.error("Please enter a folder name");
    }
  };

  return (
    <>
      <PageTitle
        title="Documentation"
        description="Create and manage product documentation"
        action={{
          label: "New Document",
          icon: <Plus className="h-4 w-4" />,
          onClick: handleCreateNewDocument
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document sidebar */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input 
              placeholder="Search documentation..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="icon" onClick={() => setIsNewFolderDialogOpen(true)}>
              <FolderPlus className="h-4 w-4" />
            </Button>
          </div>

          <div className="border rounded-md overflow-hidden">
            {filteredDocuments.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No documents found
              </div>
            ) : (
              <div className="divide-y">
                {filteredDocuments.map((doc) => (
                  <div 
                    key={doc.id} 
                    className={`p-3 flex justify-between items-center hover:bg-accent cursor-pointer ${
                      selectedDocument?.id === doc.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => handleViewDocument(doc)}
                  >
                    <div className="flex items-center space-x-2">
                      <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{doc.title}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditDocument(doc); }}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteDocument(doc.id); }}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </div>

          {filteredDocuments.length === 0 && searchQuery === "" && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleCreateNewDocument}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first document
            </Button>
          )}
        </div>

        {/* Document editor/viewer */}
        <div className="lg:col-span-2">
          {selectedDocument || isEditing ? (
            <div className="border rounded-md p-4 space-y-4">
              {isEditing ? (
                <>
                  <Input
                    placeholder="Document Title"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="text-lg font-semibold"
                  />
                  <textarea
                    placeholder="Start writing your document content here..."
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full min-h-[300px] rounded-md border border-input p-2 resize-none focus:outline-none"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleSaveDocument}>Save</Button>
                  </div>
                </>
              ) : selectedDocument && (
                <>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedDocument.title}</h2>
                    <p className="text-xs text-muted-foreground">
                      Last updated {selectedDocument.updatedAt.toLocaleDateString()} • Version {selectedDocument.version}
                    </p>
                  </div>
                  <div className="prose max-w-none border-t pt-4">
                    <p className="whitespace-pre-wrap">{selectedDocument.content}</p>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => handleEditDocument(selectedDocument)}>Edit</Button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <EmptyState 
              title="No Document Selected" 
              description="Select a document from the list or create a new one."
              icon={<FileText className="h-10 w-10 text-muted-foreground" />}
              action={{
                label: "New Document",
                onClick: handleCreateNewDocument
              }}
            />
          )}
        </div>
      </div>

      {/* New Folder Dialog */}
      <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for your new documentation folder.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input 
              id="folder-name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="e.g., Product Specs"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Documentation;
