"use client";

import { useThemeConfig } from "@/shared/components/bundui-premium/components/active-theme";
import { Button } from "@/shared/components/bundui-premium/components/ui/button";
import { DEFAULT_THEME } from "@/shared/lib/themes";

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
