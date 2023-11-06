const nodemailer = require("nodemailer");
require("dotenv").config();

const {META_PASSWORD, META_USER} = process.env;

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: META_USER,
      pass: META_PASSWORD
    }
  });
// const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
    const email = {...data, from: "turinnikitta@gmail.com"};
    await transport.sendMail(email);
    return true;
}

module.exports = sendEmail;

// transport.sendMail(email)
//     .then(()=> console.log("Email send success"))
//     .catch(error => console.log(error.message));