import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { expect, jest } from "@jest/globals";

jest.setTimeout(300000);

describe("Pruebas unitarias de Usuario", () => {

    const plainPassword = "123456";
    let hashedPassword;

    // -------------------- Hashing de contraseñas --------------------
    test("bcrypt.hash debería generar un hash para una contraseña", async () => {
        hashedPassword = await bcrypt.hash(plainPassword, 12);
        expect(typeof hashedPassword).toBe("string");
        expect(hashedPassword).not.toBe(plainPassword);
        expect(hashedPassword.length).toBeGreaterThan(0);
    });

    test("bcrypt.compare debería validar la contraseña correctamente", async () => {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        expect(isMatch).toBe(true);
    });

    test("bcrypt.compare debería fallar con una contraseña incorrecta", async () => {
        const isMatch = await bcrypt.compare("wrongpassword", hashedPassword);
        expect(isMatch).toBe(false);
    });

    // -------------------- JWT --------------------
    test("jwt.sign debería generar un token con payload y secret", () => {
        const payload = { id: "123", email: "test@example.com" };
        const secret = "mi_secreto";
        const token = jwt.sign(payload, secret, { expiresIn: "1h" });

        expect(typeof token).toBe("string");
        expect(token.length).toBeGreaterThan(0);
    });

    test("jwt.verify debería decodificar el token correctamente", () => {
        const payload = { id: "123", email: "test@example.com" };
        const secret = "mi_secreto";
        const token = jwt.sign(payload, secret, { expiresIn: "1h" });

        const decoded = jwt.verify(token, secret);
        expect(decoded).toHaveProperty("id", "123");
        expect(decoded).toHaveProperty("email", "test@example.com");
    });

    test("jwt.verify debería fallar con un token inválido", () => {
        const secret = "mi_secreto";
        const invalidToken = "token_invalido";

        expect(() => jwt.verify(invalidToken, secret)).toThrow();
    });

});
