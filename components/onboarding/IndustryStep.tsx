// components/onboarding/IndustryStep.tsx

interface IndustryStepProps {
  onNext: (data: { industry: string }) => void
}

export default function IndustryStep({ onNext }: IndustryStepProps) {
    const industries = [
      { id: 'ai', label: 'AI Startup' },
      { id: 'healthcare', label: 'Healthcare' },
      { id: 'fintech', label: 'Fintech' },
      { id: 'remote', label: 'Remote Team' },
    ]
  
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">What&apos;s your industry?</h1>
        <div className="space-y-3">
          {industries.map((industry) => (
            <button
              key={industry.id}
              onClick={() => onNext({ industry: industry.id })}
              className="w-full p-4 text-left border rounded-lg hover:bg-gray-50"
            >
              {industry.label}
            </button>
          ))}
        </div>
      </div>
    )
  }