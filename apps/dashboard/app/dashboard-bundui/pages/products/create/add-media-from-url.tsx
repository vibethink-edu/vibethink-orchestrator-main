import { Button } from "@vibethink/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@vibethink/ui/components/dialog";
import { Input } from "@vibethink/ui/components/input";

export function AddMediaFromUrl({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Media From Url</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Input placeholder="https://www.example.com/image.jpg" />
        </div>
        <DialogFooter>
          <Button type="submit">Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}















