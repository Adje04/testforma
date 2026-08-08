import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { sendOtpCode } from '../utils/emailTemplates/otpCodeTemplate.js';
import { resetPasswordTemplate } from '../utils/emailTemplates/resetPasswordTemplate.js';
import { communityAddedTemplate } from '../utils/emailTemplates/communityAddedTemplate.js';
import { questionReplyTemplate } from '../utils/emailTemplates/questionReplyTemplate.js';

dotenv.config()

const transporter = nodemailer.createTransport(
    {
        // host: process.env.EMAIL_HOST,
        // port: process.env.EMAIL_PORT,
        // secure: 'true',
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });


export const sendOtpEmail = async (email, otpCode) => {

    const mailOptions = {
        from: '"foruma" <akpononeklou@gmail.com>',
        to: email,
        subject: 'Votre code OTP',
        text: `Votre code OTP est ${otpCode}`,
        html: sendOtpCode.replace('{otpCode}', otpCode)
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

// Email de réinitialisation de mot de passe
export const sendResetPasswordEmail = async (email, resetLink) => {

    const mailOptions = {
        from: '"foruma" <akpononeklou@gmail.com>',
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        text: `Cliquez sur ce lien pour réinitialiser votre mot de passe (valide 1h) : ${resetLink}`,
        html: resetPasswordTemplate(resetLink)
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending reset password email:', error);
        return { success: false, error: error.message };
    }
};


export const sendCommunityAddedEmail = (email, userName, communityName, communityLink) => send({
    from: FROM_ADDRESS, to: email, 
    subject: `Vous avez rejoint ${communityName}`,
    text: `Vous avez été ajouté(e) à la communauté ${communityName} : ${communityLink}`,
    html: communityAddedTemplate(userName, communityName, communityLink),
});

export const sendQuestionReplyEmail = (email, userName, questionTitle, questionLink) => send({
    from: FROM_ADDRESS, to: email, 
    subject: `Nouvelle réponse à votre question`,
    text: `Quelqu'un a répondu à "${questionTitle}" : ${questionLink}`,
    html: questionReplyTemplate(userName, questionTitle, questionLink),
});








