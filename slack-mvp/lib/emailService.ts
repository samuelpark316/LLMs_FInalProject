import { Resend } from "resend";

let resend: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === "re_your_api_key_here") {
    return null;
  }

  if (!resend) {
    resend = new Resend(apiKey);
  }

  return resend;
}

export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<boolean> {
  try {
    const client = getResendClient();

    if (!client) {
      console.log("No Resend API key configured. Skipping email.");
      return false;
    }

    const { data, error } = await client.emails.send({
      from: "Stack <onboarding@resend.dev>", // Replace with your verified domain
      to: [email],
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4A154B;">Your Verification Code</h1>
          <p>Enter this code to sign in to Slack:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #666;">This code will expire in 10 minutes.</p>
          <p style="color: #666;">If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      return false;
    }

    console.log("Email sent successfully:", data);
    return true;
  } catch (error) {
    console.error("Error in sendVerificationEmail:", error);
    return false;
  }
}
