import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import validacionUser from './src/components/AuthValidation.js';
import handleClase from './src/components/Clase.js';
import handleTaquilla from "./src/components/Taquilla.js";
import handleUsuario from "./src/components/Usuario.js";
import apuntarse from './src/components/Apuntarse.js'
import cookieParser from 'cookie-parser';
import { verifyToken } from './src/components/VerifyToken.js';
import googleAuthRoutes from "./src/routes/GoogleAuth.js";
import calendarRoutes from "./src/routes/Calendar.js";





dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();


//Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/", googleAuthRoutes);
app.use("/", calendarRoutes);


// Definicion de endpoints

app.get('/', (res) => {
    res.send('Welcome to ElGymApp Backend!');
});

app.get('/get-users', handleUsuario.verUsuarios);

app.post('/user-register', validacionUser, handleUsuario.registrarUsuario);

app.post('/user-login', handleUsuario.logearUsuario);

app.post('/user-logout', handleUsuario.logOutUsuario);

app.delete('/user-delete-one', handleUsuario.eliminarUnUsuario);

app.delete('/user-delete-all', handleUsuario.eliminarTodosUsuarios);

app.get('/get-class', handleClase.verClases);

app.post('/create-class', handleClase.crearClase);

app.put('/edit-class/:id', handleClase.editarClase);

app.post('/apuntarse-clase', apuntarse.apuntarseAunaClase);

app.delete('/delete-class/:id', handleClase.deleteClase);

app.get('/get-taquillas', handleTaquilla.verTaquillas);

app.put('/taquilla-reservar', handleTaquilla.reservarTaquilla);



/* 
app.put('/taquilla-desreservar', async (req, res) => {

    const { id_taquilla } = req.body;

    const id_taquilla_num = parseInt(id_taquilla, 10);

    try {
        if (!id_taquilla_num) {
            console.log('El id es necesario');
            return res.status(400).json({ message: 'El id es necesario' });
        }

        const taquillaObjeto = await prisma.taquilla.findUnique({
            where: { id: id_taquilla_num }
        });

        if (!taquillaObjeto) {
            console.log('Id de taquilla no encontrado');
            return res.status(404).json({ message: 'Id de taquilla no encontrado' });
        }

        // Si quieres eliminar el usuario asociado, suponiendo que hay una relación 1:1
        await prisma.user.delete({
            where: { id: taquillaObjeto.id } // Ajusta según tu esquema
        });

        // Actualizamos la taquilla
        const taquillaUpdated = await prisma.taquilla.update({
            where: { id: id_taquilla_num },
            data: {
                email: null,
                User: null,
                Ocupada: false
            }
        });

        return res.status(200).json(taquillaUpdated);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del servidor' });
    }


});
*/




app.post('/taquilla-get-mine', verifyToken, handleTaquilla.verMiTaquilla);




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;