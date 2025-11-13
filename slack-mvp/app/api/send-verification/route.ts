import { NextRequest, NextResponse } from "next/server";
import { sendVerificationEmail } from "../../../lib/emailService";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    console.log(`[API] Received request to send verification code to: ${email}`);

    if (!email || !code) {
      console.error(`[API] Missing email or code. Email: ${email}, Code: ${code ? '***' : 'missing'}`);
      return NextResponse.json(
        { success: false, error: "Email and code are required" },
        { status: 400 }
      );
    }

    const emailSent = await sendVerificationEmail(email, code);
    
    console.log(`[API] Email send result for ${email}: ${emailSent ? 'SUCCESS' : 'FAILED'}`);

    return NextResponse.json({ success: emailSent });
  } catch (error) {
    console.error("[API] Error in send-verification API:", error);
    if (error instanceof Error) {
      console.error("[API] Error details:", error.message, error.stack);
    }
    return NextResponse.json(
      { success: false, error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
