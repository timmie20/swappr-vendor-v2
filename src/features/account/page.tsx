"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { useVendorProfile } from "@/hooks/services/use-vendor";
import { ProfileHero } from "./components/profile-hero";
import { ProfileForm } from "./components/profile-form";
import {
  AccountOwnerCard,
  PayoutCard,
  SettingsCard,
} from "./components/settings-card";

function AccountSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-44 w-full rounded-lg" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-56 w-full rounded-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-44 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function AccountError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="h-5 w-5 text-red-500" />
      </div>
      <h3 className="mb-1 text-sm font-semibold text-gray-900">
        Couldn&apos;t load your account
      </h3>
      <p className="mb-5 max-w-xs text-sm text-gray-400">
        There was a problem fetching your profile. Check your connection and
        try again.
      </p>
      <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
        <RotateCcw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  );
}

export default function AccountPage() {
  const { data: profile, isLoading, isError, refetch } = useVendorProfile();

  if (isLoading) return <AccountSkeleton />;
  if (isError || !profile) return <AccountError onRetry={() => refetch()} />;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ── Page header ── */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">
          Account
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your store profile and how buyers interact with it.
        </p>
      </div>

      {/* ── Store identity ── */}
      <ProfileHero profile={profile} />

      {/* ── Two-column grid ── */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_340px]">
        {/* Left — editable profile */}
        <ProfileForm profile={profile} />

        {/* Right — settings & read-only info */}
        <div className="space-y-4">
          <SettingsCard profile={profile} />
          <PayoutCard profile={profile} />
          <AccountOwnerCard profile={profile} />
        </div>
      </div>
    </div>
  );
}
