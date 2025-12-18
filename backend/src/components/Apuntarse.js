import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const apuntarseAunaClase = async (req, res) => {
    try {
        const { email, id_Clase } = req.body;

        if (!email || !id_Clase) {
            return res.status(400).json({ error: 'Es necesario el email del usuario y el id de la clase' });
        }

        // Buscar usuario
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: `No se ha encontrado ningún usuario registrado con email: ${email}` });
        }

        // Buscar clase
        const clase = await prisma.clase.findUnique({ where: { id: id_Clase } });
        if (!clase) {
            return res.status(404).json({ error: `No se ha encontrado ninguna clase registrada con id: ${id_Clase}` });
        }

        // Evitar duplicados
        const yaApuntado = await prisma.user_Clase.findFirst({
            where: { id_User: user.id, id_Clase }
        });
        if (yaApuntado) {
            return res.status(409).json({ error: `Usuario ya está apuntado a la clase ${clase.name}` });
        }

        // Comprobar aforo
        const verAforo = await prisma.user_Clase.count({ where: { id_Clase } });
        if (verAforo >= clase.aforo) {
            return res.status(409).json({ error: `El aforo de esta clase (${clase.aforo}) ya está completo` });
        }

        // Registrar usuario en la clase
        await prisma.user_Clase.create({
            data: {
                id_User: user.id,
                id_Clase: clase.id,
                time: new Date(),
                email: user.email,
                className: clase.name
            }
        });

        return res.status(201).json({ message: `Usuario ${user.name} registrado correctamente para la clase ${clase.name}` });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const verClasesApuntadas = async (req, res) => {
    console.log('Entrando en /get-my-classes');
    try {
        const email = req.user.email; // Obtener email del token verificado

        // Buscar usuario por email
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: `No se ha encontrado ningún usuario registrado con email: ${email}` });
        }

        // Obtener clases apuntadas
        const clasesApuntadas = await prisma.user_Clase.findMany({
            where: { id_User: user.id }
        });

        if (!clasesApuntadas) {
            return res.status(404).json({ message: 'No estás apuntado a ninguna clase' });
        }
        return res.status(200).json({ message: "Estas apuntado a estas clases:", clases: clasesApuntadas });
    }
    catch (error) {
        console.error('Error obteniendo clases apuntadas:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const cancelarClase = async (req, res) => {
    console.log('Entrando en cancelar clase');
    try {
        const { email, id_Clase } = req.body;

        if (!email || !id_Clase) {
            return res.status(400).json({ error: 'Es necesario el email del usuario y el id de la clase' });
        }

        // Buscar usuario
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: `No se ha encontrado ningún usuario registrado con email: ${email}` });
        }

        // Buscar clase
        const clase = await prisma.clase.findUnique({ where: { id: id_Clase } });
        if (!clase) {
            return res.status(404).json({ error: `No se ha encontrado ninguna clase registrada con id: ${id_Clase}` });
        }

        // Eliminar registro de usuario en la clase
        const registro = await prisma.user_Clase.findFirst({
            where: { id_User: user.id, id_Clase }
        });

        if (!registro) {
            return res.status(404).json({ error: `El usuario no está apuntado a la clase ${clase.name}` });
        }

        await prisma.user_Clase.delete({
            where: {
                id_User_id_Clase: {
                    id_User: user.id,
                    id_Clase: id_Clase
                }
            }
        });

        return res.status(200).json({ message: `Usuario ${user.name} ha cancelado su inscripción en la clase ${clase.name}` });
    } catch (error) {
        console.error('Error al cancelar la clase:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export default {
    apuntarseAunaClase,
    verClasesApuntadas,
    cancelarClase
};
