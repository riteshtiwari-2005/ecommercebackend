const { Resend } = require("resend");

let resendClient = null;

/**
 * Initialize Resend client using RESEND_API_KEY.
 */
function getResendClient() {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY missing. Set RESEND_API_KEY in environment.");
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

/**
 * Send an email using Resend.
 * Maintains the same function signature used across the app.
 */
async function sendMail({ to, subject, text, html }) {
  const resend = getResendClient();

  const from =
    process.env.FROM_EMAIL ||
    // Fallback to Resend's onboarding domain for non-production use
    (process.env.NODE_ENV === "production" ? "no-reply@example.com" : "onboarding@resend.dev");

  const payload = { from, to, subject, html, text };

  try {
    const { data, error } = await resend.emails.send(payload);
    if (error) {
      throw new Error(error.message || "Resend email send failed");
    }
    return data;
  } catch (err) {
    console.error("Resend send failed:", err.message || err);
    throw err;
  }
}

module.exports = { sendMail };
