import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import validacionUser from './src/components/AuthValidation.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();


//Middleware
app.use(express.json());


// Definicion de endpoints

app.get('/', (req, res) => {
    res.send('Welcome to ElGymApp Backend!');
});


app.get('/users', async (req, res) => {
    try {

        const users = await prisma.user.findMany(); // El mapeo lo hace en letra minuscula, este es el nombre de la tabla en el modelo en schema.prisma
        res.json(users);
    }
    catch (error) {
        console.error('Error listando a users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

app.post('/register', validacionUser, async (req, res) => {

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



app.post('/login', validacionUser, async (req, res) => {

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

        console.log('Login exitoso para el usuario:', user);
        res.json(`El usuario ${user.name} ha iniciado sesión con éxito`);
    }
    catch (error) {

        console.error('Error en login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }


});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;