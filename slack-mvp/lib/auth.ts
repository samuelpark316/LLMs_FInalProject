import { supabase } from "./supabaseClient";

/**
 * Generate a random 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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
 * Send verification email via API route
 */
async function sendVerificationEmailViaAPI(
  email: string,
  code: string
): Promise<boolean> {
  try {
    const response = await fetch("/api/send-verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error("Error calling send-verification API:", error);
    return false;
  }
}

/**
 * Send verification code (in production, this would trigger an email)
 * For demo purposes, we'll just store it in the database
 */
export async function sendVerificationCode(
  email: string
): Promise<{ success: boolean; code?: string; error?: string }> {
  try {
    // Generate a 6-digit code
    const code = generateVerificationCode();

    // Set expiration time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Check if user exists, if not create them
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (!existingUser) {
      // Create new user
      const { error: userError } = await supabase
        .from("users")
        .insert([{ email }]);

      if (userError) {
        console.error("Error creating user:", userError);
        return { success: false, error: "Failed to create user" };
      }
    }

    // Store verification code in database
    const { error } = await supabase.from("verification_codes").insert([
      {
        email,
        code,
        expires_at: expiresAt.toISOString(),
        verified: false,
      },
    ]);

    if (error) {
      console.error("Error storing verification code:", error);
      return { success: false, error: "Failed to send verification code" };
    }

    // Send email with verification code via API route
    const emailSent = await sendVerificationEmailViaAPI(email, code);

    if (!emailSent) {
      console.warn(
        "Failed to send email, but code is stored. Logging to console for demo:"
      );
      console.log(`Verification code for ${email}: ${code}`);
      // Still return success since code is stored in database
    }

    return { success: true, code: emailSent ? undefined : code }; // Only return code if email failed (for demo)
  } catch (error) {
    console.error("Error in sendVerificationCode:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Verify the 6-digit code
 */
export async function verifyCode(
  email: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Find the most recent non-verified code for this email
    const { data: verificationCode, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("verified", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !verificationCode) {
      return { success: false, error: "Invalid or expired code" };
    }

    // Mark code as verified
    const { error: updateError } = await supabase
      .from("verification_codes")
      .update({
        verified: true,
        verified_at: new Date().toISOString(),
      })
      .eq("id", verificationCode.id);

    if (updateError) {
      console.error("Error updating verification code:", updateError);
      return { success: false, error: "Failed to verify code" };
    }

    // Update user's last login
    const { error: userUpdateError } = await supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("email", email);

    if (userUpdateError) {
      console.error("Error updating user login time:", userUpdateError);
    }

    return { success: true };
  } catch (error) {
    console.error("Error in verifyCode:", error);
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
