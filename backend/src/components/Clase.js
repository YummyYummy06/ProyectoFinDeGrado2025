import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const handleCrearClase = async (req, res) => {

    console.log('Entrando en crearClase')

    try {


        const { nombre, fecha, horarioComienzo, horarioTermine, aforo } = req.body;


        const clase = await prisma.clase.create({

            data: {

                name: nombre,
                date: fecha,
                startTime: horarioComienzo,
                endTime: horarioTermine,
                aforo: aforo

            }
        })


        console.log('Se ha generado la clase correctamente');
        return res.status(201).json({ message: 'Clase generada correctamente', clase })


    } catch (error) {

        console.error('Error al crear una clase:', error);
        return res.status(500).json({ error: error.message });


    }



}


export default handleCrearClase;