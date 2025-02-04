import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const onboardingSchema = z.object({
  industry: z.enum(['ai', 'healthcare', 'fintech', 'remote']),
  processesUserData: z.boolean(),
  teamSize: z.enum(['1-5', '6-10', '11-20', '20+']),
  email: z.string().email().optional()
})

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '10 s'),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const identifier = userId || req.ip || 'anonymous'
  
    const { success } = await ratelimit.limit(identifier)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const rawBody = await req.json()
    const validation = onboardingSchema.safeParse(rawBody)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { data } = validation
    const email = data.email || `user-${userId}@example.com`

    // Transaction for atomic operations
    const result = await prisma.$transaction(async (tx) => {
      // Upsert user with industry data
      const user = await tx.user.upsert({
        where: { userId },
        update: {
          industry: data.industry,
          email: email,
        },
        create: {
          userId,
          email,
          industry: data.industry,
        },
        include: { tasks: true }
      })

      // Get default tasks for industry
      const defaultTasks = getDefaultTasks(data.industry).map(task => ({
        title: task.title,
        description: task.description,
        isCompleted: false,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        userId: userId
      }))

      // Filter out existing tasks
      const existingTitles = new Set(user.tasks.map(t => t.title))
      const tasksToAdd = defaultTasks.filter(t => !existingTitles.has(t.title))

      // Create new tasks if needed
      if (tasksToAdd.length > 0) {
        await tx.task.createMany({
          data: tasksToAdd,
          skipDuplicates: true
        })
      }

      // Return updated user with tasks
      return tx.user.findUnique({
        where: { userId },
        include: { tasks: true }
      })
    })

    return NextResponse.json({
      success: true,
      user: result,
      tasks: result?.tasks || []
    })

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Onboarding Error:', message)
    return NextResponse.json(
      { 
        success: false, 
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: error instanceof Error ? error.stack : undefined })
      }, 
      { status: 500 }
    )
  }
}

function getDefaultTasks(industry: string) {
  const tasks = {
    ai: [
      { title: 'Define AI Product Vision', description: 'Outline AI goals' },
      { title: 'Research AI Technologies', description: 'Explore frameworks' }
    ],
    healthcare: [
      { title: 'Compliance Check', description: 'Review regulations' },
      { title: 'Patient Data Strategy', description: 'Security plan' }
    ],
    fintech: [
      { title: 'Security Assessment', description: 'Conduct audit' },
      { title: 'Market Analysis', description: 'Industry trends' }
    ],
    remote: [
      { title: 'Remote Work Tools', description: 'Configure tools' },
      { title: 'Remote Work Policy', description: 'Create guidelines' }
    ]
  }

  return tasks[industry as keyof typeof tasks] || []
}