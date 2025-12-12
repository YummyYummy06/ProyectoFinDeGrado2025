


export const validacionUser = (req, res, next) => {

    console.log('Validando usuario en el backend');

    const { username, email, password } = req.body;

    // Aqui vamos a comprobar que el usuario y la contraseña son permitidos

    try {

        if (!username || !password) {
            console.log('Faltan datos de autenticacion'); //Esto me va a avisar en el backend
            return res.status(500).json({ error: 'Usuario y contraseña son requeridos' });
        }

        if (username.length < 3) {

            console.log('El nombre de usuario es demasiado corto');
            return res.status(400).json({ error: 'El nombre de usuario debe tener al menos 3 caracteres' });


        }

        if (password.length < 6) {

            console.log('La contraseña es demasiado corta');
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        if (!email.includes('@gmail.com')) {
            console.log('El email no es válido');
            return res.status(400).json({ error: 'El email no es válido' });
        }

        else {

            console.log('Usuario y contraseña validos');
            next(); // Si todo esta bien, pasamos al siguiente middleware o ruta
        }



    } catch (error) {

        console.error('Error validando usuario:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });

    }


};

export default validacionUser;