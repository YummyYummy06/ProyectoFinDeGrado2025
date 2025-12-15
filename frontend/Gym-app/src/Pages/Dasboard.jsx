import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import "../App.css";

function Dashboard() {
  const PORT = import.meta.env.VITE_PORT;
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [taquillas, setTaquillas] = useState([]);

  const [open, setOpen] = useState(false);
  useEffect(() => {
    fetch(`http://localhost:${PORT}/get-class`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          setUnauthorized(true);
          setLoading(false);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setClases(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err, `Error al obtener clases disponibles`);
        setLoading(false);
      });

    fetch(`http://localhost:${PORT}/get-taquillas`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          setUnauthorized(true);
          setLoading(false);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setTaquillas(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err, `Error al obtener taquillas disponibles`);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div id="Dashboard">
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
        <div className="contenido-dashboard">
          {unauthorized ? (
            <div className="unauthorized-message">
              <h2 className="encabezado">Acceso no permitido</h2>
              <p className="description-1">
                No tienes autorización para acceder a esta página. Por favor,
                inicia sesión.
              </p>
              <Link to="/logIn">
                <button className="btn-login">Ir al Login</button>
              </Link>
            </div>
          ) : (
            <>
              <h2 className="encabezado">Welcome to your Dashboard !</h2>
              <div className="dosColumnas">
                <div className="columnas-dashboard">
                  <h2 className="encabezado-dashboard">Clases disponibles</h2>
                  <div className="classes-grid">
                    {clases.map((cls) => (
                      <div
                        key={cls.id}
                        className="class-card"
                        onClick={() =>
                          alert(`Has seleccionado la clase: ${cls.name}`)
                        }
                      >
                        <h3 className="nombre-clase">{cls.name}</h3>
                        <p className="datos-clases">
                          <strong>Date:</strong> {cls.date}
                        </p>
                        <p className="datos-clases">
                          <strong>Start Time:</strong> {cls.startTime}
                        </p>
                        <p className="datos-clases">
                          <strong>End Time:</strong> {cls.endTime}
                        </p>
                        <p className="datos-clases">
                          <strong>Aforo:</strong> {cls.aforo}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="columnas-dashboard">
                  <h2 className="encabezado-dashboard">
                    Taquillas disponibles
                  </h2>
                  <div className="taquillas-grid">
                    {taquillas.map((taquilla) => (
                      <div
                        key={taquilla.id}
                        className="taquilla-card"
                        onClick={() =>
                          alert(`Has seleccionado la taquilla: ${taquilla.id}`)
                        }
                      >
                        <h3 className="nombre-clase">
                          {" "}
                          Nº de taquilla: {taquilla.id}
                        </h3>
                        <p className="datos-clases">
                          <strong>Ocupada:</strong>{" "}
                          {taquilla.Ocupada ? "Sí" : "No"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
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

export default Dashboard;
