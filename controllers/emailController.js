const nodemailer = require("nodemailer")
const asyncHandler = require("express-async-handler")

const sendEmail = asyncHandler(async (data, req, res) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.MAIL_ID, 
      pass: process.env.MP, 
    },
  })

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Denis 👻" <test@gmail.com>',
    to: data.to, 
    subject: data.subject,
    text: data.text,
    html: data.html,
  })

  // console.log("Message sent: %s", info.messageId)
})

module.exports = sendEmail
