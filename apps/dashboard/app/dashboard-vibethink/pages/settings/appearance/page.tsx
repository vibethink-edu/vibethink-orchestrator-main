"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent
} from "@vibethink/ui";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { ThemePicker, ThemePickerGrid } from "@/shared/components/theme-picker";
import { useTranslation } from "@/lib/i18n";

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark"], {
    required_error: "Please select a theme."
  }),
  font: z.enum(["inter", "manrope", "system"], {
    invalid_type_error: "Select a font",
    required_error: "Please select a font."
  })
});

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

const defaultValues: Partial<AppearanceFormValues> = {
  theme: "light"
};

/**
 * Componente para Dark/Light Mode Toggle
 */
function DarkLightModeSettings() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues
  });

  function onSubmit(data: AppearanceFormValues) {
    toast.success(t("settings.appearance.updated") || "Preferences updated successfully");
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="font"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("settings.appearance.font") || "Font"}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("settings.appearance.selectFont") || "Select font"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Manrope">Manrope</SelectItem>
                      <SelectItem value="System">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t("settings.appearance.fontDescription") || "Set the font you want to use in the dashboard."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>{t("settings.appearance.theme") || "Theme"}</FormLabel>
                  <FormDescription>
                    {t("settings.appearance.themeDescription") || "Select the theme for the dashboard."}
                  </FormDescription>
                  <FormMessage />
                  <RadioGroup
                    onValueChange={(value) => {
                      setTheme(value);
                      field.onChange();
                    }}
                    defaultValue={field.value}
                    className="flex max-w-md gap-6 pt-2">
                    <FormItem>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary flex-col">
                        <FormControl>
                          <RadioGroupItem value="light" className="sr-only" />
                        </FormControl>
                        <div className="hover:border-accent items-center rounded-lg border-2 p-1">
                          <div className="space-y-2 rounded-lg bg-[#ecedef] p-2">
                            <div className="space-y-2 rounded-md bg-white p-2 shadow-xs">
                              <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                              <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                            </div>
                            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
                              <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                              <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                            </div>
                            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
                              <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                              <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                            </div>
                          </div>
                        </div>
                        <span className="block w-full p-2 text-center font-normal">
                          {t("settings.appearance.light") || "Light"}
                        </span>
                      </FormLabel>
                    </FormItem>
                    <FormItem>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary flex-col">
                        <FormControl>
                          <RadioGroupItem value="dark" className="sr-only" />
                        </FormControl>
                        <div className="bg-popover hover:bg-accent hover:text-accent-foreground items-center rounded-lg border-2 p-1">
                          <div className="space-y-2 rounded-lg bg-slate-950 p-2">
                            <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-xs">
                              <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                              <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                            </div>
                            <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs">
                              <div className="h-4 w-4 rounded-full bg-slate-400" />
                              <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                            </div>
                            <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs">
                              <div className="h-4 w-4 rounded-full bg-slate-400" />
                              <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                            </div>
                          </div>
                        </div>
                        <span className="block w-full p-2 text-center font-normal">
                          {t("settings.appearance.dark") || "Dark"}
                        </span>
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormItem>
              )}
            />

            <Button type="submit">
              {t("settings.appearance.updatePreferences") || "Update preferences"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

/**
 * Página de configuración de apariencia con Theme Picker para dashboard-vibethink
 * Incluye selector de tema preset (colores) y modo dark/light
 * Con soporte multidioma (i18n)
 */
export default function AppearanceSettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {t("settings.appearance.title") || "Apariencia"}
        </h2>
        <p className="text-muted-foreground">
          {t("settings.appearance.description") || 
            "Personaliza la apariencia de tu dashboard. Elige un tema de color y ajusta otros aspectos visuales."}
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Preset Picker */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {t("settings.appearance.colorTheme") || "Tema de Color"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("settings.appearance.colorThemeDescription") || 
                    "Selecciona un preset de color para personalizar la paleta de tu dashboard."}
                </p>
              </div>
              
              {/* Vista de grid con previews */}
              <ThemePickerGrid />
              
              {/* Selector compacto alternativo */}
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  {t("settings.appearance.useCompactSelector") || "O usa el selector compacto:"}
                </p>
                <ThemePicker className="max-w-xs" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dark/Light Mode Toggle */}
        <DarkLightModeSettings />
      </div>
    </div>
  );
}







