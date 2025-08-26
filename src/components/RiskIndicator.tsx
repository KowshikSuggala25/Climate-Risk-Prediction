import { cn } from "@/lib/utils";
import { AlertTriangle, Shield, AlertCircle, Zap } from "lucide-react";

interface RiskIndicatorProps {
  level: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  className?: string;
}

const riskConfig = {
  low: {
    icon: Shield,
    gradient: "from-risk-low to-risk-low/80",
    textColor: "text-risk-low-foreground",
    bgColor: "bg-risk-low",
  },
  medium: {
    icon: AlertCircle,
    gradient: "from-risk-medium to-risk-medium/80",
    textColor: "text-risk-medium-foreground",
    bgColor: "bg-risk-medium",
  },
  high: {
    icon: AlertTriangle,
    gradient: "from-risk-high to-risk-high/80",
    textColor: "text-risk-high-foreground",
    bgColor: "bg-risk-high",
  },
  critical: {
    icon: Zap,
    gradient: "from-risk-critical to-risk-critical/80",
    textColor: "text-risk-critical-foreground",
    bgColor: "bg-risk-critical",
  },
};

export const RiskIndicator = ({ level, title, description, className }: RiskIndicatorProps) => {
  const config = riskConfig[level];
  const Icon = config.icon;

  return (
    <div className={cn(
      "relative overflow-hidden rounded-lg bg-gradient-to-br p-6 shadow-lg transition-all duration-300 hover:shadow-xl",
      config.gradient,
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Icon className={cn("h-5 w-5", config.textColor)} />
            <span className={cn("text-sm font-medium uppercase tracking-wide", config.textColor)}>
              {level} Risk
            </span>
          </div>
          <h3 className={cn("text-xl font-bold", config.textColor)}>{title}</h3>
          <p className={cn("text-sm opacity-90", config.textColor)}>{description}</p>
        </div>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          config.bgColor,
          "bg-opacity-20"
        )}>
          <Icon className={cn("h-6 w-6", config.textColor)} />
        </div>
      </div>
      
      {/* Animated pulse effect for high/critical risks */}
      {(level === "high" || level === "critical") && (
        <div className="absolute inset-0 animate-pulse bg-white/10 rounded-lg" />
      )}
    </div>
  );
};