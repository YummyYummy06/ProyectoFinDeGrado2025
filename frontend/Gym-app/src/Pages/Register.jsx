import { Link } from "react-router-dom";
import { useState } from "react";
import "../App.css";

function Register() {
  const PORT = import.meta.env.VITE_PORT;
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleClick = async () => {
    try {
      const respuesta = await fetch(`http://localhost:${PORT}/user-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });
      const data = await respuesta.json();
      console.log("El servidor te manda esta respuesta:", data);
      if (respuesta.ok) {
        console.log("Registro exitoso:", data);
        alert("Registro realizado con éxito!"); // mensaje rápido

        window.location.href = "/logIn";
      } else {
        console.log("Error en el registro");
        alert(`Fallo en el registro: ${data.error}`);
      }
    } catch (error) {
      console.error("Error en el fetch", error);
    }
  };
  return (
    <>
      <div id="Register">
        <header className="header-app">
          <div className="logo-titulo">
            <a href="http://localhost:5173/">
              <img className="header-logo" src="icon2.png" alt="Logo" />
            </a>
            <h1 className="header-titulo">
              <a href="http://localhost:5173/">
                - The Club - Boxing Studio Marbella -
              </a>
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
        <div className="content-Register">
          <h1 className="encabezado">REGISTER</h1>
          <div className="tresColumnas">
            <div className="columnas">
              <h1 className="motivationText">START YOUR</h1>
              <h1 className="motivationText">JOURNEY</h1>
              <h1 className="motivationText">TODAY!</h1>
            </div>
            <div className="columnas-Inputs">
              <h2 className="titulo-campo">USERNAME</h2>
              <input
                type="text"
                placeholder="Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              ></input>
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
                Register
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
export default Register;
