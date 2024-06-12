const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ error: 'Access denied. Admins only.' });
};

const isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        return next();
    }
    return res.status(403).json({ error: 'Access denied. Users only.' });
};

const isPremium = (req, res, next) => {
    if (req.user && req.user.role === 'premium') {
        return next();
    }
    return res.status(403).json({ error: 'Access denied. Premium users only.' });
};

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

module.exports = {
    isAdmin,
    isUser,
    isPremium,
    isAuthenticated
};
