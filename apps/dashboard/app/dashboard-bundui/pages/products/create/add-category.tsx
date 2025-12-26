import { Button } from "@vibethink/ui/components/button";
import { Input } from "@vibethink/ui/components/input";
import { Label } from "@vibethink/ui/components/label";
import { Popover, PopoverContent, PopoverTrigger } from "@vibethink/ui/components/popover";
import { PlusCircle } from "lucide-react";

export default function AddNewCategory() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="grid items-center gap-4 lg:grid-flow-col">
          <Label htmlFor="width">Name</Label>
          <Input id="width" className="h-8" />
        </div>
      </PopoverContent>
    </Popover>
  );
}













