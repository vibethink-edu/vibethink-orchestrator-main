"use client";
// @ts-nocheck - TODO: Fix React types conflict in monorepo

/**
 * Reset Theme Button - @vibethink/ui
 * 
 * Botón para restablecer el tema a valores por defecto
 */

import { RotateCcw } from "lucide-react";
import { Button } from "../../button";
import { useThemeConfig } from "../../../providers/active-theme";
import { Separator } from "../../separator";

export function ResetThemeButton() {
  const { resetTheme } = useThemeConfig();

  return (
    <>
      <Separator className="my-4" />
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={resetTheme}
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset to Default
      </Button>
    </>
  );
}

