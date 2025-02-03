// app/api/save-onboarding.ts
import { PrismaClient } from '@prisma/client'
import { getAuth } from '@clerk/nextjs/server'
import { createClerkClient } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! })

interface OnboardingData {
  industry?: string
  processesUserData?: boolean
  teamSize?: string
}

interface Auth {
  userId: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const auth = getAuth(req)
    const { userId } = auth as Auth
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const user = await clerk.users.getUser(userId)
    const email = user.emailAddresses[0]?.emailAddress
    const body = req.body as OnboardingData

    await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email: email || null,
        industry: body.industry || 'general',
      },
      update: {
        email: email || null,
        industry: body.industry || 'general',
      },
    })

    const tasks = getDefaultTasks(body.industry || 'general', body.processesUserData || false)
    await prisma.task.createMany({
      data: tasks.map(task => ({
        title: task.title,
        userId: userId,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })),
    })

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Onboarding error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Helper function remains the same
function getDefaultTasks(industry: string, processesUserData: boolean) {
  const baseTasks = [
    { title: 'Sign NDA Template' },
    { title: 'Complete Employee Onboarding' },
  ]

  if (industry === 'ai') {
    baseTasks.push({ title: 'Run AI Model Fairness Assessment' })
  }

  if (processesUserData) {
    baseTasks.push({ title: 'Implement GDPR Consent Banner' })
  }

  return baseTasks
}