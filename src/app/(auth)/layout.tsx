import React from "react";
import { InteractiveGridPattern } from "@/components/interactive-grid";
import { cn } from "@/lib/utils";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 overflow-hidden">
      <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        {/* <div className="text-large relative z-20 flex items-center font-medium">
          <Image
            src="./assets/swappr-logo-dark.png"
            alt="Swappr"
            width={200}
            height={40}
            priority
            className="h-10 w-auto cursor-pointer"
          />
        </div> */}
        <InteractiveGridPattern
          className={cn(
            "mask-[radial-gradient(400px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[0%] h-full skew-y-12",
          )}
        />
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              Swappr platform aims to create a secure and transparent system for
              buying and swapping phones by implementing a phone rating
              calculator to accurately represent device conditions, addressing
              prevalent fraud in the Nigerian market. The system will utilize
              diagnostic tools, user verification through KYC, and AI-driven
              fraud prevention in future updates.
            </p>
            <footer className="text-sm">Cheers 🍻</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex min-h-screen items-center justify-center p-4 py-8 lg:p-8">
        <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
