"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  content: React.ReactNode;
}

interface StepByStepProps {
  steps: Step[];
  currentStep?: number;
}

export default function StepByStep({ steps, currentStep }: StepByStepProps) {
  return (
    <div className="my-6 space-y-0">
      {steps.map((step, i) => {
        const stepNum = i + 1;
        const isCurrent = currentStep === stepNum;
        const isCompleted = currentStep !== undefined && stepNum < currentStep;

        return (
          <div key={i} className="flex gap-4">
            {/* Step indicator column */}
            <div className="flex flex-col items-center">
              {/* Badge */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0",
                  isCompleted && "bg-green-500 text-white",
                  isCurrent && "bg-[var(--accent)] text-white animate-pulse",
                  !isCompleted && !isCurrent && "bg-[var(--surface-elevated)] text-[var(--text-secondary)]"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  stepNum
                )}
              </div>
              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div className="w-0.5 flex-1 min-h-[16px] bg-[var(--border-color)]" />
              )}
            </div>

            {/* Content */}
            <div className="pb-6 pt-1 min-w-0 flex-1">
              <div className="text-[var(--text-primary)] text-[15px] leading-relaxed [&>p]:my-1">
                {step.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
