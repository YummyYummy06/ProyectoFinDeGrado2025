import request from "supertest";
import app from "../Server.js";
import { prisma } from "../src/components/Clase.js";






describe("Test de integración para clases", () => {


    // La variable se queda fuera para poder acceder desde los test
    let id_clase;
    const newUser = { name: "Yummy", email: "Letiel52@gmail.com", password: "12345678910" }
    let email;



    //Borrar todos los contenidos antes de empezar con el test
    beforeEach(async () => {


        await prisma.user_Clase.deleteMany();
        await prisma.clase.deleteMany();
        await prisma.user.deleteMany();
        // Tenemos que crear el usuario porque utiliza su clave foranea
        const usuario = await prisma.user.create({ data: { ...newUser } })

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

        id_clase = claseNueva.id;
        email = usuario.email;


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

        // Datos actualizados
        const updatedData = {
            nombre: "Boxeo Avanzado",
            aforo: 20
        };

        //  Petición PUT REAL con id válido
        const response = await request(app).put(`/edit-class/${id_clase}`).send(updatedData);

        //  Validaciones
        expect(response.status).toBe(201);
        expect(response.body.clase).toHaveProperty("name", "Boxeo Avanzado");
        expect(response.body.clase).toHaveProperty("aforo", 20);
    });

    //------------- POST /apuntarse-clase -----------------

    test("POST /apuntarse-clase añade a la tabla user_clase un usuario y devuelve 201", async () => {



        //Importante pasar los datos correctamente aqui hemos fallado varias veces

        const response = await request(app).post("/apuntarse-clase").send({ email: email, id_Clase: id_clase })

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message")

    })

    test("POST /apuntarse-clase con un email que no existe y que devuelva 404", async () => {

        const emailNoexiste = "noexiste@gmail.com"

        const response = await request(app).post("/apuntarse-clase").send({ email: emailNoexiste, id_Clase: id_clase })

        // Comprobamos status
        expect(response.status).toBe(404);

        // Comprobamos que el body tenga la propiedad 'error'
        expect(response.body).toHaveProperty("error");

        // Comprobamos que el mensaje sea el esperado
        expect(response.body.error).toContain(`No se ha encontrado ningún usuario registrado con email:`);



    })

    test("POST /apuntarse-clase con un id_clase que no existe y que devuelva 404", async () => {

        const id_invalido = "54ca259e-aec5-4379-8753-962c018cfed8";
        const response = await request(app).post("/apuntarse-clase").send({ email: email, id_Clase: id_invalido })

        // Comprobamos status
        expect(response.status).toBe(404);

        // Comprobamos que el body tenga la propiedad 'error'
        expect(response.body).toHaveProperty("error");

        // Comprobamos que el mensaje sea el esperado
        expect(response.body.error).toContain(`No se ha encontrado ninguna clase registrada con id:`);



    })

    test("POST /apuntarse-clase con un email repetido y que devuelva 409", async () => {

        const response1 = await request(app).post("/apuntarse-clase").send({ email: email, id_Clase: id_clase });
        const response = await request(app).post("/apuntarse-clase").send({ email: email, id_Clase: id_clase })


        // Comprobamos status
        expect(response.status).toBe(409);

        // Comprobamos que el body tenga la propiedad 'error'
        expect(response.body).toHaveProperty("error");

        // Comprobamos que el mensaje sea el esperado
        expect(response.body.error).toContain(`Usuario ya está apuntado a la clase`);



    })









});


