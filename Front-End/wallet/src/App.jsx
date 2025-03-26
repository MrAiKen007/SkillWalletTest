import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Inicio from "./page/Inicio";
import Contas from "./page/Contas";
import Registra from "./page/Registra";
import ChaveR from "./page/ChaveR";
import Entra from "./page/Entra";
import ChaveE from "./page/ChaveE";
import ChaveRC from "./page/ChaveRC";
import ChaveEC from "./page/ChaveEC";
import Wallet from "./page/Wallet";
import Historico from "./page/Historico";
import Configuracao from "./page/Configuracao";
import Enviar from "./page/Enviar";
import ConfEnviar from "./page/ConfEnviar";
import Receber from "./page/Receber";
import Deposito from "./page/Deposito";
import Endereco from "./page/Endereco";
import Investimento from "./page/Investimento";
import Tokenlist from "./page/Tokenlist";
import TokenView from "./page/TokenView";
import TokenC from "./page/TokenC";
import TokenADM from "./page/TokenADM";
import React from "react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/contas" element={<Contas />} />
        <Route path="/registra" element={<Registra />} />
        <Route path="/chaves_semente_registra" element={<ChaveR />} />
        <Route path="/Entra" element={<Entra />} />
        <Route path="/chave_semente_entra" element={<ChaveE />} />
        <Route path="/chave_semente_entra_confirmado" element={<ChaveEC />} />
        <Route path="/chave_semente_registra_confirmado" element={<ChaveRC />} />
        <Route path="/Wallet" element={<Wallet />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/configure" element={<Configuracao />} />
        <Route path="/enviar" element={<Enviar />} />
        <Route path="/confirma_envia" element={<ConfEnviar />} />
        <Route path="/receber" element={<Receber />} />
        <Route path="/depositar" element={<Deposito />} />
        <Route path="/endereco" element={<Endereco />} />
        <Route path="/investimento" element={<Investimento />} />
        <Route path="/tokenlist" element={<Tokenlist />} />
        <Route path="/tokenview/:id" element={<TokenView />} />
        <Route path="/token/:id" element={<TokenC />} />
        <Route path="/tokenadm" element={<TokenADM />} />
        <Route path="*" element={<h1>404 | Página não encontrada</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
