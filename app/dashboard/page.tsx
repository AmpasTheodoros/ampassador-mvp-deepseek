// app/dashboard/page.tsx
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TaskList from "@/components/dashboard/TaskList";

export default async function Dashboard({
  searchParams,
}: {
  searchParams?: {
    sortBy?: string;
    filterStatus?: string;
  };
}) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { userId },
    include: {
      tasks: true
    }
  });

  if (!user) {
    return redirect("/onboarding");
  }

  // Server-side sorting/filtering
  const sortedTasks = sortTasks(user.tasks, searchParams?.sortBy || 'dueDate');
  const filteredTasks = filterTasks(sortedTasks, searchParams?.filterStatus || 'all');

  // Convert dueDate to Date object
  const processedTasks = filteredTasks.map(task => ({
    ...task,
    dueDate: task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate)
  }));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Compliance Dashboard</h1>
        <Link
          href="/api/generate-report"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          target="_blank"
        >
          Download Report
        </Link>
      </div>

      <TaskList 
        initialTasks={processedTasks} 
        totalTasks={user.tasks.length}
        completedTasks={user.tasks.filter(t => t.isCompleted).length}
        sortBy={searchParams?.sortBy}
        filterStatus={searchParams?.filterStatus}
      />
    </div>
  );
}

// Server-side sorting
function sortTasks(tasks: { id: string, title: string, dueDate: Date, isCompleted: boolean }[], sortBy: string) {
  switch (sortBy) {
    case 'title':
      return [...tasks].sort((a, b) => a.title.localeCompare(b.title));
    case 'status':
      return [...tasks].sort((a, b) => 
        a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1
      );
    case 'dueDate':
    default:
      return [...tasks].sort((a, b) => 
        a.dueDate.getTime() - b.dueDate.getTime()
      );
  }
}

// Server-side filtering
function filterTasks(tasks: { id: string, title: string, dueDate: Date, isCompleted: boolean }[], filterStatus: string) {
  if (!filterStatus) return tasks;
  return tasks.filter(task => 
    filterStatus === 'all' 
      ? true 
      : filterStatus === 'completed' 
      ? task.isCompleted 
      : !task.isCompleted
  );
}