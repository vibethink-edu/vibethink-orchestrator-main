"use client"
import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils"

const Avatar = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
        ref={ref}
        className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className
        )}
        {...props}
    />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Image>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
        ref={ref}
        className={cn("aspect-square h-full w-full", className)}
        {...props}
    />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted",
            className
        )}
        {...props}
    />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

const indicatorVariants = cva("size-2 absolute rounded-full", {
  variants: {
    variant: {
      success: "bg-green-400",
      danger: "bg-red-400",
      warning: "bg-orange-400"
    },
    position: {
      "top-end": "end-0.5 top-0.5",
      "bottom-end": "end-0.5 bottom-0.5",
      "bottom-start": "start-0.5 bottom-0.5",
      "top-start": "start-0.5 top-0.5"
    }
  }
});

export interface AvatarIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof indicatorVariants> {
  variant?: "success" | "danger" | "warning" | null;
  position?: "top-end" | "bottom-end" | "bottom-start" | "top-start" | null;
}

function AvatarIndicator({
  variant,
  position = "bottom-end",
  className,
  ...props
}: AvatarIndicatorProps) {
  return (
    <div
      data-slot="avatar-indicator"
      className={cn(indicatorVariants({ variant, position, className }))}
      {...props}></div>
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarIndicator }

