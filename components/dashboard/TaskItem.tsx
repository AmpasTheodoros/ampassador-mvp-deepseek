// components/dashboard/TaskItem.tsx
'use client'
import { useState } from 'react'

interface TaskItemProps {
  task: {
    id: string
    title: string
    dueDate: string
    isCompleted: boolean
  }
}

export default function TaskItem({ task }: TaskItemProps) {
  const [isChecked, setIsChecked] = useState(task.isCompleted)

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-white">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => {
          setIsChecked(e.target.checked)
          fetch(`/api/tasks/${task.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ isCompleted: e.target.checked })
          })
        }}
        className="h-5 w-5"
      />
      <div className="flex-1">
        <p className="font-medium">{task.title}</p>
        <p className="text-sm text-gray-500">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}