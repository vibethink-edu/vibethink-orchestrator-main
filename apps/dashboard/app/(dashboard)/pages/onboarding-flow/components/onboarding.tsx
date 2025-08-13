/**
 * Onboarding Component
 * VibeThink Orchestrator Dashboard
 * 
 * Main component managing the multi-step onboarding flow
 */

"use client";

import { InterestsStep } from "./interests-step";
import { WorkPreferencesStep } from "./work-preferences-step";
import { AccountTypeStep } from "./account-type-step";

import { useOnboardingStore } from "../store";

const steps = [InterestsStep, WorkPreferencesStep, AccountTypeStep];

export default function Onboarding() {
  const { currentStep } = useOnboardingStore();
  const CurrentStepComponent = steps[currentStep];

  return (
    <div className="mx-auto max-w-3xl lg:pt-10">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-16 rounded-full transition-all ${
                index <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>
      
      {/* Current step component */}
      <CurrentStepComponent />
    </div>
  );
}
