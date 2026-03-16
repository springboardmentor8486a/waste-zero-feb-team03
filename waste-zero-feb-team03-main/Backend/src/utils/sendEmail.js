import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    let transporter;

    // 1. If Mailtrap credentials exist, use Mailtrap
    if (process.env.MAILTRAP_HOST && process.env.MAILTRAP_USER) {
        transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT || 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS,
            },
        });
        console.log(`\n\n[DEV MODE] Using Mailtrap Email Service...`);
    }
    // 2. If real Gmail credentials exist, use Gmail
    else if (process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD) {
        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    } else {
        // Fallback to Ethereal Email for testing without real credentials
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
        console.log(`\n\n[DEV MODE] Using Ethereal Mock Email Service...`);
    }

    const mailOptions = {
        from: `Waste-Zero <${process.env.EMAIL_USERNAME || 'noreply@wastezero.local'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);

    // If we used Ethereal, log the URL so the developer can click it to see the email!
    if (!process.env.MAILTRAP_HOST && !process.env.EMAIL_USERNAME) {
        console.log("=========================================");
        console.log("✉️  MOCK EMAIL SENT SUCCESSFULLY!");
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        console.log("=========================================\n\n");
    } else if (process.env.MAILTRAP_HOST) {
        console.log("=========================================");
        console.log("✉️  EMAIL SENT TO MAILTRAP!");
        console.log("Check your Mailtrap Inbox to view it.");
        console.log("=========================================\n\n");
    }
};

export default sendEmail;
