import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET: Fetch all tasks for the logged-in user
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { userId } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const tasks = await prisma.task.findMany({ where: { userId: user.id } });

  return NextResponse.json(tasks);
}

// POST: Add a new task
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, dueDate, description = "" } = await req.json();
  const user = await prisma.user.findUnique({ where: { userId } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      dueDate: new Date(dueDate),
      userId: user.id,
    },
  });

  return NextResponse.json(task);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const { isCompleted } = await req.json();

  const task = await prisma.task.update({
    where: { id },
    data: { isCompleted },
  });

  return NextResponse.json(task);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  await prisma.task.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Task deleted successfully" });
}
