"use client";

import { useState, FormEvent } from "react";
import ConfirmationPage from "./ConfirmationPage";
import { sendVerificationCode, signInWithOAuth } from "../lib/auth";

export default function AuthPage() {
  const [stage, setStage] = useState<"email" | "confirmation">("email");
  const [email, setEmail] = useState("");
  const [isLoadingCaptcha, setIsLoadingCaptcha] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [error, setError] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);

  async function handleEmailContinue(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // If captcha not shown yet, show loading then captcha
    if (!showCaptcha) {
      setIsLoadingCaptcha(true);

      // Simulate loading delay, then show captcha
      setTimeout(() => {
        setIsLoadingCaptcha(false);
        setShowCaptcha(true);
      }, 1500); // 1.5 second loading
      return;
    }

    // If captcha shown but not verified, do nothing
    if (showCaptcha && !isCaptchaVerified) {
      return;
    }

    // If captcha verified, send verification code
    if (isCaptchaVerified) {
      setIsSendingCode(true);
      setError("");

      const result = await sendVerificationCode(email);

      if (result.success) {
        console.log("Verification code sent! Code:", result.code); // For demo/testing
        setStage("confirmation");
      } else {
        setError(result.error || "Failed to send verification code");
      }

      setIsSendingCode(false);
    }
  }

  function handleCaptchaCheck() {
    setIsCaptchaVerified(true);
  }

  async function handleOAuthLogin(provider: "google" | "apple") {
    setError("");
    const result = await signInWithOAuth(provider);

    if (!result.success) {
      setError(result.error || `Failed to sign in with ${provider}`);
    }
    // If successful, user will be redirected to OAuth provider
  }

  // If on confirmation stage, show confirmation page
  if (stage === "confirmation") {
    return <ConfirmationPage email={email} />;
  }

  // Otherwise show email page
  return (
    <div className="min-h-screen w-full bg-white text-gray-900 py-12 px-4 flex flex-col items-center">
      {/* LOGO */}
      <div className="flex flex-row items-center gap-2 text-xl font-bold -mt-4">
        <img src="/stack.png" alt="logo" className="w-36 h-26" />
      </div>

      {/* HEADING */}
      <h1 className="text-5xl font-bold leading-tight mb-3">
        First, enter your email
      </h1>

      {/* SUBTEXT */}
      <p className="text-gray-600 mb-8 text-base max-w-[480px]">
        We suggest using the <b>email address you use at work.</b>
      </p>

      {/* FORM CARD AREA */}
      <div className="w-full flex flex-col items-center max-w-[400px]">
        {stage === "email" && (
          <form
            onSubmit={handleEmailContinue}
            className="flex flex-col mb-6 w-full"
          >
            <input
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-4 focus:ring-blue-200 focus:ring-offset-0 focus:border-gray-300 mb-4"
              placeholder="name@work-email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSendingCode}
            />

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 py-2 rounded mb-4">
                {error}
              </div>
            )}

            {/* Loading Spinner */}
            {isLoadingCaptcha && (
              <div className="flex justify-center items-center mb-4 py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#592F63]"></div>
              </div>
            )}

            {/* reCAPTCHA Checkbox */}
            {showCaptcha && (
              <div className="mb-4 p-4 border-2 border-gray-300 rounded-lg bg-gray-50">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCaptchaVerified}
                    onChange={handleCaptchaCheck}
                    className="w-6 h-6 cursor-pointer"
                  />
                  <span className="text-base font-medium">
                    I&apos;m not a robot
                  </span>
                  <div className="ml-auto flex flex-col items-center">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                        fill="#1a73e8"
                      />
                    </svg>
                    <span className="text-xs text-gray-500">reCAPTCHA</span>
                  </div>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={(showCaptcha && !isCaptchaVerified) || isSendingCode}
              className={`w-full text-white text-lg font-semibold rounded-xl py-3 transition ${
                (showCaptcha && !isCaptchaVerified) || isSendingCode
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#592F63] hover:bg-[#6A3975]"
              }`}
            >
              {isSendingCode ? "Sending code..." : "Continue"}
            </button>
          </form>
        )}
      </div>

      <div className="flex items-center w-96 max-w-[400px] my-6 -mt-1">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="mx-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
          Other Options
        </span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* OAUTH BUTTONS */}
      <div className="flex flex-row gap-3 mb-6 w-[350px]">
        <button
          onClick={() => handleOAuthLogin("google")}
          className="flex-1 flex border-2 items-center justify-center gap-2 border-gray-300 rounded-lg py-1 text-sm font-medium hover:bg-gray-50 transition"
          type="button"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-lg">Google</span>
        </button>

        <button
          onClick={() => handleOAuthLogin("apple")}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 rounded-lg py-1 text-sm font-medium hover:bg-gray-50 transition"
          type="button"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          <span className="text-lg">Apple</span>
        </button>
      </div>

      {/* LEGAL / COPY */}
      <p className="text-xs text-gray-500 leading-relaxed max-w-[400px]">
        By entering your email and continuing, you will either create a new
        workspace or be directed to any existing workspaces or invitations
        associated with your email.
      </p>
      <p className="text-xs text-gray-500 leading-relaxed mt-2 max-w-[400px]">
        By creating a workspace, you&apos;re agreeing to our Main Services
        Agreement, User Terms of Service, and Slack Supplemental Terms.
        Additional disclosures are available in our Privacy Policy and Cookie
        Policy.
      </p>

      {/* ALREADY USING SLACK */}
      <div className="text-sm text-gray-600 mt-10">
        <p className="mb-1">Already using Stack?</p>
        <button className="text-blue-600 hover:underline font-medium">
          Sign in to an existing workspace
        </button>
      </div>

      {/* FOOTER */}
      <div className="flex flex-row items-center gap-4 text-xs text-gray-500 mt-12 mb-8">
        <button className="hover:underline">Privacy &amp; Terms</button>
        <button className="hover:underline">Contact Us</button>
        <button className="hover:underline flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Change region
        </button>
      </div>
    </div>
  );
}
