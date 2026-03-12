/* eslint-disable no-console */
import nodemailer from "nodemailer"
import { envVars } from "../config/env"
import path from "path"
import ejs from "ejs"
import AppError from "../errorHelpers/AppError"

const transporter = nodemailer.createTransport({
    secure: true,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS
    },
    port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
    host: envVars.EMAIL_SENDER.SMTP_HOST
})

// we will create this interface to make it dynamic easy
interface SendEmailOptions {
    to: string;
    subject: string;
    templateName: string;
    // here template data might come in objects that's why it like this 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    templateData ?: Record<string,any>;
    attachments ?: {
        filename: string,
        content: Buffer | string,
        contentType: string
    } []
}


// we need this for multiple purpose so for that we will make this dynamically
// we will make the template to ejs
export const sendEmail = async({
    to,
    subject,
    templateName,
    templateData,
    attachments
} : SendEmailOptions)  => {
    try {
         const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
    const html = await ejs.renderFile(templatePath, templateData)
    const info = await transporter.sendMail({
        from : envVars.EMAIL_SENDER.SMTP_FROM,
        to: to,
        subject: subject,
        html: html,
        attachments: attachments?.map(attachment => ({
            filename : attachment.filename,
            content: attachment.content,
            contentType: attachment.contentType
        }))
    })
       console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log("email sending error", error.message)
        throw new  AppError(401, "Email sending error")
    }
}