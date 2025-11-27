import "../App.css";

function Home() {
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
                <a href="../src/Pages/Register.jsx">Resgister</a>
              </li>
              <li>
                <a>Log In</a>
              </li>
            </ul>
          </menu>
        </header>
        <div className="pagina">
          <h1 className="slogan">SHAPE YOUR STORY</h1>
          <h3 className="subSlogan">- OWN YOUR JOURNEY -</h3>
          <button className="btn">JOIN TODAY !</button>
        </div>
      </div>
    </>
  );
}
export default Home;
