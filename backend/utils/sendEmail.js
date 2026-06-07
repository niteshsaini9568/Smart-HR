const nodemailer = require('nodemailer');

const isEmailConfigured = () => Boolean(
  process.env.EMAIL_HOST &&
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASSWORD &&
  process.env.EMAIL_FROM
);

const sendEmail = async (options) => {
  if (!isEmailConfigured()) {
    console.warn('Email service not configured. Skipping email send.');
    return null;
  }

  const port = Number(process.env.EMAIL_PORT) || 587;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `<p>${options.message}</p>`
  };

  const info = await transporter.sendMail(mailOptions);

  console.log('Message sent: %s', info.messageId);
  return info;
};

const sendEmailInBackground = (options) => {
  sendEmail(options).catch((err) => {
    console.error('Email send error:', err);
  });
};

sendEmail.isEmailConfigured = isEmailConfigured;
sendEmail.sendEmailInBackground = sendEmailInBackground;

module.exports = sendEmail;
