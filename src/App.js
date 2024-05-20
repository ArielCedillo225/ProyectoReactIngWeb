import { BrowserRouter, Route, Routes } from "react-router-dom";
import EstadoComponente from "./components/EstadoComponente";
import PrestamoComponente from "./components/PrestamoComponente";
import ClienteComponente from "./components/ClienteComponente";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrestamoComponente />}></Route>
        <Route path="/estados" element={<EstadoComponente />}></Route>
        <Route path="/clientes" element={<ClienteComponente />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
