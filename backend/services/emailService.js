import nodemailer from 'nodemailer';
// import { generateToken } from './tokenService.js';
// import { config } from '../config.js';



const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

/**
 * Sends a verification email to the user
 * @param {Object} user - The user object containing email and verification token
 */
export const sendVerificationEmail = async (user) => {
    const mailOptions = {
        from: `"Lyan Restaurant" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Verify Your Email",
        html: `<p>Click the link below to verify your email:</p>
               <a href="${process.env.FRONTEND_URL}/verify-email/${user.verificationToken}">
               Verify Email</a>`
    };

    await transporter.sendMail(mailOptions);
};

/**
 * Sends a password reset email to the user
 * @param {Object} user - The user object containing email and reset token
 * @param {string} resetToken - The token for resetting the password
 */
export const sendPasswordResetEmail = async (user, resetToken) => {
    const mailOptions = {
        from: `"Lyan Restaurant" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Password Reset Request",
        html: `<p>Click the link below to reset your password:</p>
               <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">
               Reset Password</a>`
    };

    await transporter.sendMail(mailOptions);
};
