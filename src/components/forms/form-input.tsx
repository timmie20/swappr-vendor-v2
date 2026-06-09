"use client";

import { useState } from "react";
import { FieldPath, FieldValues, useController } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { BaseFormFieldProps } from "@/types/form";
import { Icons } from "../shared/icons";

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  step?: string | number;
  min?: string | number;
  max?: string | number;
  showPasswordToggle?: boolean;
  errors?: Array<{ message?: string } | undefined>;
}

function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  required,
  type = "text",
  placeholder,
  step,
  min,
  max,
  disabled,
  className,
  showPasswordToggle = false,
}: FormInputProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ control, name });

  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" && showPasswordToggle
      ? showPassword
        ? "text"
        : "password"
      : type;

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
        <div className="relative">
          <Input
            id={name}
            type={inputType}
            placeholder={placeholder}
            step={step}
            min={min}
            max={max}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
            className={showPasswordToggle ? "pr-10" : ""}
            {...field}
            onChange={(e) => {
              if (type === "number") {
                const value = e.target.value;
                field.onChange(value === "" ? undefined : parseFloat(value));
              } else {
                field.onChange(e.target.value);
              }
            }}
          />
          {showPasswordToggle && type === "password" && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 h-full cursor-pointer px-3 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <Icons.eyeOff className="text-muted-foreground h-4 w-4" />
              ) : (
                <Icons.eye className="text-muted-foreground h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        {description && <FieldDescription>{description}</FieldDescription>}
        {fieldState.invalid && (
          <FieldError
            errors={[fieldState.error]}
            className="text-xs"
          ></FieldError>
        )}
      </FieldContent>
    </Field>
  );
}

export { FormInput };
