import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const apuntarseAunaClase = async (email, id_Clase) => {

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

    return {
        message: `Usuario ${user.name} registrado correctamente para la clase ${clase.name}`,

    };
};

export default {
    apuntarseAunaClase
};
