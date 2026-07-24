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

export async function sendVerificationCodeEmail(
  email: string,
  code: string
): Promise<SendEmailResult> {
  return sendViaResend({
    to: email,
    subject: "Verify your Algo Rich email",
    text: `Your Algo Rich verification code is ${code}. It expires in 1 hour. If you did not create an account, you can ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2>Verify your email</h2>
        <p>Enter this code to finish creating your Algo Rich account:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px;">${code}</p>
        <p style="font-size: 14px; color: #4B5563;">This code expires in 1 hour.</p>
      </div>
    `,
  });
}

export async function sendStreakReminderEmail(
  email: string,
  name: string,
  streakCount: number
): Promise<SendEmailResult> {
  const appUrl = getAppBaseUrl();
  const practiceUrl = `${appUrl}/dashboard`;
  const streakText = streakCount > 0 ? `${streakCount}-day streak` : "learning momentum";

  const input: SendEmailInput = {
    to: email,
    subject: `🔥 Don't lose your ${streakText} on Algo Rich!`,
    text: [
      `Hi ${name || "there"},`,
      `Don't break your ${streakText}! Spend 5 minutes today to complete a session or solve a practice problem.`,
      `Practice now: ${practiceUrl}`,
      "Keep building your DSA skills step by step!",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;">
        <h2 style="color: #D97706; margin-bottom: 12px;">🔥 Keep Your Streak Alive!</h2>
        <p style="font-size: 16px;">Hi <strong>${name || "there"}</strong>,</p>
        <p style="font-size: 15px;">You're doing great! Don't let your <strong>${streakText}</strong> slip away today.</p>
        <p style="font-size: 15px;">It only takes 5 minutes to complete a quick session and keep your momentum going.</p>
        <div style="margin: 24px 0; text-align: center;">
          <a href="${practiceUrl}" style="display: inline-block; padding: 12px 24px; background: #F59E0B; color: #FFFFFF; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
            Continue Learning
          </a>
        </div>
        <p style="font-size: 13px; color: #6B7280; text-align: center;">Small daily consistency leads to big interview wins.</p>
      </div>
    `,
  };

  return sendViaResend(input);
}
