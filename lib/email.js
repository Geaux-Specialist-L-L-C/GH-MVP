import nodemailer from 'nodemailer';

/**
 * Send email using NodeMailer
 * @param {Object} options - Email options
 * @returns {Promise} - Promise that resolves when email is sent
 */
export async function sendEmail(options) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: `"Geaux HelpED" <${process.env.EMAIL_FROM}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  };

  return transporter.sendMail(mailOptions);
}