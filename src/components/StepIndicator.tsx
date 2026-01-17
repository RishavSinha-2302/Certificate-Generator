import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center space-x-4">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        const isCurrent = stepNumber === currentStep;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300",
                  isActive ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
                  isCurrent && "ring-4 ring-primary/30"
                )}
              >
                {stepNumber}
              </div>
              <p className={cn("mt-2 text-sm text-center", isCurrent ? "font-bold text-primary" : "text-muted-foreground")}>
                {step}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={cn("mx-4 h-1 w-16 rounded-full", isActive ? "bg-primary" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
