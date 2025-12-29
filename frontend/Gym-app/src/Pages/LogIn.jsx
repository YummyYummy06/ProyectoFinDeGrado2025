import { Link } from "react-router-dom";
import { useState } from "react";

import "../App.css";

function LogIn() {
  const PORT = import.meta.env.VITE_PORT;
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const handleClick = async () => {
    try {
      const respuesta = await fetch(`http://localhost:${PORT}/user-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await respuesta.json();
      console.log("El servidor te manda esta respuesta:", data);
      if (respuesta.ok) {
        console.log("Log In exitoso:", data);
        alert(`Autenticación realizada con éxito!, Bienvenido ${data.message}`); // mensaje rápido
        localStorage.setItem("userEmail", data.email); // guardar email en localStorage
        localStorage.setItem("userName", data.name);
        window.location.href = "/personal-dashboard"; // redirigir al usuario al Dashboard
      } else {
        console.error(`Error en el login: ${data.error}`);
        alert(`Fallo en el login: ${data.error}`);
      }
    } catch (error) {
      console.error("Error en el fetch", error);
    }
  };

  return (
    <>
      <div id="LogInPage">
        <header className="header-app">
          <div className="logo-titulo">
            <Link to="/">
              <img className="header-logo" src="icon2.png" alt="Logo" />
            </Link>
            <h1 className="header-titulo">
              <Link to="/">- The Club - Boxing Studio Marbella -</Link>
            </h1>
          </div>
          {/* Botón hamburguesa (solo aparece en móvil) */}
          <button className="hamburger" onClick={() => setOpen(!open)}>
            ☰
          </button>
          <menu className={`menu-app ${open ? "open" : ""}`}>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/WhatWeDo">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/logIn">Log In</Link>
              </li>
            </ul>
          </menu>
        </header>
        <div className="content-Login">
          <h1 className="encabezado">LOG IN</h1>
          <div className="tresColumnas">
            <div className="columnas">
              <h1 className="motivationText">START YOUR</h1>
              <h1 className="motivationText">JOURNEY</h1>
              <h1 className="motivationText">TODAY!</h1>
            </div>
            <div className="columnas-Inputs">
              <h2 className="titulo-campo">EMAIL</h2>
              <input
                type="email"
                placeholder="YourEmail@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              <h2 className="titulo-campo">PASSWORD</h2>
              <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              <button className="submit" onClick={handleClick}>
                Log In
              </button>
            </div>
            <div className="columnas">
              <img
                className="imagenColumna-logo"
                src="/icon2.png"
                alt="Brand-Logo"
              ></img>
            </div>
          </div>
        </div>
        <footer className="footer-app">
          <div className="tresColumnas">
            <div className="columnas">
              <h1>ADRESS</h1>
              <p>Av. Fontanilla, 3, Marbella, CP 29601</p>
            </div>
            <div className="columnas">
              <h1>EMAIL</h1>
              <p>TheClubBoxingStudio@gmail.com</p>
            </div>
            <div className="columnas">
              <h1>PHONE</h1>
              <p>+34 634 564 345</p>
            </div>
          </div>
          <div className="link-info">
            <Link to="/">Home</Link>
            <Link to="/WhatWeDo">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/register">Register</Link>
            <Link to="/logIn">Log In</Link>
          </div>
        </footer>
      </div>
    </>
  );
}

export default LogIn;
