import { Link } from "react-router-dom";
import { useState } from "react";

import "../App.css";

function LogOutButton() {
  const PORT = import.meta.env.VITE_PORT;

  const handleLogout = () => {
    fetch(`http://localhost:${PORT}/user-logout`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          // Limpiar el almacenamiento local
          localStorage.removeItem("userName");
          localStorage.removeItem("userEmail");
          alert("Sesión cerrada correctamente");
          // Redirigir al usuario a la página de inicio de sesión
          window.location.href = "/login";
        } else {
          console.error("Error al cerrar sesión");
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud de cierre de sesión", error);
      });
  };

  return (
    <>
      <button className="btn-logout" onClick={handleLogout}>
        Log Out
      </button>
    </>
  );
}

export default LogOutButton;
