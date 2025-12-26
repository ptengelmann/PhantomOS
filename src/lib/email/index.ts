import { Resend } from 'resend';

// Initialize Resend client
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Email configuration
const FROM_EMAIL = process.env.EMAIL_FROM || 'PhantomOS <noreply@phantom-os.com>';
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'PhantomOS';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://phantom-os.vercel.app';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using Resend
 * Returns success status and error message if any
 */
export async function sendEmail(
  options: SendEmailOptions
): Promise<{ success: boolean; error?: string; id?: string }> {
  if (!resend) {
    console.warn('Email not configured: RESEND_API_KEY is not set');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Email send exception:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Email template: Waitlist approval invite
 */
export function getWaitlistApprovalEmail(params: {
  recipientName?: string;
  companyName?: string;
  inviteLink: string;
}): { subject: string; html: string; text: string } {
  const { recipientName, companyName, inviteLink } = params;
  const greeting = recipientName ? `Hi ${recipientName}` : 'Hi there';

  const subject = `You're in! Welcome to ${APP_NAME}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0a0a0a; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
  <div style="border-bottom: 1px solid #e5e5e5; padding-bottom: 20px; margin-bottom: 30px;">
    <h1 style="font-size: 24px; font-weight: 600; margin: 0;">${APP_NAME}</h1>
  </div>

  <p style="font-size: 16px; margin-bottom: 20px;">${greeting},</p>

  <p style="font-size: 16px; margin-bottom: 20px;">
    Great news! Your application${companyName ? ` for <strong>${companyName}</strong>` : ''} has been approved for the ${APP_NAME} pilot program.
  </p>

  <p style="font-size: 16px; margin-bottom: 30px;">
    Click the button below to create your account and start exploring merchandise intelligence for your gaming IPs.
  </p>

  <div style="text-align: center; margin: 40px 0;">
    <a href="${inviteLink}" style="display: inline-block; background-color: #0a0a0a; color: #ffffff; text-decoration: none; padding: 14px 32px; font-size: 16px; font-weight: 500;">
      Create Your Account
    </a>
  </div>

  <p style="font-size: 14px; color: #737373; margin-bottom: 10px;">
    Or copy and paste this link into your browser:
  </p>
  <p style="font-size: 14px; color: #737373; word-break: break-all; background: #f5f5f5; padding: 12px; border: 1px solid #e5e5e5;">
    ${inviteLink}
  </p>

  <p style="font-size: 14px; color: #737373; margin-top: 30px;">
    This invite link will expire in 7 days. If you have any questions, just reply to this email.
  </p>

  <div style="border-top: 1px solid #e5e5e5; margin-top: 40px; padding-top: 20px;">
    <p style="font-size: 12px; color: #a3a3a3; margin: 0;">
      ${APP_NAME} - Merchandise Intelligence for Gaming Publishers
    </p>
  </div>
</body>
</html>
`;

  const text = `
${greeting},

Great news! Your application${companyName ? ` for ${companyName}` : ''} has been approved for the ${APP_NAME} pilot program.

Click the link below to create your account and start exploring merchandise intelligence for your gaming IPs:

${inviteLink}

This invite link will expire in 7 days. If you have any questions, just reply to this email.

---
${APP_NAME} - Merchandise Intelligence for Gaming Publishers
`;

  return { subject, html, text };
}

/**
 * Email template: Team invitation
 */
export function getTeamInviteEmail(params: {
  recipientName?: string;
  inviterName: string;
  publisherName: string;
  role: string;
  inviteLink: string;
}): { subject: string; html: string; text: string } {
  const { recipientName, inviterName, publisherName, role, inviteLink } = params;
  const greeting = recipientName ? `Hi ${recipientName}` : 'Hi there';

  const subject = `You've been invited to join ${publisherName} on ${APP_NAME}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0a0a0a; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
  <div style="border-bottom: 1px solid #e5e5e5; padding-bottom: 20px; margin-bottom: 30px;">
    <h1 style="font-size: 24px; font-weight: 600; margin: 0;">${APP_NAME}</h1>
  </div>

  <p style="font-size: 16px; margin-bottom: 20px;">${greeting},</p>

  <p style="font-size: 16px; margin-bottom: 20px;">
    <strong>${inviterName}</strong> has invited you to join <strong>${publisherName}</strong> on ${APP_NAME} as a <strong>${role}</strong>.
  </p>

  <p style="font-size: 16px; margin-bottom: 30px;">
    Click the button below to accept the invitation and create your account.
  </p>

  <div style="text-align: center; margin: 40px 0;">
    <a href="${inviteLink}" style="display: inline-block; background-color: #0a0a0a; color: #ffffff; text-decoration: none; padding: 14px 32px; font-size: 16px; font-weight: 500;">
      Accept Invitation
    </a>
  </div>

  <p style="font-size: 14px; color: #737373; margin-bottom: 10px;">
    Or copy and paste this link into your browser:
  </p>
  <p style="font-size: 14px; color: #737373; word-break: break-all; background: #f5f5f5; padding: 12px; border: 1px solid #e5e5e5;">
    ${inviteLink}
  </p>

  <p style="font-size: 14px; color: #737373; margin-top: 30px;">
    This invite link will expire in 7 days.
  </p>

  <div style="border-top: 1px solid #e5e5e5; margin-top: 40px; padding-top: 20px;">
    <p style="font-size: 12px; color: #a3a3a3; margin: 0;">
      ${APP_NAME} - Merchandise Intelligence for Gaming Publishers
    </p>
  </div>
</body>
</html>
`;

  const text = `
${greeting},

${inviterName} has invited you to join ${publisherName} on ${APP_NAME} as a ${role}.

Click the link below to accept the invitation and create your account:

${inviteLink}

This invite link will expire in 7 days.

---
${APP_NAME} - Merchandise Intelligence for Gaming Publishers
`;

  return { subject, html, text };
}

/**
 * Email template: New waitlist submission notification (for admins)
 */
export function getWaitlistNotificationEmail(params: {
  applicantEmail: string;
  companyName?: string;
  revenueRange?: string;
  primaryChannel?: string;
  adminUrl: string;
}): { subject: string; html: string; text: string } {
  const { applicantEmail, companyName, revenueRange, primaryChannel, adminUrl } = params;

  const subject = `New ${APP_NAME} Pilot Application${companyName ? `: ${companyName}` : ''}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0a0a0a; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
  <div style="border-bottom: 1px solid #e5e5e5; padding-bottom: 20px; margin-bottom: 30px;">
    <h1 style="font-size: 24px; font-weight: 600; margin: 0;">${APP_NAME} Admin</h1>
  </div>

  <p style="font-size: 16px; margin-bottom: 20px;">
    A new pilot program application has been submitted.
  </p>

  <div style="background: #f5f5f5; border: 1px solid #e5e5e5; padding: 20px; margin-bottom: 30px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #737373; font-size: 14px;">Email</td>
        <td style="padding: 8px 0; font-weight: 500;">${applicantEmail}</td>
      </tr>
      ${companyName ? `
      <tr>
        <td style="padding: 8px 0; color: #737373; font-size: 14px;">Company</td>
        <td style="padding: 8px 0; font-weight: 500;">${companyName}</td>
      </tr>
      ` : ''}
      ${revenueRange ? `
      <tr>
        <td style="padding: 8px 0; color: #737373; font-size: 14px;">Revenue</td>
        <td style="padding: 8px 0;">${revenueRange}</td>
      </tr>
      ` : ''}
      ${primaryChannel ? `
      <tr>
        <td style="padding: 8px 0; color: #737373; font-size: 14px;">Channel</td>
        <td style="padding: 8px 0;">${primaryChannel}</td>
      </tr>
      ` : ''}
    </table>
  </div>

  <div style="text-align: center; margin: 40px 0;">
    <a href="${adminUrl}" style="display: inline-block; background-color: #0a0a0a; color: #ffffff; text-decoration: none; padding: 14px 32px; font-size: 16px; font-weight: 500;">
      Review Application
    </a>
  </div>

  <div style="border-top: 1px solid #e5e5e5; margin-top: 40px; padding-top: 20px;">
    <p style="font-size: 12px; color: #a3a3a3; margin: 0;">
      ${APP_NAME} Admin Notification
    </p>
  </div>
</body>
</html>
`;

  const text = `
New ${APP_NAME} Pilot Application

Email: ${applicantEmail}
${companyName ? `Company: ${companyName}` : ''}
${revenueRange ? `Revenue: ${revenueRange}` : ''}
${primaryChannel ? `Channel: ${primaryChannel}` : ''}

Review at: ${adminUrl}

---
${APP_NAME} Admin Notification
`;

  return { subject, html, text };
}

/**
 * Send waitlist approval email
 */
export async function sendWaitlistApprovalEmail(params: {
  to: string;
  recipientName?: string;
  companyName?: string;
  inviteToken: string;
}): Promise<{ success: boolean; error?: string }> {
  const inviteLink = `${APP_URL}/register/${params.inviteToken}`;
  const email = getWaitlistApprovalEmail({
    recipientName: params.recipientName,
    companyName: params.companyName,
    inviteLink,
  });

  return sendEmail({
    to: params.to,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });
}

/**
 * Send team invitation email
 */
export async function sendTeamInviteEmail(params: {
  to: string;
  recipientName?: string;
  inviterName: string;
  publisherName: string;
  role: string;
  inviteToken: string;
}): Promise<{ success: boolean; error?: string }> {
  const inviteLink = `${APP_URL}/invite?token=${params.inviteToken}`;
  const email = getTeamInviteEmail({
    recipientName: params.recipientName,
    inviterName: params.inviterName,
    publisherName: params.publisherName,
    role: params.role,
    inviteLink,
  });

  return sendEmail({
    to: params.to,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });
}

/**
 * Send admin notification for new waitlist submission
 */
export async function sendWaitlistNotificationToAdmin(params: {
  applicantEmail: string;
  companyName?: string;
  revenueRange?: string;
  primaryChannel?: string;
}): Promise<{ success: boolean; error?: string }> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

  if (!adminEmail) {
    console.warn('ADMIN_NOTIFICATION_EMAIL not configured');
    return { success: false, error: 'Admin email not configured' };
  }

  const adminUrl = `${APP_URL}/admin`;
  const email = getWaitlistNotificationEmail({
    ...params,
    adminUrl,
  });

  return sendEmail({
    to: adminEmail,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });
}

/**
 * Check if email service is configured
 */
export function isEmailConfigured(): boolean {
  return !!resend;
}
