const nodemailer = require("nodemailer");
const mailgen = require("mailgen");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
module.exports = {
  getTransporter() {
    return nodemailer.createTransport({
      host: config.emailHost,
      port: config.emailPort,
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.emailUser, // generated ethereal user
        pass: config.emailPassword, // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  },
  async sendEmailConfirmationLink(user, newUser = false) {
    try {
      let transporter = this.getTransporter();
      let link = `http://localhost:8080/email-verification/${user.username}/${user.emailVerificationCode}`;
      var email = {
        body: {
          name: user.name,
          intro: newUser
            ? "Welcome to Anonymchat! We're very excited to have you with us."
            : "",
          action: {
            instructions: `To verify your email address please click the button bellow, or copy this link to the browser ${link}`,
            button: {
              color: "#22BC66",
              text: "Confirm email",
              link: link,
            },
          },
        },
      };
      var mailGenerator = new mailgen({
        theme: "default",
        product: {
          // Appears in header & footer of e-mails
          name: "Anonymchat",
          link: "http://www.anonymchat.me/",
          // Optional product logo
          // logo: 'https://mailgen.js/img/logo.png'
        },
      });

      var emailBody = mailGenerator.generate(email);

      // Generate the plaintext version of the e-mail (for clients that do not support HTML)
      var emailText = mailGenerator.generatePlaintext(email);

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: "<service@najjeftinijaputovanja.com>", // sender address
        to: user.email, // list of receivers
        subject: "Email verification", // Subject line
        text: emailText, // plain text body
        html: emailBody, // html body
      });
    } catch (error) {
      console.log(error);
    }
  },
};
