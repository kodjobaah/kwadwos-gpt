"use client";

import React from "react";
import { Root, Indicator } from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef(({ className, value = 0, ...props }, ref) => (
  <Root
    ref={ref}
    className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
    {...props}
  >
    <Indicator
      className="h-full w-full bg-primary transition-transform"
      style={{ transform: `translateX(-${100 - value}%)` }}
    />
  </Root>
));
Progress.displayName = "Progress";

export { Progress };
