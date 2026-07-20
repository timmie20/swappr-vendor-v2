import { Check } from "lucide-react";
import { ONBOARDING_STEPS, getStepStatus, type StepStatus } from "../config";
import { cn } from "@/lib/utils";
import { OnboardingStep } from "@/types/onboarding";

interface OnboardingStepperProps {
  currentStep: OnboardingStep;
}

export function OnboardingStepper({ currentStep }: OnboardingStepperProps) {
  const steps = ONBOARDING_STEPS.map((step) => ({
    ...step,
    status: getStepStatus(currentStep, step.completesAt),
  }));

  const activeIndex = steps.findIndex((s) => s.status === "current");
  const completedCount = steps.filter((s) => s.status === "completed").length;
  const progressPercent =
    ((completedCount + (activeIndex !== -1 ? 0.5 : 0)) / steps.length) * 100;

  // console.log({
  //   currentStep,
  //   steps,
  //   activeIndex,
  //   progressPercent,
  //   getStepStatus: steps.map((s) => getStepStatus(currentStep, s.completesAt)),
  // });

  return (
    <>
      {/* Desktop: full vertical stepper */}
      <nav
        aria-label="Onboarding progress"
        className="hidden lg:flex lg:flex-col"
      >
        {steps.map((step, i) => (
          <div key={step.action} className="flex gap-4">
            <div className="flex flex-col items-center">
              <StepIndicator status={step.status} index={i + 1} />
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "my-1 w-px flex-1",
                    step.status === "completed" ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </div>
            <div className={cn("pb-10", i === steps.length - 1 && "pb-0")}>
              <p
                className={cn(
                  "text-sm font-semibold",
                  step.status === "upcoming"
                    ? "text-muted-foreground"
                    : "text-background",
                )}
              >
                {step.title}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </nav>

      {/* Mobile: compact progress + collapsible full list */}
      <details className="group lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-1">
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Step {Math.min(activeIndex + 1, steps.length)} of {steps.length}
            </p>
            <p className="text-foreground text-sm font-semibold">
              {steps[activeIndex]?.title ?? "Onboarding complete"}
            </p>
          </div>
          <span className="text-muted-foreground text-xs group-open:hidden">
            View steps
          </span>
          <span className="text-muted-foreground hidden text-xs group-open:inline">
            Hide
          </span>
        </summary>

        <div className="bg-border mt-3 h-1 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="border-border mt-4 flex flex-col gap-4 border-t pt-4">
          {steps.map((step, i) => (
            <div key={step.action} className="flex items-start gap-3">
              <StepIndicator status={step.status} index={i + 1} compact />
              <div>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    step.status === "upcoming"
                      ? "text-muted-foreground"
                      : "text-foreground",
                  )}
                >
                  {step.title}
                </p>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </details>
    </>
  );
}

function StepIndicator({
  status,
  index,
  compact,
}: {
  status: StepStatus;
  index: number;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full text-xs font-medium",
        compact ? "h-6 w-6" : "h-8 w-8",
        status === "completed" && "bg-primary text-primary-foreground",
        status === "current" &&
          "border-primary/50 bg-background text-primary border-2",
        status === "upcoming" &&
          "border-border bg-background text-muted-foreground border",
      )}
    >
      {status === "completed" ? <Check className="h-4 w-4" /> : index}
    </div>
  );
}
