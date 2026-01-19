import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
  variant?: "default" | "outline" | "highlight";
  direction?: "horizontal" | "vertical";
  contentClassName?: string;
}

export function FeatureCard({
  title,
  description,
  icon,
  className,
  variant = "default",
  direction = "horizontal",
  contentClassName,
}: FeatureCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md",
        variant === "outline" && "border border-border",
        variant === "highlight" && "border-primary/30 bg-primary/5",
        className
      )}
    >
      <CardContent className={cn(
        "p-6",
        direction === "horizontal" ? "flex items-start gap-4" : "space-y-4",
        contentClassName
      )}>
        {/* Icono */}
        <div className={cn(
          "shrink-0",
          direction === "horizontal" ? "mt-1" : "",
          variant === "highlight" ? "text-primary" : "text-muted-foreground"
        )}>
          {icon}
        </div>
        
        {/* Contenido */}
        <div className="space-y-2">
          <h4 className={cn(
            "font-bold text-lg tracking-tight",
            variant === "highlight" && "text-primary"
          )}>
            {title}
          </h4>
          <p className="text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}