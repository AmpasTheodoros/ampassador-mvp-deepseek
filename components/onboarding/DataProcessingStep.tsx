// components/onboarding/DataProcessingStep.tsx

import { useState } from "react"

interface DataProcessingProps {
  onNext: (data: { processesUserData: boolean }) => void
}

export default function DataProcessingStep({ onNext }: DataProcessingProps) {
    const [processesUserData, setProcessesUserData] = useState(false)
  
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Data Processing</h1>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={processesUserData}
              onChange={(e) => setProcessesUserData(e.target.checked)}
              className="h-4 w-4"
            />
            Do you process user data? (GDPR compliance)
          </label>
          
          <button
            onClick={() => onNext({ processesUserData })}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
    )
  }