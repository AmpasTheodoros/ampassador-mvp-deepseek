// app/api/cron/reminders/route.ts
import { NextResponse } from 'next/server';
import { sendTaskReminders } from '@/lib/notifications';

export async function GET() {
  try {
    await sendTaskReminders();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}