const nodemailer = require("nodemailer");

const sendMail = async (option) => {
  const transport = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.E_PORT,
    auth: {
      user: process.env.USERNAME,
      pass: process.env.PASSWORD,
    },
  });
  mailOptions = {
    from: "help@movieexpress.com",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };
  await transport.sendMail(mailOptions);
};

module.exports = sendMail;
