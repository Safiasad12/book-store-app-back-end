import { createTransport } from "nodemailer";
import dotenv from 'dotenv';
import SMTPTransport from "nodemailer/lib/smtp-transport";

dotenv.config();

const tranporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASS
    }
});

export async function sendMail(to: string, subject: string, body: string): Promise<SMTPTransport.SentMessageInfo> {
    return tranporter.sendMail({
        from: `"Book-Store" <${process.env.SMTP_MAIL}>`,
        to,
        subject,
        html: `<p>${body}</p>`
    });
}

