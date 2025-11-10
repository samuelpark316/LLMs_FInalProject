import { NextRequest, NextResponse } from "next/server";
import { sendVerificationEmail } from "../../../lib/emailService";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: "Email and code are required" },
        { status: 400 }
      );
    }

    const emailSent = await sendVerificationEmail(email, code);

    return NextResponse.json({ success: emailSent });
  } catch (error) {
    console.error("Error in send-verification API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
