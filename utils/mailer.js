const nodemailer = require("nodemailer");

let transporter = null;

/**
 * Initialize Nodemailer transport using SMTP_* env vars.
 */
function getTransporter() {
  if (!transporter) {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      throw new Error("SMTP credentials missing. Set SMTP_HOST, SMTP_USER, SMTP_PASS.");
    }

    const secure = process.env.SMTP_SECURE === "true" || port === 465;

    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }
  return transporter;
}

/**
 * Send an email using Nodemailer.
 * Maintains the same function signature used across the app.
 */
async function sendMail({ to, subject, text, html }) {
  const mailer = getTransporter();

  const from =
    process.env.FROM_EMAIL ||
    (process.env.NODE_ENV === "production" ? "no-reply@example.com" : "no-reply@localhost");

  const payload = { from, to, subject, html, text };

  try {
    return await mailer.sendMail(payload);
  } catch (err) {
    console.error("Nodemailer send failed:", err.message || err);
    throw err;
  }
}

module.exports = { sendMail };
