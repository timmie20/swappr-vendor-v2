"use client";

import type { Control, UseFieldArrayReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/forms/form-input";
import { Icons } from "@/components/shared/icons";

type SpecificationsSectionProps = {
  control: Control<any>;
  specifications: UseFieldArrayReturn<any, "specifications">;
};

export default function SpecificationsSection({
  control,
  specifications,
}: SpecificationsSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase">Specifications</h3>

        <Button
          type="button"
          className="cursor-pointer"
          onClick={() =>
            specifications.append({
              key: "",
              value: "",
            })
          }
        >
          Add Specs
        </Button>
      </div>

      {specifications.fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-[1fr_1fr_auto] place-items-center gap-4"
        >
          <FormInput
            control={control}
            name={`specifications.${index}.key`}
            label="Name"
            placeholder="RAM"
          />

          <FormInput
            control={control}
            name={`specifications.${index}.value`}
            label="Value"
            placeholder="8GB"
          />

          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="cursor-pointer"
            onClick={() => specifications.remove(index)}
          >
            <Icons.trash />
          </Button>
        </div>
      ))}
    </section>
  );
}
