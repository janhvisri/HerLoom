const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, message) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });


    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: message
    };


    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");
};


module.exports = sendEmail;