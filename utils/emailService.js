import nodemailer from 'nodemailer';
import logger from './logger.js';

/**
 * Send an email using Nodemailer (configured for Gmail by default)
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email (falls back to admin email if not provided)
 * @param {string} options.subject - Email subject line
 * @param {string} options.html - HTML body content
 * @returns {Promise<any>} Response info or true if mocked
 */
export const sendEmail = async ({ to, subject, html }) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const adminEmail = 'pattlollasahithi@gmail.com';

  if (!emailUser || !emailPass) {
    logger.warn('Email credentials not configured in .env. Form submission mocked (no email sent).');
    return true;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });

  const mailOptions = {
    from: `"Shrradha High School" <${emailUser}>`,
    to: to || adminEmail,
    subject,
    html
  };

  const info = await transporter.sendMail(mailOptions);
  logger.info(`Email sent successfully: ${info.messageId}`);
  return info;
};
