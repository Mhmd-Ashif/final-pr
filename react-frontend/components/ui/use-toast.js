import * as React from "react";
import { toast as sonner } from "sonner";

export function useToast() {
  const toast = React.useCallback((props) => {
    const { title, description, action, duration = 3000, ...rest } = props;

    return sonner(title || "", {
      description,
      action,
      duration,
      ...rest,
    });
  }, []);

  return {
    toast,
  };
}
