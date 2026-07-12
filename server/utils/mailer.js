const nodemailer = require('nodemailer');

/**
 * Sends a transactional email asynchronously to minimize API response latency
 */
const sendMail = async ({ to, subject, html }) => {
  try {
    // Configure transporter (defaults to ethereal mock SMTP sandbox)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
        pass: process.env.SMTP_PASS || 'password'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || '"AssetFlow System" <noreply@assetflow.com>',
      to,
      subject,
      html
    };

    // Log to console for quick developer feedback
    console.log(`\n--- [EMAIL DISPATCHED] ---`);
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`-------------------------\n`);

    // Dispatch asynchronously (catch failures silently so API execution is not disrupted)
    transporter.sendMail(mailOptions).catch(err => {
      console.warn(`[Nodemailer Warning] Test mail skipped/undelivered: ${err.message}`);
    });

    return true;
  } catch (err) {
    console.error(`[Mailer Error] Failed to generate transporter or mail options: ${err.message}`);
    return false;
  }
};

module.exports = { sendMail };
