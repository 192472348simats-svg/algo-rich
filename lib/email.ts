interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
}

interface SendEmailResult {
  sent: boolean;
  provider: "resend" | "none";
  error?: string;
}

function getAppBaseUrl() {
  return (
    process.env.NEXTAUTH_URL ||
    process.env.AUTH_URL ||
    "http://localhost:3000"
  );
}

async function sendViaResend(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    return {
      sent: false,
      provider: "none",
      error: "Missing RESEND_API_KEY or EMAIL_FROM",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    return {
      sent: false,
      provider: "resend",
      error: `Resend error ${response.status}: ${body}`,
    };
  }

  return { sent: true, provider: "resend" };
}

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
): Promise<SendEmailResult> {
  const appUrl = getAppBaseUrl();
  const input: SendEmailInput = {
    to: email,
    subject: "Reset your Algo Rich password",
    text: [
      "We received a request to reset your password.",
      `Reset link: ${resetUrl}`,
      "This link expires in 1 hour.",
      `If you did not request this, you can ignore this email. (${appUrl})`,
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin-bottom: 8px;">Reset your password</h2>
        <p>We received a request to reset your Algo Rich password.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 16px; background: #E5A829; color: #0A1128; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Reset Password
          </a>
        </p>
        <p style="font-size: 14px; color: #4B5563;">This link expires in 1 hour.</p>
        <p style="font-size: 14px; color: #4B5563;">If you did not request this, you can ignore this email.</p>
      </div>
    `,
  };

  return sendViaResend(input);
}
