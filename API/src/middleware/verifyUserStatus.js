import User from "../models/User.js";

export const verifyUserStatus = async (req, res, next) => {
    try {

        const user = await User.findById(req.user.id);

        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
        }

        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};










