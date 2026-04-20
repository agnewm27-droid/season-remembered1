"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type UtmParams = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
};

type Props = {
  utm: UtmParams;
  joined: boolean;
  onJoined: () => void;
  /** Offer-style CTA copy */
  variant?: "hero" | "offer" | "final";
  className?: string;
};

export function WaitlistForm({
  utm,
  joined,
  onJoined,
  variant = "hero",
  className = "",
}: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [configError, setConfigError] = useState("");
  const [alreadyOnList, setAlreadyOnList] = useState(false);

  if (joined) {
    return (
      <div
        className={`flex items-center justify-center gap-3 rounded-lg border border-[#C8922A]/40 bg-[#1A1209] px-6 py-5 text-white ${className}`}
        role="status"
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C8922A]/20 text-[#C8922A]"
          aria-hidden
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <div>
          <p className="font-semibold text-[#FDF6EC]">
            {alreadyOnList ? "You're already on the list — you're all set." : "You're on the list!"}
          </p>
          <p className="text-sm text-[#a8a29e]">We&apos;ll be in touch soon.</p>
        </div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setConfigError("");
    setAlreadyOnList(false);
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setConfigError("Sign-up is not configured yet. Please try again later.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: insertError } = await supabase.from("waitlist").insert({
        email: trimmed.toLowerCase(),
        sport_interest: null,
        source: "companion_waitlist",
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
      });

      if (insertError) {
        if (insertError.code === "23505" || insertError.message?.includes("duplicate")) {
          setAlreadyOnList(true);
          onJoined();
          return;
        }
        setError(insertError.message || "Something went wrong. Please try again.");
        return;
      }
      onJoined();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const buttonLabel =
    variant === "offer"
      ? "Join The Waitlist — $29 At Launch"
      : "Join The Waitlist";

  return (
    <form onSubmit={submit} className={`w-full max-w-xl ${className}`} noValidate>
      <div
        className={
          variant === "offer"
            ? "flex flex-col gap-3"
            : "flex flex-col gap-3 md:flex-row md:items-stretch"
        }
      >
        <label className="sr-only" htmlFor={`waitlist-email-${variant}`}>
          Email
        </label>
        <input
          id={`waitlist-email-${variant}`}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          className="min-h-[52px] flex-1 rounded-lg border border-white/15 bg-white/5 px-4 text-[#FDF6EC] placeholder:text-white/35 outline-none ring-[#C8922A] focus:border-[#C8922A] focus:ring-2"
        />
        <button
          type="submit"
          disabled={submitting}
          className={`min-h-[52px] rounded-lg bg-[#C8922A] px-8 font-bold text-[#1A1209] transition hover:bg-[#d9a545] disabled:opacity-60 ${
            variant === "offer" ? "w-full shrink-0 md:px-6" : "shrink-0"
          }`}
        >
          {submitting ? "Joining…" : buttonLabel}
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
      {configError ? (
        <p className="mt-2 text-sm text-amber-200" role="alert">
          {configError}
        </p>
      ) : null}
      {variant === "offer" ? (
        <p className="mt-4 text-center text-sm text-[#6b5c4d]">
          No charge today. We&apos;ll email you when we launch with your spot reserved.
        </p>
      ) : null}
    </form>
  );
}
