import { useState } from "react";
import { first151Pokemon } from "../utils";
import "../index.css";
import "../fanta.css";

export function SideNav({ selectedPokemon, setSelectedPokemon }) {
  const [searchValue, setSearchValue] = useState("");


  const filteredPokemon = first151Pokemon.filter((pokemon) =>
    pokemon.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <nav>
      <div className="header">
        <h1 className="text-gradient">Pokemon</h1>
      </div>

      <div>
        <input
          placeholder="Search for Pokemons"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <div className="pokemon-list">
        {filteredPokemon.map((pokemon, pokemonIndex) => (
          <button
            key={pokemon}
            onClick={() => {
              // Find real index in first151Pokemon, not filtered list
              const realIndex = first151Pokemon.indexOf(pokemon);
              setSelectedPokemon(realIndex);
            }}
            className={first151Pokemon.indexOf(pokemon) === selectedPokemon ? "nav-card nav-card-selected" : "nav-card"}
          >
            <p>{pokemon}</p>
          </button>
        ))}
      </div>
    </nav>
  );
}
