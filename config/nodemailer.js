const nodeMailer = require("nodemailer")

require('dotenv').config()  


//TEST ACCOUNT
const transporter = nodeMailer.createTransport({
    host : process.env.SMTP_HOST,
    port : 587,
    secure : false ,      
    auth : {
        user: process.env.SMTP_USER ,
        pass : process.env.SMTP_PASS     
    }
})



module.exports = {transporter}