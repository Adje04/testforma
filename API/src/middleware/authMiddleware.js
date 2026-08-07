// import jwt from "jsonwebtoken";

// export const verifyToken = async (req, res, next) => {
//   try {
//     let token = req.header("Authorization");

//     if (!token) {
//       return res.status(403).json({ message: 'accès non autorisé' });
//     }

//     if (token.startsWith("Bearer ")) {
//       token = token.slice(7, token.length).trimLeft();
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        // 401 = non authentifié (avant : 403 sans vérifier le format, incohérent)
        return res.status(401).json({ message: 'Accès non autorisé' });
    }

    const token = authHeader.slice(7).trimStart();

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        // Avant : res.status(500).json({ error: err.message }) → fuite d'info + mauvais code HTTP
        // Un token invalide/expiré n'est PAS une erreur serveur, c'est un 401
        return res.status(401).json({ message: 'Session invalide ou expirée' });
    }
};