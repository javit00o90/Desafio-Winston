const accessControlMiddleware = (roles) => (req, res, next) => {
    if (!req.user) {
            res.status(401).json({ error: 'Unauthorized. Authentication required.' });
        } else {
        const { role } = req.user;
        if (roles.includes(role)) {
            next();
        } else {
            res.status(403).json({ error: 'Access denied. Insufficient privileges.' });
        }
    }
};

export const userAdminAccessMiddleware = accessControlMiddleware(['user', 'admin']);
export const userAccessMiddleware = accessControlMiddleware(['user']);
export const adminAccessMiddleware = accessControlMiddleware(['admin']);
