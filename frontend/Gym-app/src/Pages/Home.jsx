import { Link } from "react-router-dom";
import { useState } from "react";

import "../App.css";

function Home() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="App" id="inicio">
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
        <div className="pagina">
          <h1 className="slogan">SHAPE YOUR STORY</h1>
          <h3 className="subSlogan">- OWN YOUR JOURNEY -</h3>
          <Link to="/register" className="btn-Join">
            JOIN TODAY!
          </Link>
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
export default Home;
