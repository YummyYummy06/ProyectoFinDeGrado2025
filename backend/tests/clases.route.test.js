import request from "supertest";
import app from "../Server.js";
import { prisma } from "../src/components/Clase.js";
import { expect, jest } from "@jest/globals";

jest.setTimeout(300000);


describe("Test de integración para clases", () => {


    // La variable se queda fuera para poder acceder desde los test
    let id_clase;
    let usuario;
    let claseNueva;
    const newUser = { name: "Yummy", email: "Letiel52@gmail.com", password: "12345678910" }
    const newUser2 = { name: "Noor", email: "Noor@gmail.com", password: "12345678910" }
    const newUser3 = { name: "Nai", email: "Nai@gmail.com", password: "12345678910" }
    const newUser4 = { name: "Donato", email: "Donato@gmail.com", password: "12345678910" }



    //Borrar todos los contenidos antes de empezar con el test
    beforeEach(async () => {


        await prisma.user_Clase.deleteMany();
        await prisma.clase.deleteMany();
        await prisma.user.deleteMany();
        // Tenemos que crear el usuario porque utiliza su clave foranea
        usuario = await prisma.user.create({ data: { ...newUser } })

        const fechaActual = new Date();
        //Crear una clase de prueba

        claseNueva = await prisma.clase.create({
            data: {

                name: "Zumba",
                date: fechaActual,
                startTime: fechaActual,
                endTime: fechaActual,
                aforo: 3
            }
        })

        id_clase = claseNueva.id;



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

        const response = await request(app).post("/apuntarse-clase").send({ email: usuario.email, id_Clase: id_clase })

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message")
        expect(response.body.message).toContain(`Usuario ${usuario.name} registrado correctamente para la clase ${claseNueva.name}`)


    })

    test("POST /apuntarse-clase con un email que no existe y que devuelva 404", async () => {

        const emailNoexiste = "noexiste@gmail.com"

        const response = await request(app).post("/apuntarse-clase").send({ email: emailNoexiste, id_Clase: id_clase })

        // Comprobamos status
        expect(response.status).toBe(404);

        // Comprobamos que el body tenga la propiedad 'error'
        expect(response.body).toHaveProperty("error");

        // Comprobamos que el mensaje sea el esperado
        expect(response.body.error).toContain(`No se ha encontrado ningún usuario registrado con email: ${emailNoexiste}`);



    })

    test("POST /apuntarse-clase con un id_clase que no existe y que devuelva 404", async () => {

        const id_invalido = "54ca259e-aec5-4379-8753-962c018cfed8";
        const response = await request(app).post("/apuntarse-clase").send({ email: usuario.email, id_Clase: id_invalido })

        // Comprobamos status
        expect(response.status).toBe(404);

        // Comprobamos que el body tenga la propiedad 'error'
        expect(response.body).toHaveProperty("error");

        // Comprobamos que el mensaje sea el esperado
        expect(response.body.error).toContain(`No se ha encontrado ninguna clase registrada con id: ${id_invalido}`);



    })

    test("POST /apuntarse-clase con un email repetido y que devuelva 409", async () => {

        email = newUser.email;

        //Tenemos que apuntarlo 2 veces

        const response1 = await request(app).post("/apuntarse-clase").send({ email: email, id_Clase: id_clase });
        const response = await request(app).post("/apuntarse-clase").send({ email: email, id_Clase: id_clase });


        // Comprobamos status
        expect(response1.status).toBe(201)
        expect(response.status).toBe(409);

        // Comprobamos que el body tenga la propiedad adecuada
        expect(response1.body).toHaveProperty("message")
        expect(response.body).toHaveProperty("error");

        // Comprobamos que el mensaje sea el esperado
        expect(response1.body.message).toContain(`Usuario ${usuario.name} registrado correctamente para la clase ${claseNueva.name}`)
        expect(response.body.error).toContain(`Usuario ya está apuntado a la clase ${claseNueva.name}`);



    })

    test("POST /apuntarse-clase en una clase en la que el aforo ya este completo y que devuelva 409", async () => {


        // Creamos el resto de usuarios
        const usuario2 = await prisma.user.create({ data: { ...newUser2 } })
        const usuario3 = await prisma.user.create({ data: { ...newUser3 } })
        const usuario4 = await prisma.user.create({ data: { ...newUser4 } })

        const response1 = await request(app).post("/apuntarse-clase").send({ email: email, id_Clase: id_clase });
        const response2 = await request(app).post("/apuntarse-clase").send({ email: usuario2.email, id_Clase: id_clase });
        const response3 = await request(app).post("/apuntarse-clase").send({ email: usuario3.email, id_Clase: id_clase });
        const response4 = await request(app).post("/apuntarse-clase").send({ email: usuario4.email, id_Clase: id_clase });

        //Los status
        expect(response1.status).toBe(201);
        expect(response2.status).toBe(201);
        expect(response3.status).toBe(201);
        expect(response4.status).toBe(409);

        //Propiedades adecuadas
        expect(response1.body).toHaveProperty("message");
        expect(response2.body).toHaveProperty("message");
        expect(response3.body).toHaveProperty("message");
        expect(response4.body).toHaveProperty("error");

        // Comprobamos que el mensaje sea el esperado

        expect(response1.body.message).toContain(`Usuario ${usuario.name} registrado correctamente para la clase ${claseNueva.name}`);
        expect(response2.body.message).toContain(`Usuario ${usuario2.name} registrado correctamente para la clase ${claseNueva.name}`);
        expect(response3.body.message).toContain(`Usuario ${usuario3.name} registrado correctamente para la clase ${claseNueva.name}`);
        expect(response4.body.error).toContain(`El aforo de esta clase (${claseNueva.aforo}) ya está completo`);

    });

    // ------------ DELETE /delete-class/:id' --------------

    test("DELETE /delete-class/:id' elimina una clase y devuelve 200", async () => {

        const response = await request(app).delete(`/delete-class/${id_clase}`);

        //Comprobamos el status
        expect(response.status).toBe(200);

        //Comprobamos que tiene mensaje
        expect(response.body).toHaveProperty("message");

        //comprobamos que el mensaje es el esperado
        expect(response.body.message).toContain(`Se ha eliminado la clase ${claseNueva.name} correctamente`)


    })








});


