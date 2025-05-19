
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Minus, Plus, Download, Filter } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export const CompetitorComparison = () => {
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>(["CompeteX", "ProdRival", "RoadmapGuru"]);
  
  // Feature comparison data
  const features = [
    { 
      category: "Core PM Features",
      items: [
        { 
          name: "Roadmap Planning", 
          our: { has: true, quality: "high" },
          competitors: {
            "CompeteX": { has: true, quality: "high" },
            "ProdRival": { has: true, quality: "medium" },
            "RoadmapGuru": { has: true, quality: "high" }
          }
        },
        { 
          name: "Feature Management", 
          our: { has: true, quality: "high" },
          competitors: {
            "CompeteX": { has: true, quality: "high" },
            "ProdRival": { has: true, quality: "medium" },
            "RoadmapGuru": { has: false, quality: "none" }
          }
        },
        { 
          name: "Release Planning", 
          our: { has: true, quality: "medium" },
          competitors: {
            "CompeteX": { has: true, quality: "high" },
            "ProdRival": { has: true, quality: "low" },
            "RoadmapGuru": { has: true, quality: "medium" }
          }
        }
      ]
    },
    {
      category: "Strategy & Analytics",
      items: [
        { 
          name: "Strategic Planning", 
          our: { has: true, quality: "high" },
          competitors: {
            "CompeteX": { has: true, quality: "medium" },
            "ProdRival": { has: false, quality: "none" },
            "RoadmapGuru": { has: false, quality: "none" }
          }
        },
        { 
          name: "Advanced Reporting", 
          our: { has: true, quality: "medium" },
          competitors: {
            "CompeteX": { has: true, quality: "high" },
            "ProdRival": { has: false, quality: "none" },
            "RoadmapGuru": { has: true, quality: "low" }
          }
        },
        { 
          name: "Competitor Analysis", 
          our: { has: true, quality: "high" },
          competitors: {
            "CompeteX": { has: false, quality: "none" },
            "ProdRival": { has: false, quality: "none" },
            "RoadmapGuru": { has: false, quality: "none" }
          }
        }
      ]
    },
    {
      category: "Collaboration",
      items: [
        { 
          name: "Team Management", 
          our: { has: true, quality: "medium" },
          competitors: {
            "CompeteX": { has: true, quality: "high" },
            "ProdRival": { has: true, quality: "medium" },
            "RoadmapGuru": { has: true, quality: "low" }
          }
        },
        { 
          name: "Customer Feedback Portal", 
          our: { has: true, quality: "high" },
          competitors: {
            "CompeteX": { has: true, quality: "medium" },
            "ProdRival": { has: false, quality: "none" },
            "RoadmapGuru": { has: true, quality: "medium" }
          }
        },
        { 
          name: "Third-Party Integrations", 
          our: { has: true, quality: "high" },
          competitors: {
            "CompeteX": { has: true, quality: "medium" },
            "ProdRival": { has: true, quality: "low" },
            "RoadmapGuru": { has: true, quality: "low" }
          }
        }
      ]
    }
  ];

  const renderFeatureCell = (feature: any, competitor: string | null) => {
    let value;
    
    if (competitor === null) {
      // Our product
      value = feature.our;
    } else {
      // Competitor's product
      value = feature.competitors[competitor];
    }
    
    if (!value || !value.has) {
      return <X className="h-5 w-5 text-red-500 mx-auto" />;
    }
    
    switch(value.quality) {
      case "high":
        return <Badge className="bg-green-500 mx-auto">High</Badge>;
      case "medium":
        return <Badge className="bg-amber-500 mx-auto">Medium</Badge>;
      case "low":
        return <Badge className="bg-red-500 mx-auto">Low</Badge>;
      default:
        return <Check className="h-5 w-5 text-green-500 mx-auto" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Feature Comparison</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="p-4 bg-muted rounded-md">
        <h3 className="font-medium mb-2">Select Competitors to Compare</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            CompeteX <Check className="h-3 w-3 ml-1" />
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            ProdRival <Check className="h-3 w-3 ml-1" />
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            RoadmapGuru <Check className="h-3 w-3 ml-1" />
          </Badge>
          <Button variant="ghost" size="sm">
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Feature</TableHead>
              <TableHead className="text-center">Our Product</TableHead>
              {selectedCompetitors.map(competitor => (
                <TableHead key={competitor} className="text-center">{competitor}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((category, categoryIndex) => (
              <>
                <TableRow key={`category-${categoryIndex}`} className="bg-muted/50">
                  <TableCell colSpan={2 + selectedCompetitors.length} className="font-medium">
                    {category.category}
                  </TableCell>
                </TableRow>
                {category.items.map((feature, featureIndex) => (
                  <TableRow key={`feature-${categoryIndex}-${featureIndex}`}>
                    <TableCell className="font-medium">{feature.name}</TableCell>
                    <TableCell className="text-center">
                      {renderFeatureCell(feature, null)}
                    </TableCell>
                    {selectedCompetitors.map(competitor => (
                      <TableCell key={`comp-${competitor}-${featureIndex}`} className="text-center">
                        {renderFeatureCell(feature, competitor)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
