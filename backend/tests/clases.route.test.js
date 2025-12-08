import request from "supertest";
import app from "../Server.js";
import { prisma } from "../src/components/Clase.js";



describe("Test de integración para clases", () => {


    //Borrar todos los contenidos antes de empezar con el test
    beforeEach(async () => {

        await prisma.user_Clase.deleteMany();
        await prisma.clase.deleteMany();

        const fechaActual = new Date();
        //Crear una clase de prueba

        const claseNueva = await prisma.clase.create({
            data: {

                name: "Zumba",
                date: fechaActual,
                startTime: fechaActual,
                endTime: fechaActual,
                aforo: 3
            }
        })

    });

    afterAll(async () => {
        await prisma.$disconnect();
    });


    //----------- GET /get-class -------- 

    test("GET /get-class debe devolver status 200 y el listado de clases", async () => {

        const response = await request(app).get("/get-class");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body[0]).toHaveProperty("name", "Zumba")
        expect(response.body[0]).toHaveProperty("aforo", 3)


    })


    //------------- POST /create-class -----------------

    test("POST /create-class crea una clase y devuelve 201", async () => {


        const newClase = { nombre: "Boxeo", fecha: "2025-10-27T00:00:00Z", horarioComienzo: "2025-10-27T10:10:00Z", horarioTermine: "2025-10-27T12:12:12Z", aforo: 10 };

        const response = await request(app).post("/create-class").send(newClase)

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message");
        expect(response.body.clase).toHaveProperty("name", "Boxeo")
        expect(response.body.clase).toHaveProperty("aforo", 10)
    })


    //------------- PUT /edit-class/:id -----------------

    test("PUT /edit-class/:id edita una clase y devuelve 201", async () => {


        const claseCreada = await prisma.clase.create({
            data: {
                name: "Boxeo",
                date: new Date("2025-10-27T00:00:00Z"),
                startTime: new Date("2025-10-27T10:10:00Z"),
                endTime: new Date("2025-10-27T12:12:12Z"),
                aforo: 10
            }
        });

        const id = claseCreada.id;

        // Datos actualizados
        const updatedData = {
            nombre: "Boxeo Avanzado",
            aforo: 20
        };

        //  Petición PUT REAL con id válido
        const response = await request(app)
            .put(`/edit-class/${id}`)
            .send(updatedData);

        //  Validaciones
        expect(response.status).toBe(201);
        expect(response.body.clase).toHaveProperty("name", "Boxeo Avanzado");
        expect(response.body.clase).toHaveProperty("aforo", 20);
    });



});


