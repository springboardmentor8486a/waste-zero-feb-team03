export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Make sure protect middleware ran first
        if (!req.user) {
            return res.status(401).json({
                message: 'Not authorized. Please login.'
            });
        }

        // Block suspended users from accessing any protected resource, regardless of their role
        if (req.user.status === 'suspended') {
            return res.status(403).json({
                message: 'Your account has been suspended. Please contact support.'
            });
        }

        // Check if user's role is included in allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. ${req.user.role} role is not allowed to access this resource.`
            });
        }

        next();
    };
};