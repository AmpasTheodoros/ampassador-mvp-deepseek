// components/onboarding/IndustryStep.tsx

interface IndustryStepProps {
  initialIndustry?: string;
  onNext: (data: { industry: string }) => void
}

export default function IndustryStep({ onNext, initialIndustry }: IndustryStepProps) {
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
              className={`w-full p-4 text-left border rounded-lg hover:bg-gray-50 ${
                initialIndustry === industry.id ? 'bg-blue-100 border-blue-500' : ''
              }`}
            >
              {industry.label}
            </button>
          ))}
        </div>
      </div>
    )
  }