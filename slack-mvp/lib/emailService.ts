import sgMail from "@sendgrid/mail";

// Initialize SendGrid client
function initializeSendGrid(): boolean {
  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey || apiKey === "your_sendgrid_api_key_here") {
    console.log("[EMAIL] No SendGrid API key configured. Skipping email.");
    return false;
  }

  sgMail.setApiKey(apiKey);
  return true;
}

export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<boolean> {
  try {
    if (!initializeSendGrid()) {
      return false;
    }

    // Use your own email as the sender (SendGrid free tier allows this)
    // You can use any email address you own, or use the default from SendGrid
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || "samuelpark316@gmail.com";
    const fromName = process.env.SENDGRID_FROM_NAME || "Stack";

    const msg = {
      to: email,
      from: {
        email: fromEmail,
        name: fromName,
      },
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4A154B;">Your Verification Code</h1>
          <p>Enter this code to sign in to Stack:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #666;">This code will expire in 10 minutes.</p>
          <p style="color: #666;">If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `,
    };

    const response = await sgMail.send(msg);

    if (response[0]?.statusCode === 202) {
      console.log(`[EMAIL SUCCESS] Email sent to ${email}. Status: ${response[0].statusCode}`);
      console.log(`[EMAIL SUCCESS] Response headers:`, JSON.stringify(response[0].headers, null, 2));
      return true;
    } else {
      console.error(`[EMAIL ERROR] Unexpected response status:`, response[0]?.statusCode);
      return false;
    }
  } catch (error: any) {
    console.error(`[EMAIL ERROR] Failed to send email to ${email}:`, error);
    
    if (error.response) {
      console.error(`[EMAIL ERROR] SendGrid API Error:`, {
        statusCode: error.response.statusCode,
        body: error.response.body,
        headers: error.response.headers,
      });
    } else if (error instanceof Error) {
      console.error(`[EMAIL ERROR] Error message:`, error.message);
      console.error(`[EMAIL ERROR] Error stack:`, error.stack);
    }
    
    return false;
  }
}
