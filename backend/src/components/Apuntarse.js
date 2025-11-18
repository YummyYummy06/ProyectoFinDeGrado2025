import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const apuntarseAunaClase = async (req, res) => {

    const { email, id_Clase } = req.body;

    if (!email || !id_Clase) {
        throw new Error('Es necesario el email del usuario y el id de la clase');
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw new Error(`No se ha encontrado ningún usuario registrado con email: ${email}`);
    }

    // Buscar clase
    const clase = await prisma.clase.findUnique({
        where: { id: id_Clase }
    });
    if (!clase) {
        throw new Error(`No se ha encontrado ninguna clase registrada con id: ${id_Clase}`);
    }

    // Evitar duplicados
    const yaApuntado = await prisma.user_Clase.findFirst({
        where: { id_User: user.id, id_Clase }
    });
    if (yaApuntado) {
        throw new Error(`Usuario ya está apuntado a la clase ${clase.name}`);
    }

    // Comprobar aforo
    const verAforo = await prisma.user_Clase.count({ where: { id_Clase } });
    if (verAforo >= clase.aforo) {
        console.log(`Error: Aforo completo (${clase.aforo}) para la clase ${clase.name}`);
        return res.status(200).json({ message: `El aforo de esta clase (${clase.aforo}) ya está completo` });
    }

    // Registrar usuario en la clase
    const userApuntado = await prisma.user_Clase.create({
        data: {
            id_User: user.id,
            id_Clase: clase.id,
            time: new Date(),
            email: user.email,
            className: clase.name
        }
    });
    const aforoActual = verAforo + 1;
    console.log(`El aforo de esta clase es de ${clase.aforo}, actualmente hay ${aforoActual} usuarios apuntados`)
    return res.status(200).json({ message: `Usuario ${user.name} registrado correctamente para la clase ${clase.name}` })
};

export default {
    apuntarseAunaClase
};
