import express from "express";
import { oauth2Client, SCOPES } from "../Google.js";
import fs from "fs";

const router = express.Router();

// 1️⃣ Redirigir a Google para autorizar
router.get("/auth/google", (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: SCOPES,
    });
    console.log("🌐 URL generada para Google OAuth:", authUrl);
    res.redirect(authUrl);
});

// 2️⃣ Callback de Google (intercambia el code por tokens)
router.get("/auth/google/callback", async (req, res) => {
    const { code } = req.query;

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // ⚠️ En producción, guarda tokens en la base de datos
        fs.writeFileSync("token.json", JSON.stringify(tokens));

        res.send("✅ Autenticación exitosa. Tokens guardados.");
    } catch (error) {
        console.error("Error en callback:", error);
        res.status(500).send("Error al autenticar con Google");
    }
});

export default router;
