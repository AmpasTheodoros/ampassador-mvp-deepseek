'use client'

import { useState } from 'react';

export const useTaskUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleTaskStatus = async (taskId: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Update failed');
      return true;
    } catch (error) {
      console.error('Update error:', error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { toggleTaskStatus, isUpdating };
};