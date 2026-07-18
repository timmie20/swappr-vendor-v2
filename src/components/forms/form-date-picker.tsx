"use client";

import { FieldPath, FieldValues, useController } from "react-hook-form";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
} from "@/components/ui/field";
import { BaseFormFieldProps } from "@/types/form";
import { cn } from "@/lib/utils";

interface FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  placeholder?: string;
  disablePast?: boolean;
}

// Stores/reads the field value as a "yyyy-MM-dd" string — matches what the
// status-update payload sends for pickup_date.
function FormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  required,
  disabled,
  className,
  placeholder = "Select a date",
  disablePast = true,
}: FormDatePickerProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ control, name });

  const selected = field.value ? parseISO(field.value) : undefined;

  return (
    <Field
      className={className}
      orientation="responsive"
      data-invalid={fieldState.invalid}
    >
      <FieldContent>
        {label && (
          <FieldLabel htmlFor={name}>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </FieldLabel>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={name}
              type="button"
              variant="outline"
              disabled={disabled}
              aria-invalid={fieldState.invalid}
              className={cn(
                "w-full justify-start text-left font-normal",
                !selected && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              {selected ? format(selected, "dd MMM yyyy") : placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={(date) =>
                field.onChange(date ? format(date, "yyyy-MM-dd") : "")
              }
              disabled={disablePast ? { before: new Date() } : undefined}
              autoFocus
            />
          </PopoverContent>
        </Popover>
        {description && <FieldDescription>{description}</FieldDescription>}
        {fieldState.invalid && (
          <FieldError errors={[fieldState.error]} className="text-xs" />
        )}
      </FieldContent>
    </Field>
  );
}

export { FormDatePicker };
