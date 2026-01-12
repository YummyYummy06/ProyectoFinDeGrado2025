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
  const [mensajeTaquilla, setMensajeTaquilla] = useState("");
  const [misClases, setMisClases] = useState([]);
  const [unauthorized, setUnauthorized] = useState(false);

  const API_URL = import.meta.env.VITE_URL_FETCH;

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
      const res = await fetch(`${API_URL}/apuntarse-clase`, {
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
      const res = await fetch(`${API_URL}/cancelar-clase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, id_Clase: mcls.id_Clase }),
      });
      const data = await res.json();

      if (res.ok) {
        alert(`Has cancelado tu inscripción en la clase: ${mcls.className}`);
        // Recargar las clases apuntadas
        const response = await fetch(`${API_URL}/get-my-classes`, {
          method: "GET",
          credentials: "include",
        });
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

  // Cargar taquillas disponibles
  const [taquillas, setTaquillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadTaquillas = () => {
    fetch(`${API_URL}/get-taquillas`, {
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
  };
  const reservarTaquilla = async (taquilla) => {
    try {
      const res = await fetch(`${API_URL}/taquilla-reservar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, id_taquilla: taquilla.id }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Taquilla reservada con éxito: ${data.message}`);
        loadTaquillas(); // Recargar taquillas para mostrar cambios
      } else {
        alert(`Error al reservar taquilla: ${data.message}`);
      }
    } catch (error) {
      console.error("Error en el servidor", error);
      alert("Error en el servidor", error);
    }
  };
  const verMiTaquilla = async () => {
    try {
      const res = await fetch(`${API_URL}/taquilla-get-mine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMensajeTaquilla(data.message);
      } else {
        alert(`Error al ver tu taquilla: ${data.message}`);
      }
    } catch (error) {
      console.error("Error en el servidor", error);
      alert("Error en el servidor", error);
    }
  };

  useEffect(() => {
    const fetchClases = async () => {
      try {
        const response = await fetch(`${API_URL}/get-class`, {
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
        const response = await fetch(`${API_URL}/get-my-classes`, {
          method: "GET",
          credentials: "include",
        });
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
    loadTaquillas();
  }, []);

  return (
    <>
      <div id="personalDashboard">
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
        <div className="content">
          {unauthorized ? (
            <div className="unauthorized-message">
              <h2 className="encabezado">Access Denied</h2>
              <p className="description-1">
                You dont have permission to access this page. Please log in.
              </p>
              <Link to="/logIn">
                <button className="btn-login">Return to Login</button>
              </Link>
            </div>
          ) : (
            <>
              <h1>Personal Dashboard</h1>
              <div className="caja-dosColumnas">
                <div className="columna-11">
                  <h2 className="titulo-dashboard">
                    ¡ Welcome <span className="nombre-usuario">{name}</span> !
                  </h2>
                  <h3 className="mensaje-clase">- Your Next Classes -</h3>
                  <div className="grid-misClases">
                    <p className="mensaje-clase">{mensajeClase}</p>
                    {misClases.map((mcls) => (
                      <div className="cadaClase" key={mcls.id}>
                        <h3 className="titulo-lista">{mcls.className}</h3>
                        <p className="datos-lista">
                          Date:{soloFecha(mcls.time)}
                        </p>
                        <button
                          className="btn-cancelar"
                          onClick={() => {
                            cancelarClase(mcls);
                          }}
                        >
                          Cancel Class
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="columna-12">
                  <h2 className="titulo-dashboard">Available classes</h2>
                  <p className="texto">
                    Click on the classes you want to register
                  </p>
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
                          Date:{soloFecha(cls.date)}
                        </p>
                        <p className="datos-lista">
                          Horario: {soloHora(cls.startTime)} -{" "}
                          {soloHora(cls.endTime)}
                        </p>
                        <p className="datos-lista">Capacity:{cls.aforo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="columnas-dashboard">
                <h2 className="titulo-dashboard">Available Lockers</h2>
                <div className="taquillas-flex">
                  {taquillas.map((taquilla) => (
                    <div
                      key={taquilla.id}
                      className="cadaClase"
                      onClick={() => {
                        reservarTaquilla(taquilla);
                      }}
                    >
                      <h3 className="titulo-lista">Locker nº: {taquilla.id}</h3>
                      <p className="datos-clases">
                        <strong>Available:</strong>{" "}
                        {taquilla.Ocupada ? "No" : "Yes"}
                      </p>
                    </div>
                  ))}
                </div>
                <h2 className="mensaje-clase">Wich is my Locker?</h2>
                <button className="btn-taquilla" onClick={verMiTaquilla}>
                  View My Locker
                </button>
                <p>{mensajeTaquilla}</p>
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
