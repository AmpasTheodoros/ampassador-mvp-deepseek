// app/onboarding/page.tsx

"use client";
import { useUser } from "@clerk/nextjs";
import DataProcessingStep from "@/components/onboarding/DataProcessingStep";
import IndustryStep from "@/components/onboarding/IndustryStep";
import TeamSizeStep from "@/components/onboarding/TeamSizeStep";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    industry: "",
    processesUserData: false,
    teamSize: "1-5",
    email: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    
    // Set initial email from Clerk user
    setFormData(prev => ({
      ...prev,
      email: user?.emailAddresses[0]?.emailAddress || ""
    }));

    if (!isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router, user]);

  const handleNext = async (newData: Partial<typeof formData>) => {
    const updatedData = { ...formData, ...newData };
    setFormData(updatedData);

    if (step === 3) {
      try {
        setIsSubmitting(true);
        const response = await fetch("/api/save-onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData)
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to save onboarding data");
        }

        router.push("/dashboard");
      } catch (error) {
        console.error("Onboarding submission error:", error);
        setError("Failed to submit onboarding data");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setStep(prev => prev + 1);
    }
  };

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        {step === 1 && (
          <IndustryStep
            initialIndustry={formData.industry}
            onNext={(data) => {
              handleNext(data);
            }}
          />
        )}
        {step === 2 && (
          <DataProcessingStep
            initialProcessesUserData={formData.processesUserData}
            onNext={(data) => {
              handleNext(data);
            }}
          />
        )}
        {step === 3 && (
          <TeamSizeStep
            initialTeamSize={formData.teamSize}
            onNext={(data) => {
              handleNext(data);
            }}
            isSubmitting={isSubmitting}
          />
        )}
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
