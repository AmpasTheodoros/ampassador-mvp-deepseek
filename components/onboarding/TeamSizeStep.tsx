// components/onboarding/TeamSizeStep.tsx

import { useState } from "react"

interface TeamSizeStepProps {
    onNext: (data: { teamSize: string }) => void
    initialTeamSize?: string
    isSubmitting: boolean
}
  
export default function TeamSizeStep({ onNext, initialTeamSize, isSubmitting }: TeamSizeStepProps) {
    const [teamSize, setTeamSize] = useState(initialTeamSize || '1-5')
  
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Team Size</h1>
        <select
          value={teamSize}
          onChange={(e) => setTeamSize(e.target.value)}
          className="w-full p-3 border rounded-lg"
        >
          <option value="1-5">1-5 people</option>
          <option value="6-10">6-10 people</option>
          <option value="11+">11+ people</option>
        </select>
        
        <button
          onClick={() => onNext({ teamSize })}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg"
          disabled={isSubmitting}
        >
          Generate My Plan
        </button>
      </div>
    )
  }