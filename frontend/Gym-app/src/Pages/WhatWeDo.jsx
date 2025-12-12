import { Link } from "react-router-dom";
import { useState } from "react";
import "../App.css";

function WhatWeDo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div id="#top" className="WhatWeDo">
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
        <div className="content">
          <div className="tresColumnas">
            <div className="columnas-info">
              <h1 className="encabezado-2"> THE CLUB - TEAM</h1>
              <h4 className="description-2">
                The Club Boxing Studio was founded in Marbella in 2025 with the
                passion of a dedicated team committed to transforming the way
                people train.
              </h4>
              <h4 className="description-2">
                At The Club, we believe that every punch, every workout, and
                every day is an opportunity to push yourself further and build
                your best version.
              </h4>
            </div>
            <div className="columnas">
              <img
                className="imagenColumna-foto1"
                src="/images/workout1.png"
                alt="workout1"
              ></img>
            </div>
            <div className="columnas">
              <img
                className="imagenColumna-foto2"
                src="/images/workout2.png"
                alt="workout2"
              ></img>
            </div>
          </div>
        </div>
        <div className="content">
          <h1 className="encabezado">BEYOND THE RING</h1>
          <div className="tresColumnas">
            <div className="columnas2">
              <img
                className="imagenColumna2"
                src="/images/parking.png"
                alt="Parking"
              ></img>
              <h4 className="description-3">
                We offer convenient on-site parking so you can arrive, train,
                and leave without stress. Your workout should start easy — from
                the moment you park.
              </h4>
              <h3 className="subtittle">Parking</h3>
            </div>
            <div className="columnas2">
              <img
                className="imagenColumna2"
                src="/images/lockers.png"
                alt="Lockers"
              ></img>
              <h4 className="description-3">
                Keep your belongings safe and secure in our modern locker area.
                Train with peace of mind knowing your gear is well taken care
                of.
              </h4>
              <h3 className="subtittle">Lockers</h3>
            </div>
            <div className="columnas2">
              <img
                className="imagenColumna2"
                src="/images/cafe.png"
                alt="Café"
              ></img>
              <h4 className="description-3">
                Recharge before or after your session in our cozy café. Enjoy
                healthy snacks, fresh drinks, and a space to connect with
                others.
              </h4>
              <h3 className="subtittle">Cafe</h3>
            </div>
          </div>
        </div>
        <a href="#top" class="bttop">
          Back to Top
        </a>
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
export default WhatWeDo;
