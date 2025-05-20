
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, CalendarDays } from "lucide-react";
import { toast } from "sonner";

// Types for capacity planning data
interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  capacity: number;
  allocated: number;
}

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  capacity: number;
  allocated: number;
  status: "upcoming" | "active" | "completed";
}

export const CapacityPlanningDashboard = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "tm1",
      name: "Alex Kim",
      role: "Full-stack Developer",
      avatar: "https://ui-avatars.com/api/?name=Alex+Kim&background=6E59A5&color=fff",
      capacity: 40,
      allocated: 32
    },
    {
      id: "tm2",
      name: "Taylor Wong",
      role: "Frontend Developer",
      avatar: "https://ui-avatars.com/api/?name=Taylor+Wong&background=22C55E&color=fff",
      capacity: 40,
      allocated: 38
    },
    {
      id: "tm3",
      name: "Jamie Singh",
      role: "Backend Developer",
      avatar: "https://ui-avatars.com/api/?name=Jamie+Singh&background=0EA5E9&color=fff",
      capacity: 40,
      allocated: 25
    },
    {
      id: "tm4",
      name: "Morgan Lee",
      role: "QA Engineer",
      avatar: "https://ui-avatars.com/api/?name=Morgan+Lee&background=F59E0B&color=fff",
      capacity: 40,
      allocated: 30
    }
  ]);

  const [sprints, setSprints] = useState<Sprint[]>([
    {
      id: "s1",
      name: "Sprint 24",
      startDate: "2025-05-21",
      endDate: "2025-06-03",
      capacity: 160,
      allocated: 125,
      status: "active"
    },
    {
      id: "s2",
      name: "Sprint 25",
      startDate: "2025-06-04",
      endDate: "2025-06-17",
      capacity: 160,
      allocated: 80,
      status: "upcoming"
    },
    {
      id: "s3",
      name: "Sprint 23",
      startDate: "2025-05-07",
      endDate: "2025-05-20",
      capacity: 160,
      allocated: 155,
      status: "completed"
    }
  ]);

  const handleAllocateCapacity = (memberId: string) => {
    toast.success("Capacity allocation dialog would open here");
  };

  const handleAddTeamMember = () => {
    toast.success("Add team member dialog would open here");
  };

  const handlePlanSprint = () => {
    toast.success("Sprint planning dialog would open here");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Team Capacity</h2>
        <Button onClick={handleAddTeamMember}>
          <Plus className="h-4 w-4 mr-2" /> Add Team Member
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleAllocateCapacity(member.id)}>
                      Allocate Capacity
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Capacity Allocated</span>
                  <span>{member.allocated}/{member.capacity} hours</span>
                </div>
                <Progress 
                  value={(member.allocated / member.capacity) * 100} 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sprint Planning</h2>
          <Button onClick={handlePlanSprint}>
            <CalendarDays className="h-4 w-4 mr-2" /> Plan New Sprint
          </Button>
        </div>
        
        <div className="space-y-4">
          {sprints.map((sprint) => (
            <Card key={sprint.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {sprint.name} 
                      <Badge 
                        className={
                          sprint.status === "active" ? "bg-green-500" : 
                          sprint.status === "upcoming" ? "bg-blue-500" : 
                          "bg-gray-500"
                        }
                      >
                        {sprint.status.charAt(0).toUpperCase() + sprint.status.slice(1)}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {sprint.startDate} to {sprint.endDate}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Team Capacity Allocated</span>
                    <span>{sprint.allocated}/{sprint.capacity} hours</span>
                  </div>
                  <Progress 
                    value={(sprint.allocated / sprint.capacity) * 100} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
