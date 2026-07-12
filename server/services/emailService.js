import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 */
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@assetflow.com',
      to,
      subject,
      html,
    };
    
    // In production, this would send an actual email. 
    // We are wrapping it in a try/catch so if SMTP is unconfigured it doesn't crash the server.
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error.message);
    return false;
  }
};

export const sendRegistrationEmail = async (email, name) => {
  const subject = 'Welcome to AssetFlow - Registration Received';
  const html = `<p>Hi ${name},</p><p>Your registration is received and is pending admin approval.</p>`;
  return sendEmail(email, subject, html);
};

export const sendApprovalEmail = async (email, name) => {
  const subject = 'AssetFlow - Account Approved';
  const html = `<p>Hi ${name},</p><p>Good news! Your account has been approved. You can now log in.</p>`;
  return sendEmail(email, subject, html);
};

export const sendRejectionEmail = async (email, name) => {
  const subject = 'AssetFlow - Account Update';
  const html = `<p>Hi ${name},</p><p>We regret to inform you that your account registration was rejected by an administrator.</p>`;
  return sendEmail(email, subject, html);
};

export const sendRolePromotionEmail = async (email, name, newRole) => {
  const subject = 'AssetFlow - Role Updated';
  const html = `<p>Hi ${name},</p><p>Your role has been updated to: <b>${newRole}</b>.</p>`;
  return sendEmail(email, subject, html);
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  const subject = 'AssetFlow - Password Reset Request';
  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
  const html = `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`;
  return sendEmail(email, subject, html);
};

export const sendOtpEmail = async (email, name, otp) => {
  const subject = 'AssetFlow - Password Reset OTP';
  const html = `<p>Hi ${name},</p><p>Your password reset verification code is: <strong>${otp}</strong>.</p><p>This code expires in 10 minutes.</p>`;
  return sendEmail(email, subject, html);
};

export const sendPasswordResetSuccessEmail = async (email, name) => {
  const subject = 'AssetFlow - Password Reset Successful';
  const html = `<p>Hi ${name},</p><p>Your password has been successfully updated. You can now log in with your new password.</p>`;
  return sendEmail(email, subject, html);
};
