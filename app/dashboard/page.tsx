// app/dashboard/page.tsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Task {
  id: string
  title: string
  dueDate: string
  isCompleted: boolean
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data.tasks))
  }, [])

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

      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="p-4 border rounded-lg bg-white">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={(e) => {
                  fetch(`/api/tasks/${task.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ isCompleted: e.target.checked })
                  }).then(() => {
                    setTasks(prev => prev.map(t => 
                      t.id === task.id ? {...t, isCompleted: e.target.checked} : t
                    ))
                  })
                }}
                className="h-5 w-5"
              />
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}