const nodemailer = require("nodemailer");

const sendResetPasswordEmail = async (name, email, token,userType="user") => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const myOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password Request",
      html: `
        <p>Hi, ${name} <br>
        Please click the below link to reset your password <br>
        <a href="${
          userType == "admin"
            ? process.env.ADMIN_RESET_LINK
            : process.env.HOST_WEBSITE
        }/?token=${token}">Reset Password Link</a>
        </p>

      `,
    };
    transporter.sendMail(myOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail has been sent ", info.response);
      }
    });
  } catch (error) {
    return error.message;
  }
};

module.exports = sendResetPasswordEmail;
