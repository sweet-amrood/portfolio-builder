import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const brandName = 'PortfolioForge';
const brandColor = '#6366f1';

const getFromAddress = () => `"${brandName}" <${process.env.SMTP_USER}>`;

export const verifyEmailTransport = async () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP not configured — email features will not work');
    return false;
  }
  try {
    await transporter.verify();
    console.log('SMTP ready');
    return true;
  } catch (err) {
    console.error('SMTP connection failed:', err.message);
    return false;
  }
};

const baseTemplate = (title, body) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">
          <tr>
            <td style="background:linear-gradient(135deg,${brandColor},#8b5cf6);padding:32px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;">${brandName}</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Build stunning portfolios in minutes</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 32px;">
              <h2 style="margin:0 0 16px;color:#f1f5f9;font-size:22px;">${title}</h2>
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;border-top:1px solid #334155;text-align:center;">
              <p style="margin:0;color:#64748b;font-size:12px;">&copy; ${new Date().getFullYear()} ${brandName}. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const sendAccountCreatedEmail = async (email, name) => {
  const dashboardUrl = `${process.env.CLIENT_URL}/home`;

  const html = baseTemplate(
    `Your account is ready, ${name || 'Creator'}!`,
    `
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Welcome to ${brandName}! Your account has been successfully created. You're all set to build a professional portfolio that showcases your skills, projects, and experience.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
        <tr>
          <td style="padding:16px;background:#141c2e;border-radius:8px;border:1px solid #334155;">
            <p style="margin:0 0 12px;color:#f1f5f9;font-size:14px;font-weight:600;">What you can do next:</p>
            <p style="margin:0 0 8px;color:#94a3b8;font-size:14px;line-height:1.5;">🎨 &nbsp;Choose from beautiful portfolio templates</p>
            <p style="margin:0 0 8px;color:#94a3b8;font-size:14px;line-height:1.5;">⚡ &nbsp;Customize your layout with drag-and-drop tools</p>
            <p style="margin:0 0 8px;color:#94a3b8;font-size:14px;line-height:1.5;">📱 &nbsp;Publish a mobile-ready site in minutes</p>
            <p style="margin:0;color:#94a3b8;font-size:14px;line-height:1.5;">🚀 &nbsp;Share your unique portfolio link with the world</p>
          </td>
        </tr>
      </table>
      <a href="${dashboardUrl}" style="display:inline-block;background:${brandColor};color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;">
        Go to Your Dashboard
      </a>
      <p style="color:#64748b;font-size:13px;line-height:1.6;margin:24px 0 0;">
        If you didn't create this account, please contact our support team immediately.
      </p>
    `
  );

  await transporter.sendMail({
    from: getFromAddress(),
    to: email,
    subject: `Welcome to ${brandName} — Your account has been created`,
    html,
  });
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const html = baseTemplate(
    'Reset your password',
    `
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px;">
        We received a request to reset your password. Click the button below to choose a new password.
      </p>
      <a href="${resetUrl}" style="display:inline-block;background:${brandColor};color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;">
        Reset Password
      </a>
      <p style="color:#64748b;font-size:13px;line-height:1.6;margin:24px 0 0;">
        This link expires in 1 hour. If you didn't request a password reset, please ignore this email.
      </p>
    `
  );

  await transporter.sendMail({
    from: getFromAddress(),
    to: email,
    subject: `Reset your ${brandName} password`,
    html,
  });
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const sendContactEmails = async ({ name, email, subject, message, companyEmail }) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  const companyHtml = baseTemplate(
    'New contact message',
    `
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 20px;">
        A user submitted the contact form on ${brandName}.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
        <tr>
          <td style="padding:16px;background:#141c2e;border-radius:8px;border:1px solid #334155;">
            <p style="margin:0 0 10px;color:#f1f5f9;font-size:14px;"><strong>Name:</strong> ${safeName}</p>
            <p style="margin:0 0 10px;color:#f1f5f9;font-size:14px;"><strong>Email:</strong> ${safeEmail}</p>
            <p style="margin:0 0 10px;color:#f1f5f9;font-size:14px;"><strong>Subject:</strong> ${safeSubject}</p>
            <p style="margin:0;color:#94a3b8;font-size:14px;line-height:1.6;"><strong>Message:</strong><br>${safeMessage}</p>
          </td>
        </tr>
      </table>
      <p style="color:#64748b;font-size:13px;line-height:1.6;margin:16px 0 0;">
        Reply directly to ${safeEmail} to respond to this inquiry.
      </p>
    `
  );

  const userHtml = baseTemplate(
    'We received your message',
    `
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Hi ${safeName}, thank you for contacting ${brandName}. This email confirms that we received your message and our team will get back to you as soon as possible.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:16px;background:#141c2e;border-radius:8px;border:1px solid #334155;">
            <p style="margin:0 0 10px;color:#f1f5f9;font-size:14px;"><strong>Subject:</strong> ${safeSubject}</p>
            <p style="margin:0;color:#94a3b8;font-size:14px;line-height:1.6;"><strong>Your message:</strong><br>${safeMessage}</p>
          </td>
        </tr>
      </table>
      <p style="color:#64748b;font-size:13px;line-height:1.6;margin:24px 0 0;">
        If you did not send this request, you can safely ignore this email.
      </p>
    `
  );

  await transporter.sendMail({
    from: getFromAddress(),
    to: companyEmail,
    replyTo: email,
    subject: `[${brandName} Contact] ${subject}`,
    html: companyHtml,
  });

  await transporter.sendMail({
    from: getFromAddress(),
    to: email,
    subject: `We received your message — ${brandName}`,
    html: userHtml,
  });
};
