import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import LogOutButton from "../components/botonLogout.jsx";

import "../App.css";

function PersonalDashboard() {
  const [open, setOpen] = useState(false);
  const name = localStorage.getItem("userName");
  const email = localStorage.getItem("userEmail");
  const [clases, setClases] = useState([]);
  const [mensajeClase, setMensajeClase] = useState("");
  const [misClases, setMisClases] = useState([]);
  const [unauthorized, setUnauthorized] = useState(false);

  const PORT = import.meta.env.VITE_PORT;

  // Para transformar fecha y hora en algo mas legible
  const soloFecha = (date) => {
    const fechaObj = new Date(date);
    return fechaObj.toLocaleDateString("es-ES");
  };
  const soloHora = (dateTime) => {
    const fechaObj = new Date(dateTime);
    return fechaObj.toLocaleTimeString("es-ES");
  };
  const reservarClase = async (cls) => {
    try {
      const res = await fetch(`http://localhost:${PORT}/apuntarse-clase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, id_Clase: cls.id }),
      });
      const data = await res.json();

      if (res.ok) {
        alert(`Te has apuntado correctamente a la clase: ${cls.name}`);
        window.location.reload();
      } else {
        alert(`Error al apuntarse a la clase: ${data.error}`);
      }
    } catch (error) {
      console.error("Error en el servidor", error);
    }
  };
  const cancelarClase = async (mcls) => {
    try {
      const res = await fetch(`http://localhost:${PORT}/cancelar-clase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, id_Clase: mcls.id_Clase }),
      });
      const data = await res.json();

      if (res.ok) {
        alert(`Has cancelado tu inscripción en la clase: ${mcls.className}`);
        // Recargar las clases apuntadas
        const response = await fetch(
          `http://localhost:${PORT}/get-my-classes`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const newData = await response.json();
        setMisClases(newData.clases);
        setMensajeClase(newData.message);
      } else {
        alert(`Error al cancelar la clase: ${data.error}`);
      }
    } catch (error) {
      console.error("Error en el servidor", error);
    }
  };

  useEffect(() => {
    const fetchClases = async () => {
      try {
        const response = await fetch(`http://localhost:${PORT}/get-class`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setClases(data);
        if (response.status === 401) {
          setUnauthorized(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    const fetchMisClases = async () => {
      try {
        const response = await fetch(
          `http://localhost:${PORT}/get-my-classes`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        setMisClases(data.clases);
        setMensajeClase(data.message);
        if (response.status === 401) {
          setUnauthorized(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchMisClases();

    fetchClases();
  }, []);

  return (
    <>
      <div id="personalDashboard">
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
              <h1>Personal Dashboard</h1>
              <div className="caja-dosColumnas">
                <div className="columna-11">
                  <h2 className="titulo-dashboard">
                    ¡ Bienvenido <span className="nombre-usuario">{name}</span>{" "}
                    !
                  </h2>
                  <h3 className="mensaje-clase">- Tus Próximas clases -</h3>
                  <div className="grid-misClases">
                    <p className="mensaje-clase">{mensajeClase}</p>
                    {misClases.map((mcls) => (
                      <div className="cadaClase" key={mcls.id}>
                        <h3 className="titulo-lista">{mcls.className}</h3>
                        <p className="datos-lista">
                          Fecha:{soloFecha(mcls.time)}
                        </p>
                        <button
                          className="btn-cancelar"
                          onClick={() => {
                            cancelarClase(mcls);
                          }}
                        >
                          Cancelar inscripción
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="columna-12">
                  <h2 className="titulo-dashboard">Clases disponibles</h2>
                  <div className="grid-clases">
                    {clases.map((cls) => (
                      <div
                        key={cls.id}
                        className="cadaClase"
                        onClick={() => {
                          reservarClase(cls);
                        }}
                      >
                        <h3 className="titulo-lista">{cls.name}</h3>
                        <p className="datos-lista">
                          Fecha:{soloFecha(cls.date)}
                        </p>
                        <p className="datos-lista">
                          Horario: {soloHora(cls.startTime)} -{" "}
                          {soloHora(cls.endTime)}
                        </p>
                        <p className="datos-lista">Aforo:{cls.aforo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <LogOutButton />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default PersonalDashboard;
