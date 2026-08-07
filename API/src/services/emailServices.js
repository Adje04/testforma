import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { sendOtpCode } from '../utils/emailTemplates.js';

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
        html: `<p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
               <p>Cliquez sur ce lien pour choisir un nouveau mot de passe (valide 1 heure) :</p>
               <p><a href="${resetLink}">${resetLink}</a></p>
               <p>Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email — aucune action ne sera effectuée sur votre compte.</p>`
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









