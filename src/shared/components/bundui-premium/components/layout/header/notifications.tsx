"use client";

import { Bell } from "lucide-react";
import { Button } from "@/shared/components/bundui-premium/components/ui/button";

export default function Notifications() {
  return (
    <Button variant="outline" size="icon">
      <Bell className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Notifications</span>
    </Button>
  );
}
