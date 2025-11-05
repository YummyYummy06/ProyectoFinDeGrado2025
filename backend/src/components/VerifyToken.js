import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken; // 👈 el nombre debe coincidir con el de la cookie que envías

    if (!token) {
        console.log(`No se esta enviando ningun token`)
        return res.status(401).json({ message: "Token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // guardamos los datos del usuario (por ejemplo, email, id)
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};
