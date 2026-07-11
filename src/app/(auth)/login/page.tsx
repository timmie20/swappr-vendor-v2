import SignInForm from "@/features/login/page";
import React, { Suspense } from "react";

// SignInForm reads callbackUrl via useSearchParams, which bails out of
// static rendering — Next requires a Suspense boundary around it
export default function page() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
