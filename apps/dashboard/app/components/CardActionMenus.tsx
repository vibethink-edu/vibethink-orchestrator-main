import { FolderUp } from "lucide-react";
import { cn } from "@/lib/utils";

import { DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger } from '@vibethink/ui';
import { Button } from '@vibethink/ui';

export function ExportButton({ className }: { className?: string }) {
  return (
    <div className={cn(className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <FolderUp /> <span className="hidden lg:inline">Export</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Excel</DropdownMenuItem>
          <DropdownMenuItem>PDF</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
