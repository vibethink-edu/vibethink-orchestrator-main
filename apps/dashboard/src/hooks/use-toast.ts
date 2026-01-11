"use client"

import { toast } from "@vibethink/ui"

/**
 * useToast compatibility hook for sonner
 */
export function useToast() {
  return {
    toast: (props: { title?: string; description?: string; variant?: string }) => {
      if (props.variant === 'destructive') {
        return toast.error(props.title || props.description, {
          description: props.title ? props.description : undefined
        });
      }
      return toast(props.title || props.description, {
        description: props.title ? props.description : undefined
      });
    },
    dismiss: (toastId?: string) => {
      // sonner dismiss
    }
  }
}

export { toast };
