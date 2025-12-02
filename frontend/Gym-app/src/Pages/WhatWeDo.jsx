import { Link } from "react-router-dom";
import { useState } from "react";
import "../App.css";

function WhatWeDo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="WhatWeDo">
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

        <div className="content">
          <h1 className="encabezado">What We Do</h1>
          <h4 className="description">
            We’re committed to providing you with the best training experience.
          </h4>
          <div className="tresColumnas">
            <div className="columnas">
              <Link to="/">
                <img
                  className="imagenColumna"
                  src="/images/sweeting_guy.jpg"
                  alt="sweeting_guy"
                ></img>
              </Link>
            </div>
            <div className="columnas">
              <Link to="/">
                <img
                  className="imagenColumna"
                  src="/images/gym_mancuernas.jpg"
                  alt="gym_mancuernas"
                ></img>
              </Link>
            </div>
            <div className="columnas">
              <Link to="/">
                <img
                  className="imagenColumna"
                  src="/images/weight_lifting.jpg"
                  alt="weight_lifting"
                ></img>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default WhatWeDo;
