"use client";

import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "@/components/ui/input";

interface PayoutAmountRangeFilterProps {
  minValue: string;
  maxValue: string;
  onMinChange: (value: string | undefined) => void;
  onMaxChange: (value: string | undefined) => void;
}

export function PayoutAmountRangeFilter({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: PayoutAmountRangeFilterProps) {
  const [min, setMin] = useState(minValue);
  const [max, setMax] = useState(maxValue);

  // Reflect external resets (the toolbar's Reset button) back into these
  // uncontrolled-feeling inputs
  useEffect(() => setMin(minValue), [minValue]);
  useEffect(() => setMax(maxValue), [maxValue]);

  const commitMin = useDebouncedCallback(
    (value: string) => onMinChange(value === "" ? undefined : value),
    400,
  );
  const commitMax = useDebouncedCallback(
    (value: string) => onMaxChange(value === "" ? undefined : value),
    400,
  );

  return (
    <div className="flex items-center gap-1">
      <Input
        type="number"
        inputMode="numeric"
        placeholder="Min ₦"
        value={min}
        onChange={(e) => {
          setMin(e.target.value);
          commitMin(e.target.value);
        }}
        className="h-8 w-24"
      />
      <span className="text-muted-foreground text-xs">–</span>
      <Input
        type="number"
        inputMode="numeric"
        placeholder="Max ₦"
        value={max}
        onChange={(e) => {
          setMax(e.target.value);
          commitMax(e.target.value);
        }}
        className="h-8 w-24"
      />
    </div>
  );
}
