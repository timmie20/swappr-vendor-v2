"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FieldGroup, Field } from "@/components/ui/field";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { FormInput } from "@/components/forms/form-input";
import { signInSchema } from "@/schemas/auth";
import { useLogin } from "@/hooks/services/use-auth";
import Image from "next/image";
import { ASSETS } from "@/constants/assets";

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const searchParams = useSearchParams();

  const redirect = searchParams.get("callbackUrl") ?? "/overview";

  const login = useLogin();

  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: SignInFormValues) {
    login.mutate(values, {
      onSuccess: () => {
        router.push(redirect);
      },
    });
  }

  return (
    <div className="w-full space-y-6 px-4 md:px-0">
      <div className="flex items-center justify-center lg:hidden">
        <Image
          src={ASSETS.LOGO_DARK}
          alt="Swappr"
          width={200}
          height={40}
          priority
          className="h-10 w-auto cursor-pointer"
        />
      </div>
      <h1 className="font-switzer text-center text-2xl font-bold">
        Let&apos;s get you Signed in
      </h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <FormInput
            control={form.control}
            name="email"
            type="email"
            label="Email"
            placeholder="john.doe@example.com"
            required
          />

          <FormInput
            control={form.control}
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            showPasswordToggle
            required
          />

          <div className="flex justify-end">
            <Link
              href="/auth/reset-password"
              className="text-primary hover:text-primary/80 text-sm font-medium hover:cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>
        </FieldGroup>

        <Field orientation="horizontal">
          <Button
            type="submit"
            className="h-12 w-full cursor-pointer"
            disabled={login.isPending}
            size="lg"
          >
            {login.isPending ? (
              <span className="inline-flex items-center gap-2">
                <Spinner /> Signing in
              </span>
            ) : (
              "Sign in"
            )}
          </Button>
        </Field>
      </form>

      <p className="text-muted-foreground px-8 text-center text-sm">
        By clicking continue, you agree to our{" "}
        <Link
          href="/terms"
          className="hover:text-primary underline underline-offset-4"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="hover:text-primary underline underline-offset-4"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
