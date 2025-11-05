import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import validacionUser from './src/components/AuthValidation.js';
import handleClase from './src/components/ClaseController.js';
import apuntarse from './src/components/Apuntarse.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { verifyToken } from './src/components/VerifyToken.js';



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

app.post('/apuntarse-clase', async (req, res) => {
    console.log('Entrando en apuntarse a una clase');

    const { user, id_Clase } = req.body;

    try {
        const resultado = await apuntarse.apuntarseAunaClase(user, id_Clase);

        // Devuelve la respuesta al cliente
        return res.status(200).json(resultado);

    } catch (error) {
        console.error('Error apuntándose a la clase:', error.message);

        return res.status(400).json({
            message: 'Se ha producido un error al apuntarse a la clase',
            error: error.message
        });
    }
});

app.get('/get-taquillas', async (req, res) => {

    console.log('Entrando en get-taquillas')
    try {

        const taquillas = await prisma.taquilla.findMany({
            orderBy: {
                id: 'asc' // 👈 asc = ascendente (de menor a mayor)
            }
        });
        res.json(taquillas);

    } catch (error) {

        console.error('Ha surgido un error al obtener las taquillas', error)
        return res.status(500).json({ message: 'Ha surgido un error al obtener las taquillas', error })

    }

});

app.put('/taquilla-reservar', async (req, res) => {

    console.log('Entrando en /taquilla-reservar')

    const { email, id_taquilla } = req.body;

    try {


        if (!email || !id_taquilla) {
            console.log('El email y la taquilla son necesarios')
            return res.status(201).json({ message: 'El email y la taquilla son necesarios' })
        }
        //comprobar si el email existe en nuestra base de datos

        const verificar = await prisma.user.findUnique({ where: { email } }) //Aqui busca en la tabla User
        if (!verificar) {
            console.log('El email proporcionado no existe')
            return res.status(401).json({ message: 'El email proporcionado no existe' })
        }

        //comprobar si ese email ya tiene una taquilla reservada y mostrarla si ese es el caso

        const verificarReserva = await prisma.taquilla.findUnique({ where: { email } }) //Aqui busca en la tabla taquilla
        if (verificarReserva) {
            console.log(`El usuario ${verificar.email} ya tiene la taquilla ${verificarReserva.id} reservada`)
            return res.status(401).json({ message: `El usuario ${verificar.email} ya tiene la taquilla ${verificarReserva.id} reservada` })
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

        console.log(`Taquilla ${id_taquilla}, asignada correctamente a ${email}`)
        return res.status(200).json({ message: `Taquilla ${id_taquilla}, asignada correctamente a ${email}` })


    } catch (error) {

        console.error('Ha ocurrido un error al reservar taquilla', error)
        return res.status(500).json({ message: 'Ha ocurrido un error al reservar taquilla', error })

    }




});

app.post('/taquilla-get-mine', verifyToken, async (req, res) => {

    const { email } = req.body;
    const tokenEmail = req.user.email;

    // Verificamos que el token y el email coincidan por seguridad para que solo tu puedas ver tu taquilla
    if (email !== tokenEmail) {
        return res.status(403).json({ message: "No autorizado para ver esta taquilla" });
    }
    try {


        const user = await prisma.taquilla.findUnique({ where: { email } })

        if (!user) {

            console.log(`El usuario: ${email} no tiene taquilla reservada`)
            return res.status(200).json({ message: `El usuario: ${email} no tiene taquilla reservada` })
        }

        const taquilla = user.id;

        console.log(`El usuario ${user.email} tiene reservada la taquilla número: ${user.id}`)
        return res.status(200).json({ message: `El usuario ${user.email} tiene reservada la taquilla número: ${taquilla}` })

    } catch (error) {

        console.error('Se ha producido un error al mostrar la taquilla')
        return res.status(500).json({ message: 'Se ha producido un error al mostrar la taquilla', error })

    }





});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;