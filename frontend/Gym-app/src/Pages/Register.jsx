import { Link } from "react-router-dom";
import { useState } from "react";
import "../App.css";

function Register() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="Register">
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
              <h2>EMAIL</h2>
              <input type="email" placeholder="YourEmail@gmail.com"></input>
              <h2>PASSWORD</h2>
              <input type="password" placeholder="Your password"></input>
              <button className="submit">Register</button>
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
      </div>
    </>
  );
}
export default Register;
