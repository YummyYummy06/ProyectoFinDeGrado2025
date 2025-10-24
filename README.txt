Este es mi proyecto de fin de grado, en el que voy a crear una app web de un gimnasio 
en la que se puedadn registrar y logear usuarios, ademas de reservar clases y taquillas

// El repositorio se puede descargar desde 

https://github.com/YummyYummy06/ProyectoFinDeGrado2025


1.- Dependencias usadas:

        - dotenv                ------->   Para poder tener constantes ocultas y seguras.
        - @prisma/client        ------->   Para mapear las tablas con base de datos en supabase (supabase tiene sus propias librerias, pero vamos a crear las nuestras).
        - bcrypt                ------->   Para encriptar las contraseñas (Inicio de sesion y JWT).
        - express               ------->   Para hacer peticiones GET, POST, PUT Y DELETE.
        - jsonwebtoken          ------->   Para generar tokens.
        - js-cookie             ------->   Para enviar el token y poder acceder a rutas protegidas.



2.- 