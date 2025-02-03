import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// PATCH: Update task completion status
export async function PATCH(req: Request, { params }: { params: { taskId: string } }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = params;
  const { isCompleted } = await req.json();

  const task = await prisma.task.update({
    where: { id: taskId },
    data: { isCompleted },
  });

  return NextResponse.json(task);
}

// DELETE: Remove a task
export async function DELETE(req: Request, { params }: { params: { taskId: string } }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = params;

  await prisma.task.delete({
    where: { id: taskId },
  });

  return NextResponse.json({ message: "Task deleted successfully" });
}
