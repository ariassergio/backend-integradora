// services/passwordService.js
const crypto = import('crypto');
const nodemailer = import('nodemailer');
const User = import('../models/user');
const ResetToken = import('../models/resetToken');

async function sendResetEmail(email) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('No user with that email');

    const token = crypto.randomBytes(32).toString('hex');
    await ResetToken.create({ userId: user._id, token });

    const resetLink = `http://yourdomain.com/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
        // Configure your email service here
    });

    const mailOptions = {
        to: email,
        from: 'no-reply@yourdomain.com',
        subject: 'Password reset',
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`
    };

    await transporter.sendMail(mailOptions);
}

async function resetPassword(token, newPassword) {
    const resetToken = await ResetToken.findOne({ token });
    if (!resetToken) throw new Error('Invalid or expired token');

    const user = await User.findById(resetToken.userId);
    if (user.password === newPassword) throw new Error('New password cannot be the same as the old password');

    user.password = newPassword;
    await user.save();

    await ResetToken.deleteOne({ token });
}

module.exports = {
    sendResetEmail,
    resetPassword
};
