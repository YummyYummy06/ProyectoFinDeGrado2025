import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Controlador de las clases del gimnasio


const verClases = async (req, res) => {
    console.log('Entrando en get-class')
    try {

        const clases = await prisma.clase.findMany();
        res.json(clases);

    }
    catch (error) {
        console.errror('Ha habido un error al obtener el listado de clases', error)
        res.status(500).json({ message: 'Ha habido un error al obtener el listado de clases', error })
    }
};


const crearClase = async (req, res) => {

    console.log('Entrando en crearClase');

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


const editarClase = async (req, res) => {
    console.log('Entrando en editarClase');

    const { id } = req.params;
    const { nombre, fecha, horarioComienzo, horarioTermine, aforo } = req.body;

    try {

        if (!id) {
            console.log('El id es necesario')
            return res.status(400).json({ message: 'El id es necesario' })
        }

        const clase = await prisma.clase.findUnique({ where: { id } });

        if (!clase) {
            console.log('Id no encontrado')
            return res.status(404).json({ message: 'Id no encontrado' })
        }

        const data = {};
        if (nombre) data.name = nombre;
        if (fecha) data.date = fecha;
        if (horarioComienzo) data.startTime = horarioComienzo;
        if (horarioTermine) data.endTime = horarioTermine;
        if (aforo) data.aforo = aforo;

        const claseEditada = await prisma.clase.update({
            where: { id },
            data
        });

        console.log(`La clase ${id} ha sido actualizada con exito`)
        return res.status(200).json({ message: `La clase ha sido actualizada con exito`, claseEditada });



    } catch (error) {

        console.error('Error al editar clase', error)
        return res.status(500).json({ message: 'Error al editar usuario', error })

    }


}


const deleteClase = async (req, res) => {

    console.log('Entrando en eliminar clase');
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "No se proporcionó un ID" });
    }

    try {

        await prisma.user_Clase.deleteMany({
            where: { id_Clase: id }
        });

        const clase = await prisma.clase.delete({
            where: { id }
        });

        return res.json({ message: `Se ha eliminado la clase ${clase.name} correctamente` });

    } catch (error) {
        console.error(error);

        if (error.code === "P2025") {
            return res.status(404).json({ message: "La clase no existe" });
        }

        return res.status(500).json({
            message: "Se ha producido un error inesperado al eliminar la clase",
            error
        });
    }
};



export default {
    verClases,
    crearClase,
    editarClase,
    deleteClase
};