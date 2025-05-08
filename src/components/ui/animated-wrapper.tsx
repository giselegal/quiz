
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  show?: boolean;
  delay?: number;
  duration?: number;
  animation?: "fade" | "slide" | "scale" | "none";
  disableOnLowPerformance?: boolean;
}

// This component is simplified to avoid any flashing issues
export const AnimatedWrapper = ({
  children,
  className,
  ...props
}: AnimatedWrapperProps) => {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
};
