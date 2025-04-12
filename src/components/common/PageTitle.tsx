
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface PageTitleProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
  };
}

export function PageTitle({ title, description, action }: PageTitleProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-4 border-b mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <Button onClick={action.onClick} className="flex gap-2">
          {action.icon}
          {action.label}
        </Button>
      )}
    </div>
  );
}
