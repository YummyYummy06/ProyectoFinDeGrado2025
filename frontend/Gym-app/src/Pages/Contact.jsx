import { Link } from "react-router-dom";
import { useState } from "react";

import "../App.css";

function Contact() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div id="contact">
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
        <div className="contenedor-contacto">
          <div className="columnaContacto">
            <iframe
              className="mapa"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113989.34151499256!2d-4.947392984929788!3d36.500960512875025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd72d809904dabdf%3A0xe6c9db907b5ecab!2sMarbella%2C%20M%C3%A1laga!5e1!3m2!1ses!2ses!4v1765666012519!5m2!1ses!2ses"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="columnaContacto-1">
            <h3 className="info-contacto">WHATSAPP</h3>
            <a className="info-link">+34 633 456 789</a>
            <h3 className="info-contacto">EMAIL</h3>
            <a className="info-link">TheclubBoxingStudioMarbella@gmail.com</a>
            <h3 className="info-contacto">ADRESS</h3>
            <a className="info-link">Av. Fontanilla, 3, Marbella, CP 29601</a>
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

export default Contact;
