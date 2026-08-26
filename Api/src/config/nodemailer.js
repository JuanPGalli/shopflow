const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4, // forces IPv4 — avoids ETIMEDOUT on hosts with broken IPv6 routing (common on Railway)
});

transporter
  .verify()
  .then(() => console.log('✅ SMTP transporter connected successfully'))
  .catch((error) => console.error('❌ SMTP transporter error:', error));

module.exports = transporter;
