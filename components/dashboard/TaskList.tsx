// components/dashboard/TaskList.tsx
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTaskUpdate } from "@/hooks/useTaskUpdate";

export default function TaskList({
  initialTasks,
  totalTasks,
  completedTasks,
  sortBy,
  filterStatus
}: {
  initialTasks: { 
    id: string; 
    title: string; 
    dueDate: Date | string; 
    isCompleted: boolean; 
    description?: string;  
  }[];
  totalTasks: number;
  completedTasks: number;
  sortBy?: string;
  filterStatus?: string;
}) {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const { toggleTaskStatus, isUpdating } = useTaskUpdate();

  const handleSortChange = (newSort: string) => {
    router.push(`?sortBy=${newSort}&filterStatus=${filterStatus || 'all'}`);
  };

  const handleFilterChange = (newFilter: string) => {
    router.push(`?sortBy=${sortBy || 'dueDate'}&filterStatus=${newFilter}`);
  };

  const handleToggle = async (taskId: string) => {
    const originalTasks = [...tasks];
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    ));

    const success = await toggleTaskStatus(taskId);
    if (!success) {
      setTasks(originalTasks);
      alert('Failed to update task status');
    } else {
      router.refresh();
    }
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Compliance Progress</h2>
          <span className="text-sm text-gray-600">
            {completedTasks}/{totalTasks} tasks completed
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-green-500 rounded-full transition-all duration-300"
            style={{ width: `${totalTasks > 0 ? (completedTasks/totalTasks)*100 : 0}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Sort by:</label>
          <select 
            className="p-2 border rounded-lg"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="dueDate">Due Date</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Filter by:</label>
          <select
            className="p-2 border rounded-lg"
            value={filterStatus}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="all">All Tasks</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Compliance Tasks</h2>
        {tasks.length > 0 ? (
          tasks.map(task => (
            <div 
              key={task.id}
              className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  )}
                  <div className="flex items-center mt-2">
                    <svg 
                      className="w-4 h-4 mr-1 text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                    <span className="text-sm text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                <button 
                  className={`task-status ${
                    task.isCompleted 
                      ? 'task-status-completed' 
                      : 'task-status-pending'
                  } cursor-pointer`}
                  onClick={() => handleToggle(task.id)}
                  disabled={isUpdating}
                >
                  {task.isCompleted ? 'Completed' : 'Pending'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500 border-2 border-dashed rounded-lg">
            No tasks match current filters
          </div>
        )}
      </div>
    </>
  );
}