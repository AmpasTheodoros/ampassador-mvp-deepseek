// lib/notifications.ts
import { prisma } from './prisma';
import { sendEmail } from './email';
import { renderReminderTemplate } from './email-templates';

export async function sendTaskReminders() {
  try {
    const users = await prisma.user.findMany({
      include: {
        tasks: {
          where: {
            isCompleted: false,
            dueDate: {
              lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
            }
          }
        }
      }
    });

    for (const user of users) {
      if (user.tasks.length > 0 && user.email) {
        await sendEmail({
          to: user.email,
          subject: `You have ${user.tasks.length} upcoming compliance tasks`,
          html: renderReminderTemplate(user.tasks)
        });
      }
    }
  } catch (error) {
    console.error('Error sending reminders:', error);
  }
}