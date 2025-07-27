import { ThemeToggle } from "@/components/ui/theme-toggle";
import { KanbanBoard } from "@/components/kanban-board";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <KanbanBoard />
    </div>
  );
}
