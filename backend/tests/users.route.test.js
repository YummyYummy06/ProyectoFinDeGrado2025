import request from "supertest";
import app from "../Server.js";
import { prisma } from "../src/components/Usuario.js";
import bcrypt from "bcrypt";
import { expect, jest } from "@jest/globals";

jest.setTimeout(300000);

describe("Tests de integración para usuarios", () => {

    const testPassword = "123456";
    let hashedPassword;
    let userId;

    beforeAll(async () => {
        hashedPassword = await bcrypt.hash(testPassword, 12);
    });

    beforeEach(async () => {
        // Limpiar la base de datos antes de cada test
        await prisma.user_Clase.deleteMany();
        await prisma.user.deleteMany();

        // Crear un usuario de prueba
        const user = await prisma.user.create({
            data: {
                name: "Juan",
                email: "juan@gmail.com",
                password: hashedPassword
            }
        });

        userId = user.id;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    // ------------------- GET /get-users -------------------
    test("GET /get-users debe devolver status 200 y lista de usuarios", async () => {
        const response = await request(app).get("/get-users");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty("name", "Juan");
        expect(response.body[0]).toHaveProperty("email", "juan@gmail.com");
    });

    // ------------------- POST /user-register -------------------
    test("POST /user-register crea un usuario y devuelve 201", async () => {
        const newUser = { username: "Ana", email: "ana@gmail.com", password: testPassword };

        const response = await request(app)
            .post("/user-register")
            .send(newUser);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message");
        expect(response.body.user).toHaveProperty("name", "Ana");
        expect(response.body.user).toHaveProperty("email", "ana@gmail.com");
    });

    test("POST /user-register con email duplicado devuelve 400", async () => {
        const duplicateUser = { username: "Juan", email: "juan@gmail.com", password: testPassword };

        const response = await request(app)
            .post("/user-register")
            .send(duplicateUser);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "El email ya está registrado");
    });

    test("POST /user-register con datos incompletos devuelve 500", async () => {
        const incompleteUser = { username: "Pedro" }; // Falta email y password

        const response = await request(app)
            .post("/user-register")
            .send(incompleteUser);

        expect(response.status).toBe(500); // tu backend lanza error de server
    });

    // ------------------- POST /user-login -------------------
    test("POST /user-login con credenciales correctas devuelve 200", async () => {
        const credentials = { email: "juan@gmail.com", password: testPassword };

        const response = await request(app)
            .post("/user-login")
            .send(credentials);

        expect(response.status).toBe(200);
        expect(typeof response.text).toBe("string");
        expect(response.text).toContain("El usuario Juan ha iniciado sesión con éxito");
    });

    test("POST /user-login con contraseña incorrecta devuelve 401", async () => {
        const credentials = { email: "juan@gmail.com", password: "incorrecta" };

        const response = await request(app)
            .post("/user-login")
            .send(credentials);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("error", "Contraseña incorrecta");
    });

    test("POST /user-login con email no registrado devuelve 404", async () => {
        const credentials = { email: "noexiste@gmail.com", password: testPassword };

        const response = await request(app)
            .post("/user-login")
            .send(credentials);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error", "Usuario no encontrado");
    });

    // ------------------- DELETE /user-delete-one -------------------
    test("DELETE /user-delete-one elimina un usuario y devuelve 200", async () => {
        const response = await request(app)
            .delete("/user-delete-one")
            .send({ id: userId });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message");
        expect(response.body.user).toHaveProperty("name", "Juan");

        const user = await prisma.user.findUnique({ where: { id: userId } });
        expect(user).toBeNull();
    });

    // ------------------- DELETE /user-delete-all -------------------
    test("DELETE /user-delete-all elimina todos los usuarios y devuelve 200", async () => {
        const response = await request(app)
            .delete("/user-delete-all");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Todos los usuarios han sido eliminados con exito");

        const users = await prisma.user.findMany();
        expect(users.length).toBe(0);
    });

});


