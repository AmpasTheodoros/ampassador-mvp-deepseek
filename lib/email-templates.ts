// lib/email-templates.ts
export function renderReminderTemplate(tasks: any[]) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a365d;">Upcoming Compliance Deadlines</h2>
        <p>You have ${tasks.length} upcoming tasks that need your attention:</p>
        
        <ul style="list-style: none; padding: 0;">
          ${tasks.map(task => `
            <li style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem;">
              <h3 style="margin: 0 0 0.5rem 0; color: #2d3748;">${task.title}</h3>
              <p style="margin: 0; color: #4a5568;">${task.description}</p>
              <p style="margin: 0.5rem 0 0 0; color: #718096;">
                Due: ${new Date(task.dueDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </li>
          `).join('')}
        </ul>
        
        <p style="margin-top: 2rem; color: #4a5568;">
          Best regards,<br>
          The Compliance Team
        </p>
      </div>
    `;
  }