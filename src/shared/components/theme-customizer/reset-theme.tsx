"use client";

import { useThemeConfig } from "@/components/active-theme";
import { Button } from "@vibethink/ui";
import { DEFAULT_THEME } from "@/lib/themes";

export function ResetThemeButton() {
  const { setTheme } = useThemeConfig();

  const resetThemeHandle = () => {
    setTheme(DEFAULT_THEME);
  };

  return (
    <Button variant="destructive" className="mt-4 w-full" onClick={resetThemeHandle}>
      Reset to Default
    </Button>
  );
}
