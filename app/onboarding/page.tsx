'use client'
import DataProcessingStep from '@/components/onboarding/DataProcessingStep'
import IndustryStep from '@/components/onboarding/IndustryStep'
import TeamSizeStep from '@/components/onboarding/TeamSizeStep'
import { useState } from 'react'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    industry: '',
    processesUserData: false,
    teamSize: '1-5',
  })

  const handleNext = async (newData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...newData }))
    if (step === 3) {
        // Save to database
        await fetch('/api/save-onboarding', {
            method: 'POST',
            body: JSON.stringify(formData),
        })
        
        // Redirect to dashboard
        window.location.href = '/dashboard'
    }
    setStep(prev => prev + 1)
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {step === 1 && <IndustryStep onNext={handleNext} />}
      {step === 2 && <DataProcessingStep onNext={handleNext} />}
      {step === 3 && <TeamSizeStep onNext={handleNext} />}
    </div>
  )
}