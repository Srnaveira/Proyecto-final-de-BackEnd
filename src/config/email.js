const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth:{
        user: process.env.MAIL,
        pass: process.env.GMAIL,
    }
})

module.exports = transport;