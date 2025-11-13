import { supabase } from "./supabaseClient";

/**
 * Sign in with OAuth provider (Google, Apple, etc.)
 */
export async function signInWithOAuth(provider: "google" | "apple") {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(`Error signing in with ${provider}:`, error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error(`Error in signInWithOAuth:`, error);
    return { success: false, error: "OAuth sign in failed" };
  }
}

/**
 * Send verification code using Supabase Auth OTP
 * This uses Supabase's built-in email service
 * IMPORTANT: Make sure your Supabase email template uses {{ .Token }} instead of {{ .ConfirmationURL }}
 */
export async function sendVerificationCode(
  email: string
): Promise<{ success: boolean; code?: string; error?: string }> {
  try {
    // Use Supabase Auth's signInWithOtp to send a 6-digit code via email
    // This will use the "Magic Link" email template, but we'll configure it to show the code
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // This will send a 6-digit code to the email (not a magic link)
        shouldCreateUser: true, // Automatically create user if they don't exist
        // Note: The email template in Supabase dashboard must be configured to show {{ .Token }}
        // instead of {{ .ConfirmationURL }} to display the code instead of a link
      },
    });

    if (error) {
      console.error("[AUTH] Error sending OTP:", error);
      return { success: false, error: error.message || "Failed to send verification code" };
    }

    console.log("[AUTH] OTP sent successfully to:", email);
    console.log("[AUTH] Note: Make sure Supabase email template shows {{ .Token }} (code) not {{ .ConfirmationURL }} (link)");
    return { success: true };
  } catch (error) {
    console.error("[AUTH] Exception in sendVerificationCode:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Verify the 6-digit code using Supabase Auth
 */
export async function verifyCode(
  email: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify the OTP code with Supabase Auth
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (error) {
      console.error("[AUTH] Error verifying OTP:", error);
      return { success: false, error: error.message || "Invalid or expired code" };
    }

    if (data?.session) {
      console.log("[AUTH] Code verified successfully. Session created.");
      
      // Sync user to custom users table if needed
      const { error: syncError } = await supabase
        .from("users")
        .upsert(
          {
            email: data.user.email,
            last_login: new Date().toISOString(),
          },
          {
            onConflict: "email",
          }
        );

      if (syncError) {
        console.warn("[AUTH] Warning: Could not sync user to custom table:", syncError);
        // Don't fail the login if sync fails
      }

      return { success: true };
    }

    return { success: false, error: "Verification failed" };
  } catch (error) {
    console.error("[AUTH] Exception in verifyCode:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getUserByEmail:", error);
    return null;
  }
}
