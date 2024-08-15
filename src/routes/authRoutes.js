// routes/authRoutes.js
const express = import('express');
const { sendResetEmail, resetPassword } = import('../services/passwordService');

const router = express.Router();

router.post('/forgot-password', async (req, res) => {
    try {
        await sendResetEmail(req.body.email);
        res.json({ message: 'Reset email sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/reset-password/:token', async (req, res) => {
    try {
        await resetPassword(req.params.token, req.body.newPassword);
        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
