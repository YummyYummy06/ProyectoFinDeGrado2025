import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const verTaquillas = async (req, res) => {
    console.log('Entrando en get-taquillas')
    try {

        const taquillas = await prisma.taquilla.findMany({
            orderBy: {
                id: 'asc' // De menor a mayor
            }
        });
        res.json(taquillas);

    } catch (error) {

        console.error('Ha surgido un error al obtener las taquillas', error)
        return res.status(500).json({ message: 'Ha surgido un error al obtener las taquillas', error })

    }
}

const reservarTaquilla = async (req, res) => {
    console.log('Entrando en reservar taquilla')

    const { email, id_taquilla } = req.body;

    try {


        if (!email || !id_taquilla) {
            console.log('El email y la taquilla son necesarios')
            return res.status(201).json({ message: 'El email y la taquilla son necesarios' })
        }
        //comprobar si el email existe en nuestra base de datos

        const user = await prisma.user.findUnique({ where: { email } }) //Aqui busca en la tabla User
        if (!user) {
            console.log('El email proporcionado no existe')
            return res.status(401).json({ message: 'El email proporcionado no existe' })
        }

        //comprobar si ese email ya tiene una taquilla reservada y mostrarla si ese es el caso

        const verificarReserva = await prisma.taquilla.findUnique({ where: { email } }) //Aqui busca en la tabla taquilla
        if (verificarReserva) {
            console.log(`El usuario ${user.name} ya tiene la taquilla ${verificarReserva.id} reservada`)
            return res.status(401).json({ message: `El usuario ${user.name} ya tiene la taquilla ${verificarReserva.id} reservada` })
        }
        const verificarId = await prisma.taquilla.findUnique({ where: { id: id_taquilla } })

        if (!verificarId) {
            console.log('La taquilla proporcionada no existe')
            return res.status(401).json({ message: 'La taquilla proporcionada no existe' })
        }

        // Verificar que no esté ocupada
        if (verificarId.Ocupada) {
            console.log(`La taquilla ${id_taquilla} ya está ocupada`);
            return res.status(409).json({ message: `La taquilla ${id_taquilla} ya está ocupada` });
        }


        const reserva = await prisma.taquilla.update({
            where: { id: id_taquilla },
            data: {
                email: email,
                Ocupada: true
            }
        })

        console.log(`Taquilla ${id_taquilla}, asignada correctamente a ${user.name}`)
        return res.status(200).json({ message: `Taquilla ${id_taquilla}, asignada correctamente a ${user.name}` })


    } catch (error) {

        console.error('Ha ocurrido un error al reservar taquilla', error)
        return res.status(500).json({ message: 'Ha ocurrido un error al reservar taquilla', error })

    }
}


const verMiTaquilla = async (req, res) => {
    const { email } = req.body;
    const tokenEmail = req.user.email;

    // Verificamos que el token y el email coincidan por seguridad para que solo tu puedas ver tu taquilla
    if (email !== tokenEmail) {
        return res.status(403).json({ message: "No autorizado para ver esta taquilla" });
    }
    try {

        const data = await prisma.user.findUnique({ where: { email } })
        const user = await prisma.taquilla.findUnique({ where: { email } })

        if (!user) {

            console.log(`El usuario: ${data.name} no tiene taquilla reservada`)
            return res.status(200).json({ message: `El usuario: ${data.name} no tiene taquilla reservada` })
        }

        const taquilla = user.id;

        console.log(`El usuario ${data.name} tiene reservada la taquilla número: ${taquilla}`)
        return res.status(200).json({ message: `El usuario ${data.name} tiene reservada la taquilla número: ${taquilla}` })

    } catch (error) {

        console.error('Se ha producido un error al mostrar la taquilla')
        return res.status(500).json({ message: 'Se ha producido un error al mostrar la taquilla', error })

    }

};

export default {
    verTaquillas,
    reservarTaquilla,
    verMiTaquilla
};