"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/shared/icons";
import { getInitials } from "@/helpers/format";
import { format } from "date-fns";
import type { VendorProfile } from "@/types/auth";

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-semibold text-gray-900">{value}</p>
      <p className="text-muted-foreground mt-0.5 text-xs">{label}</p>
    </div>
  );
}

export function ProfileHero({ profile }: { profile: VendorProfile }) {
  const joined = profile.created_at
    ? format(new Date(profile.created_at), "MMM yyyy")
    : null;

  return (
    <div className="border-border overflow-hidden rounded-lg border bg-white">
      {/* Accent band behind the logo */}
      <div className="from-primary/10 via-primary/5 h-20 bg-linear-to-r to-transparent" />

      <div className="px-6 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          {/* Logo — pulled up over the band so it reads as the store's mark */}
          <div className="-mt-10 flex items-end gap-4">
            <Avatar className="size-24 rounded-2xl border-4 border-white bg-white shadow-md">
              <AvatarImage
                src={profile.logo_url}
                alt={`${profile.business_name} logo`}
                className="object-cover object-center"
              />
              <AvatarFallback className="rounded-2xl text-xl font-semibold">
                {getInitials(profile.business_name) || (
                  <Icons.store className="size-8 text-gray-400" />
                )}
              </AvatarFallback>
            </Avatar>

            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-gray-900">
                  {profile.business_name}
                </h2>
                {profile.is_verified ? (
                  <Badge className="gap-1">
                    <Icons.shieldCheck className="size-3.5" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="capitalize">
                    {profile.verification_status ?? "Unverified"}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                {profile.user?.email}
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-6 sm:pb-1">
            <Stat
              label="Rating"
              value={
                <span className="inline-flex items-center gap-1">
                  <Icons.star className="size-4 fill-amber-400 text-amber-400" />
                  {profile.rating != null ? Number(profile.rating).toFixed(1) : "—"}
                </span>
              }
            />
            <Stat
              label="Trades completed"
              value={profile.total_trades_completed ?? 0}
            />
            {joined && <Stat label="Member since" value={joined} />}
          </div>
        </div>
      </div>
    </div>
  );
}
