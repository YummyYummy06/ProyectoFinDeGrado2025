import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import validacionUser from './src/components/AuthValidation.js';
import handleClase from './src/components/ClaseController.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();


//Middleware
app.use(express.json());
app.use(cookieParser());


// Definicion de endpoints

app.get('/', (res) => {
    res.send('Welcome to ElGymApp Backend!');
});


app.get('/get-users', async (req, res) => {
    try {

        const users = await prisma.user.findMany(); // El mapeo lo hace en letra minuscula, este es el nombre de la tabla en el modelo en schema.prisma
        res.json(users);
    }
    catch (error) {
        console.error('Error listando a users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

app.post('/user-register', validacionUser, async (req, res) => {

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
});

app.post('/user-login', validacionUser, async (req, res) => {

    const { email, password } = req.body;  // Lo recoge de los inputs del cliente

    try {
        const user = await prisma.user.findUnique({ where: { email } });

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


});

app.post('/user-logout', async (req, res) => {

    const token = req.cookies.authToken;

    if (!token) {
        return res.status(400).json({ error: 'No tiene autorización de acceso' }); // Si no hay token en las cookies, no tiene autorizacion
    }

    res.clearCookie('authToken').json({ message: 'Cierre de sesión exitoso' });// Elimino la cookie del token en el cliente


});

app.delete('/user-delete-one', async (req, res) => {  // Este lo quiero usar en desarrollo para borrar usuarios de prueba

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



});


app.delete('/user-delete-all', async (req, res) => { // Este lo quiero usar en desarrollo para borrar todos los usuarios de prueba

    try {

        const user = await prisma.user.deleteMany();
        console.log('Todos los usuarios han sido eliminados con exito');
        res.json({ message: 'Todos los usuarios han sido eliminados con exito' });
    }


    catch (error) {
        console.error('Error eliminando usuarios:', error);
        res.status(500).json({ error: 'Internal server error' })

    }
});

app.get('/get-class', async (req, res) => {
    console.log('Entrando en get-class')
    try {

        const clases = await prisma.clase.findMany();
        res.json(clases);

    }
    catch (error) {
        console.errror('Ha habido un error al obtener el listado de clases', error)
        res.status(500).json({ message: 'Ha habido un error al obtener el listado de clases', error })
    }
});

app.post('/create-class', async (req, res) => {


    const { nombre, fecha, horarioComienzo, horarioTermine, aforo } = req.body;


    try {

        if (!nombre || !fecha || !horarioComienzo || !horarioTermine || !aforo) {
            console.error('Faltan campos por rellenar', error)
            return res.status(400).json({ error: 'Faltan campos por rellenar' });
        }

        return handleClase.crearClase(req, res);

    } catch (error) {
        console.error('Se ha producido un error inesperado creando una clase');
        res.status(400).json('Se ha producido un error al crear una clase');
    }

});

app.put('/edit-class/:id', async (req, res) => {


    try {

        return handleClase.editarClase(req, res);

    } catch (error) {

        console.error('Se ha producido un error inesperado editando una clase');
        res.status(400).json('Se ha producido un error al editar una clase');

    }


});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;