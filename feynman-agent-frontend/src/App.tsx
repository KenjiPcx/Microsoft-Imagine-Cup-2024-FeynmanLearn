import { useState } from "react";
import duck from "./assets/duck-gpt-trans.png";
import "./App.css";

function App() {
  const [msg, setMsg] = useState("Hello world");
  return (
    <>
      <p>{msg}</p>
      <img alt="duck" src={duck} />
    </>
  );
}

export default App;
