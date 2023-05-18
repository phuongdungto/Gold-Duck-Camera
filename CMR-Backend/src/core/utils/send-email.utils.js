const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const fsPromises = require('fs').promises
const path = require('path');
const handlebars = require('handlebars');
dotenv.config();

async function sendMail({ email, subject, template, context }) {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        service: process.env.EMAIL_SERVICE,
        secure: false, // true for 465, false for other ports
        ignoreTLS: false,
        auth: {
            user: process.env.EMAIL_AUTH_USER,
            pass: process.env.EMAIL_AUTH_PASS,
        },
    });
    const htmlString = await fsPromises.readFile(path.join(__dirname, `../../../email_templates`, `${template}.hbs`));
    // console.log(htmlString.toString('utf8'));
    const templateComplie = handlebars.compile(htmlString.toString('utf8'));
    const html = templateComplie(context);
    let info = await transporter.sendMail({
        from: process.env.EMAIL_AUTH_USER, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        html: html // html body
    });
    // console.log(info);
}
module.exports = {
    sendMail
}