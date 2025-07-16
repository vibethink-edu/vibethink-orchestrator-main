"use client";

import { Search } from "lucide-react";
import { Input } from "@/shared/components/bundui-premium/components/ui/input";

export default function SearchComponent() {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input 
        placeholder="Search..." 
        className="pl-10"
      />
    </div>
  );
}
