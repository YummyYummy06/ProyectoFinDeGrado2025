import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
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



//Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json());
app.use(cookieParser());
app.use("/", googleAuthRoutes);
app.use("/", calendarRoutes);



// Definicion de endpoints

app.get('/', (req, res) => {
    res.send('Welcome to ElGymApp Backend!');
});



// Usuario

app.get('/get-users', handleUsuario.verUsuarios);

app.post('/user-register', validacionUser, handleUsuario.registrarUsuario);

app.post('/user-login', handleUsuario.logearUsuario);

app.post('/user-logout', handleUsuario.logOutUsuario);

app.delete('/user-delete-one', handleUsuario.eliminarUnUsuario);

app.delete('/user-delete-all', handleUsuario.eliminarTodosUsuarios);

// Clase

app.get('/get-class', verifyToken, handleClase.verClases);

app.post('/create-class', handleClase.crearClase);

app.put('/edit-class/:id', handleClase.editarClase);

app.post('/apuntarse-clase', apuntarse.apuntarseAunaClase);

app.delete('/delete-class/:id', handleClase.deleteClase);

// Taquilla

app.get('/get-taquillas', handleTaquilla.verTaquillas);

app.put('/taquilla-reservar', handleTaquilla.reservarTaquilla);

app.put('/taquilla-cancelarReserva', handleTaquilla.cancelarReserva);

app.post('/taquilla-get-mine', verifyToken, handleTaquilla.verMiTaquilla);


// Para evitar que el servidor se levante cuando se ejecuten los test

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}


export default app;