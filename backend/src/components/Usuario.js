import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const verUsuarios = async (req, res) => {

    try {

        const users = await prisma.user.findMany(); // El mapeo lo hace en letra minuscula, este es el nombre de la tabla en el modelo en schema.prisma
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Error listando a users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const registrarUsuario = async (req, res) => {
    const { username, email, password } = req.body; // El req.body es lo que me envia el cliente en los inputs


    console.log('Procecemos a registrar al usuario'); // Asi se que esta entrando en register


    const hasshedPassword = await bcrypt.hash(password, 12);

    try {

        if (await prisma.user.findUnique({ where: { email } })) {
            console.log('El email ya está registrado');
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const newUser = await prisma.user.create({
            data: {

                name: username,
                email,
                password: hasshedPassword
            }
        });

        console.log('Usuario registrado con exito:', newUser);
        res.status(201).json({
            message: `Usuario ${newUser.name} registrado con éxito`,
            user: newUser
        });

    } catch (error) {
        console.error('Error registrando usuario:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const logearUsuario = async (req, res) => {

    const { email, password } = req.body;  // Lo recoge de los inputs del cliente

    try {
        const user = await prisma.user.findUnique({ where: { email: email } });

        if (!user) {
            console.log('Usuario no encontrado');
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('Contraseña incorrecta');
            return res.status(401).json({ message: `La contraseña no coincide`, error: 'Contraseña incorrecta' });
        }


        const payload = { username: user.name, email: user.email, id: user.id }; // Datos que quiero guardar en el token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' }); // Firmo el token con la clave secreta y le doy una duracion de 2 horas


        console.log('Login exitoso para el usuario:', user, token);
        res.cookie('authToken', token, { httpOnly: true }).json(`El usuario ${user.name} ha iniciado sesión con éxito`);
    }
    catch (error) {

        console.error('Error en login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

const logOutUsuario = async (req, res) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(400).json({ error: 'No tiene autorización de acceso' }); // Si no hay token en las cookies, no tiene autorizacion
    }

    res.clearCookie('authToken').json({ message: 'Cierre de sesión exitoso' });// Elimino la cookie del token en el cliente

};

const eliminarUnUsuario = async (req, res) => {
    const { id } = req.body;

    const user = await prisma.user.findUnique({ where: { id } }); // Busco el usuario antes de borrarlo
    try {
        if (!id) {
            console.log('El id es necesario para eliminar el ususario'); //Aqui me aviso en el servidor.  // Aqui hay un error porque este bloque nunca lo lee
            return res.status(400).json({ error: 'El id es necesario para eliminar el ususario' }); // Aqui le aviso al cliente
        }

        const deletedUser = await prisma.user.delete({ where: { id } });
        console.log('Usuario eliminado con exito:', deletedUser); //Aqui me aviso en el servidor
        res.json({ message: `Usuario ${deletedUser.name} eliminado con éxito`, user: deletedUser });// Aqui le aviso al cliente



    } catch (error) {

        console.error('Error eliminando usuario:', error);
        res.status(500).json({ error: 'Internal server error' });// Aqui le aviso al cliente

    }
};

const eliminarTodosUsuarios = async (req, res) => {
    try {

        //En la base de datos hay una tabla que relaciona usuarios con clases.
        // Esa tabla tiene un campo id_User que es foreign key apuntando a User.id.

        await prisma.user_Clase.deleteMany(); // elimina todas las relaciones. Ya que si existen otras tablas con estos usuarios, supabase no me deja eliminarlos

        const user = await prisma.user.deleteMany();



        console.log('Todos los usuarios han sido eliminados con exito');
        res.json({ message: 'Todos los usuarios han sido eliminados con exito' });
    }


    catch (error) {
        console.error('Error eliminando usuarios:', error);
        res.status(500).json({ error: 'Internal server error' })

    }
};

export default {
    verUsuarios,
    registrarUsuario,
    logearUsuario,
    logOutUsuario,
    eliminarUnUsuario,
    eliminarTodosUsuarios
};