const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
  const secure = port === 465;

  console.log('Mailer config -> host:', process.env.EMAIL_HOST, 'port:', port, 'secure:', secure);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    // timeouts to fail fast in diagnostics (ms)
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: false // development only
    },
    logger: true,
    debug: true,
  });

  try {
    await transporter.verify();
    console.log('Mailer verify succeeded');
  } catch (err) {
    console.error('Mailer verify failed:', err);
    // اعادة رمي الخطأ ليتعامل به caller (authService) وطرحه في اللوج
    throw err;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || `noreply@${process.env.EMAIL_HOST}`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('sendMail info:', info);
    return info;
  } catch (err) {
    console.error('sendMail failed:', err);
    throw err;
  }
};

module.exports = { sendEmail };