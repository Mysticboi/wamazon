const nodemailer = require('nodemailer');
const config = require('../config');

const { user, pass } = config.nodemailer;

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  auth: {
    user,
    pass,
  },
});

const sendEmail = async ({ from, to, subject, html }) => {
  await transporter.sendMail({ from, to, subject, html });
};

/*
const mailOptions = {
  from: '"Wamazon" <walidoulderra@hotmail.fr>',
  to: 'walidoulderra@hotmail.fr',
  subject: 'Hello',
  html: '<b>Hello World </b> <br> First nodemailer Email.',
};
sendEmail(mailOptions);
*/

exports.sendEmail = sendEmail;
