// Pilot mode utilities

/**
 * Check if the app is in pilot mode (waitlist required)
 * This runs on the server side
 */
export function isPilotMode(): boolean {
  return process.env.PILOT_MODE === 'true';
}

/**
 * Get the signup URL based on pilot mode
 * In pilot mode: /waitlist
 * In normal mode: /register
 */
export function getSignupUrl(): string {
  return isPilotMode() ? '/waitlist' : '/register';
}

/**
 * Get the CTA text based on pilot mode
 */
export function getSignupCTA(): string {
  return isPilotMode() ? 'Join the Pilot Program' : 'Start Free Pilot';
}

/**
 * Check if an email is in the allowed list
 */
export function isEmailAllowed(email: string): boolean {
  const allowedEmails = (process.env.ALLOWED_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

  return allowedEmails.includes(email.toLowerCase());
}
