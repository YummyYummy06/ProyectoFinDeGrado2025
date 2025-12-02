import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import WhatWeDo from "./Pages/WhatWeDo.jsx";
import Register from "./Pages/Register.jsx";
import LogIn from "./Pages/LogIn.jsx";
import Contact from "./Pages/Contact.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/WhatWeDo" element={<WhatWeDo />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<LogIn />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
      </Routes>
    </>
  );
}

export default App;
