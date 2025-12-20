import { generateMeta } from "@/lib/utils";
import NotesApp from "./note-app";

export async function generateMetadata() {
  return generateMeta({
    title: "Notes V2",
    description:
      "Add, organize and manage notes with the note app template. Built with shadcn/ui, Next.js and Tailwind CSS.",
    canonical: "/dashboard-vibethink/notes-v2"
  });
}

export default function Page() {
  return <NotesApp />;
}
