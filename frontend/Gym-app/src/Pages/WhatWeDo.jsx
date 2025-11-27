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
                <a>Home</a>
              </li>
              <li>
                <a>About Us</a>
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
            <div className="columna1"></div>
            <div className="columna2"></div>
            <div className="columna3"></div>
          </div>
        </div>
      </div>
    </>
  );
}
export default WhatWeDo;
