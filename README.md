# 🏋️‍♂️ Proyecto Fin de Grado – Gym App

Una **aplicación web full‑stack** diseñada como proyecto de fin de grado para gestionar un gimnasio, con funciones de registro y autenticación de usuarios, y la posibilidad de **reservar clases y taquillas** desde una interfaz intuitiva.  
[Repositorio en GitHub](https://github.com/YummyYummy06/ProyectoFinDeGrado2025)

---

## 📌 Descripción

Gym App es una plataforma web desarrollada para gestionar la experiencia de los usuarios de un gimnasio. Permite que los usuarios se registren, inicien sesión y accedan a funcionalidades como:

- Registrar y autenticar usuarios
- Reservar clases disponibles
- Reservar taquillas para uso personal
- Interacción frontend‑backend completa

El proyecto está dividido en **frontend** y **backend**, usando tecnologías modernas de JavaScript para ofrecer una aplicación eficiente y segura.

---

## 🚀 Características principales

- ✨ **Registro y Login seguro** con manejo de contraseñas y tokens.
- 📅 **Reservas de clases** con verificación de disponibilidad.
- 🧳 **Gestión de taquillas** para usuarios registrados.
- 🌐 **Frontend SPA** integrado con el backend.
- 🔐 **Autenticación JWT** y manejo de cookies para sesiones seguras.

---

## 🧱 Tecnologías

### Backend

- **Node.js & Express** – Servidor REST API.
- **@prisma/client** – ORM para interacción con la base de datos (Supabase).
- **bcrypt** – Encriptación de contraseñas.
- **jsonwebtoken** – Generación y verificación de tokens JWT.
- **dotenv** – Gestión de variables de entorno.

### Frontend

- **Gym‑app** – SPA desarrollada con tecnologías web modernas (React/JS/CSS).
- **js‑cookie** – Gestión de cookies desde el cliente.

---

## 📥 Instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/YummyYummy06/ProyectoFinDeGrado2025.git
cd ProyectoFinDeGrado2025
```

### 2. Backend

```bash
cd backend
npm install
```

Crea un archivo .env con tus credenciales y configuración:

```bash
DATABASE_URL=...
JWT_SECRET=...
```

s
Inicia el servidor:

```bash
npm start
```

### 3. Frontend

```bash
cd frontend/Gym-app
npm install
npm start
```
