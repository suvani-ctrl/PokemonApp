import { Header } from "./components/Header";
import { SideNav } from "./components/SideNav";
import TypeCard from "./components/TypeCard";
import PokeCard from "./components/PokeCard";
import Modal from "./components/Modal";
import { useState } from "react";

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(1);

  return (
    <div id="app-container">
      <SideNav 
        selectedPokemon={selectedPokemon} 
        setSelectedPokemon={setSelectedPokemon} 
      />

      <div className="main-content">
        <Header />

        <PokeCard 
          selectedPokemon={selectedPokemon} 
          setSelectedPokemon={setSelectedPokemon} 
        />
      </div>
    </div>
  );
}

export default App;
