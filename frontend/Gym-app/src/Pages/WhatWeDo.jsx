import { Link } from "react-router-dom";
import "../App.css";

function WhatWeDo() {
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
          <menu className="menu-app">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/WhatWeDo">About Us</Link>
              </li>
              <li>
                <a>Contact</a>
              </li>
              <li>
                <a>Resgister</a>
              </li>
              <li>
                <a>Log In</a>
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
            <div className="columna1">
              <img
                className="imagenColumna"
                src="/images/sweeting_guy.jpg"
                alt="sweeting_guy"
              ></img>
            </div>
            <div className="columna2">
              <img
                className="imagenColumna"
                src="/images/gym_mancuernas.jpg"
                alt="gym_mancuernas"
              ></img>
            </div>
            <div className="columna3">
              <img
                className="imagenColumna"
                src="/images/weight_lifting.jpg"
                alt="weight_lifting"
              ></img>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default WhatWeDo;
