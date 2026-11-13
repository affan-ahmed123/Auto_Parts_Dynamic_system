import nodemailer from "nodemailer";
import { config } from "../config/env";

interface SendVerificationEmailOptions {
  to: string;
  name: string;
  code: string;
}

export const sendVerificationEmail = async ({
  to,
  name,
  code,
}: SendVerificationEmailOptions): Promise<{ delivered: boolean }> => {
  const subject = "Verify your AutoParts Store account";
  const textContent = `Hi ${name},\n\nThanks for creating an account with AutoParts Store.\n\nYour 6-digit verification code is: ${code}\n\nThis code will expire in 15 minutes. After verifying your email, you can sign in using your email and password.\n\nNeed help? Reply to affan.codes01@gmail.com.\n\nBest regards,\nAutoParts Store Team`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #0f172a;">
      <h2 style="margin-top: 0; color: #0f172a; font-size: 20px;">Verify your account</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #475569;">
        Hi ${name},<br /><br />
        Thanks for signing up at <strong>AutoParts Store</strong>. Please enter the verification code below to activate your account:
      </p>
      <div style="margin: 24px 0; padding: 16px; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; text-align: center;">
        <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #1e293b;">${code}</span>
      </div>
      <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
        This code expires in 15 minutes. Once verified, you can sign in with your email and password.
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #94a3b8; margin-bottom: 0;">
        Sent by AutoParts Store &bull; Support: <a href="mailto:affan.codes01@gmail.com" style="color: #2563eb;">affan.codes01@gmail.com</a>
      </p>
    </div>
  `;

  if (!config.smtp.pass) {
    console.log("===============================================");
    console.log(`[SMTP Dev Mode] SMTP_PASS is not set in server/.env`);
    console.log(`To: ${to}`);
    console.log(`Verification Code: ${code}`);
    console.log("===============================================");
    return { delivered: false };
  }

  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });

  await transporter.sendMail({
    from: config.smtp.from,
    to,
    replyTo: "affan.codes01@gmail.com",
    subject,
    text: textContent,
    html: htmlContent,
  });

  return { delivered: true };
};

