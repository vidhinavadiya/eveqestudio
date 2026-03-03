const jwt = require('jsonwebtoken');

module.exports = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader) {
                return res.status(401).json({ success: false, error: 'access denied: no token provided' });
            }

            const token = authHeader.split(' ')[1]; // Bearer <token>
            if (!token) {
                return res.status(401).json({ success: false, error: 'access denied: invalid token format' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // id, role etc.

            if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ success: false, error: 'access denied: insufficient role' });
            }

            next();
        } catch (err) {
            console.error('AuthMiddleware error:', err);
            return res.status(401).json({ success: false, error: 'access denied' });
        }
    };
};
