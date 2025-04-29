
import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, className }) => {
  return (
    <div className={cn("w-full bg-muted rounded-full h-3", className)}>
      <div
        className="bg-habit-primary h-full rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${value}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span className="sr-only">{value}% complete</span>
      </div>
    </div>
  );
};

export default ProgressBar;
