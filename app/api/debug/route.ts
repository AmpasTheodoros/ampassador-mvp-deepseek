// app/api/debug/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      tasks: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })
  
  return NextResponse.json({
    users: users.map(user => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
      tasks: user.tasks.map(task => ({
        ...task,
        dueDate: task.dueDate.toISOString(),
        createdAt: task.createdAt.toISOString()
      }))
    }))
  })
}