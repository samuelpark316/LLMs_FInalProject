"use client";

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { verifyCode } from "../lib/auth";

interface ConfirmationPageProps {
  email: string;
}

export default function ConfirmationPage({ email }: ConfirmationPageProps) {
  const { login } = useAuth();

  const [confirmationCode, setConfirmationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [error, setError] = useState("");
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  function handleDigitChange(index: number, value: string) {
    // Only allow numbers
    const digit = value.replace(/[^0-9]/g, "");

    if (digit.length > 1) return; // Only one digit per box

    const newCode = [...confirmationCode];
    newCode[index] = digit;
    setConfirmationCode(newCode);
    setError("");

    // Auto-focus next input
    if (digit && index < 5) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      nextInput?.focus();
    }

    // Check if all 6 digits are filled
    if (newCode.every((d) => d !== "") && newCode.join("").length === 6) {
      verifyCodeSubmit(newCode.join(""));
    }
  }

  function handleDigitKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    // Handle backspace
    if (e.key === "Backspace" && !confirmationCode[index] && index > 0) {
      const prevInput = document.getElementById(`digit-${index - 1}`);
      prevInput?.focus();
    }
  }

  async function verifyCodeSubmit(code: string) {
    setIsVerifyingCode(true);
    setError("");

    // Simulate verification delay for UX
    setTimeout(async () => {
      const result = await verifyCode(email, code);

      if (result.success) {
        // Code is correct, log in
        const loginResult = await login(email);
        if (!loginResult.ok) {
          setError(loginResult.error || "Login failed");
          setIsVerifyingCode(false);
        }
        // If login successful, user will be redirected automatically
      } else {
        setError(result.error || "Invalid code. Please try again.");
        setIsVerifyingCode(false);
        // Clear all inputs on error
        setConfirmationCode(["", "", "", "", "", ""]);
        const firstInput = document.getElementById("digit-0");
        firstInput?.focus();
      }
    }, 1500); // 1.5 second verification delay
  }

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 py-12 px-4 flex flex-col items-center">
      {/* LOGO */}
      <div className="flex flex-row items-center gap-2 text-xl font-bold -mt-4">
        <img src="/stack.png" alt="logo" className="w-36 h-26" />
      </div>

      <div className="w-full max-w-[550px]">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">We emailed you a code</h1>
          <p className="text-gray-600 text-base mb-2">
            We sent an email to <span className="font-semibold">{email}</span>.
            Enter the code here or tap the button in the email to continue.
          </p>
          <p className="text-gray-500 text-sm">
            If you don&apos;t see the email, check your spam or junk folder.
          </p>
        </div>

        <div className="flex flex-col items-center mb-6">
          {/* 6 Digit Input Boxes */}
          <div className="flex mb-4">
            {confirmationCode.slice(0, 3).map((digit, index) => (
              <input
                key={index}
                id={`digit-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleDigitKeyDown(index, e)}
                className="w-16 h-16 text-center text-2xl font-semibold border-2 border-gray-300 rounded-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                disabled={isVerifyingCode}
              />
            ))}
            <span className="flex items-center text-2xl text-gray-400 font-bold">
              –
            </span>
            {confirmationCode.slice(3, 6).map((digit, index) => (
              <input
                key={index + 3}
                id={`digit-${index + 3}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index + 3, e.target.value)}
                onKeyDown={(e) => handleDigitKeyDown(index + 3, e)}
                className="w-16 h-16 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                disabled={isVerifyingCode}
              />
            ))}
          </div>

          {/* Loading Spinner */}
          {isVerifyingCode && (
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#592F63]"></div>
              <p className="text-sm text-gray-600">Checking your code...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-4 rounded mb-4">
              {error}
            </div>
          )}

          {/* Demo hint */}
          <p className="text-xs text-gray-400 mb-6">
            Check your browser console for the verification code (or check your
            email in production)
          </p>
        </div>

        {/* Email Buttons */}
        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={() => window.open("https://mail.google.com", "_blank")}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition border border-gray-300"
          >
            {/* Gmail Logo */}
            <svg className="w-5 h-5" viewBox="0 0 256 193" fill="none">
              <path
                d="M58.182 192.05V93.14L27.507 65.077L0 49.504v132.091c0 5.736 4.656 10.392 10.392 10.392h47.79v.064Z"
                fill="#4285F4"
              />
              <path
                d="M197.818 192.05h47.79c5.736 0 10.392-4.656 10.392-10.392V49.567L227.493 65.14 197.818 93.14v98.91Z"
                fill="#34A853"
              />
              <path
                d="M197.818 17.504V93.14L256 49.567V26.759c0-16.494-18.867-25.89-32.107-15.946L197.818 17.504Z"
                fill="#FBBC04"
              />
              <path
                d="M58.182 93.14V17.504L128 69.46l69.818-51.956V93.14L128 145.097 58.182 93.14Z"
                fill="#EA4335"
              />
              <path
                d="M0 26.759V49.567l58.182 43.572V17.504L32.107 10.813C18.867.87 0 10.266 0 26.759Z"
                fill="#C5221F"
              />
            </svg>
            <span>Open Gmail</span>
          </button>
          <button
            onClick={() =>
              window.open("https://outlook.live.com/mail/", "_blank")
            }
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition border border-gray-300"
          >
            {/* Outlook Logo */}
            <svg className="w-5 h-5" viewBox="0 0 256 256" fill="none">
              <path
                d="M256 155.833v84.146c0 6.528-5.302 11.829-11.829 11.829H129.958v-107.5L256 155.833Z"
                fill="#0364B8"
              />
              <path
                d="M129.958 144.308v107.5H11.829C5.302 251.808 0 246.506 0 239.979V155.833l129.958-11.525Z"
                fill="#0078D4"
              />
              <path
                d="M129.958 36.5v107.808L256 155.833V48.329c0-6.527-5.302-11.829-11.829-11.829h-114.213Z"
                fill="#28A8EA"
              />
              <path
                d="M0 48.329v107.504l129.958 11.525V36.5H11.829C5.302 36.5 0 41.802 0 48.329Z"
                fill="#0078D4"
              />
              <path
                d="M193.641 100.192V36.5H129.958v107.808l63.683 11.525V100.192Z"
                fill="#0364B8"
              />
              <path
                d="M129.958 36.5v107.808L66.276 155.833V100.192L0 48.329V36.5h129.958Z"
                fill="#14447D"
              />
              <path
                d="M66.276 100.192v55.641l63.682-11.525V36.5H66.276v63.692Z"
                fill="#0078D4"
              />
            </svg>
            <span>Open Outlook</span>
          </button>
        </div>

        {/* Help Links */}
        <div className="text-center text-sm space-y-2">
          <p className="text-gray-600">
            Can&apos;t find your code?{" "}
            <button className="text-blue-600 hover:underline">
              Request a new code.
            </button>
          </p>
          <p className="text-gray-600">
            Having trouble?{" "}
            <button className="text-blue-600 hover:underline">
              Try entering a workspace URL
            </button>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-row items-center gap-4 text-xs text-gray-500 mt-16">
        <button className="hover:underline">Privacy &amp; Terms</button>
        <button className="hover:underline">Contact Us</button>
      </div>
    </div>
  );
}
