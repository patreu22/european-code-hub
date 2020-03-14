const nodemailer = require("nodemailer");
const dotenv = require('dotenv')

const CURRENT_SERVING_WEBSITE = 'http://localhost:3000'

dotenv.config()

const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
    }
});

function sendVerificationMail(verificationToken, mail) {
    return new Promise(function (resolve, reject) {
        console.log("# Sending verification mail!")
        link = CURRENT_SERVING_WEBSITE + "/verify?id=" + verificationToken
        mailOptions = {
            to: mail,
            subject: "Please confirm your Email account",
            html: "Hello,<br> Please Click on the link to verify your email to subscribe for the European Code Hub:<br><a href=" + link + ">Click here to verify</a>"
        }

        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error)
                reject(error)
            } else {
                console.log("Verification message sent.")
                resolve(true)
            }
        });
    })
}

module.exports = {
    sendVerificationMail: sendVerificationMail
}