import { createFileRoute } from "@tanstack/react-router";
import { TaskTrackerPage } from "@/pages/task-tracker/ui/TaskTrackerPage";

export const Route = createFileRoute("/tasks")({
  component: TaskTrackerPage,
});
