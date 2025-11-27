import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import WhatWeDo from "./Pages/WhatWeDo.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/WhatWeDo" element={<WhatWeDo />}></Route>

        {/*

        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>


        */}
      </Routes>
    </>
  );
}

export default App;
