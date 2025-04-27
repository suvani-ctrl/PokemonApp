import { useEffect, useState } from "react";
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import TypeCard from "./TypeCard";
import Modal from "./Modal";

export default function PokeCard({ selectedPokemon }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [skill, setSkill] = useState(null); // for showing move info
  const [loadingSkill, setLoadingSkill] = useState(false); // for loading move info

  const { name, height, abilities, stats, types, moves, sprites } = data || {};

  const imgList = Object.keys(sprites || {})
    .filter((key) => sprites[key] && !["versions", "other"].includes(key))
    .map((key) => sprites[key]);

  async function fetchMoveData(moveName, moveUrl) {
    if (loadingSkill || !localStorage || !moveUrl) return;

    let cache = {};
    if (localStorage.getItem("pokemon-moves")) {
      cache = JSON.parse(localStorage.getItem("pokemon-moves"));
    }

    if (moveName in cache) {
      console.log("Found move in cache");
      setSkill(cache[moveName]);
      return;
    }

    try {
      setLoadingSkill(true);
      const res = await fetch(moveUrl);
      const moveData = await res.json();

      const descriptionObj = moveData?.flavor_text_entries?.find(
        (entry) => entry.version_group?.name === "firered-leafgreen"
      );
      const description = descriptionObj?.flavor_text || "No description found.";

      const moveInfo = {
        name: moveData?.name?.replaceAll("-", " "),
        description,
      };

      setSkill(moveInfo);

      // Save move into localStorage
      cache[moveName] = moveInfo;
      localStorage.setItem("pokemon-moves", JSON.stringify(cache));

    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSkill(false);
    }
  }



  useEffect(() => {
    if (loading) return;
    if (!selectedPokemon || selectedPokemon <= 0) {
      setError("Invalid Pokemon ID");
      return;
    }

    const cachedData = localStorage.getItem("pokedex");
    let cache = cachedData ? JSON.parse(cachedData) : {};

    if (selectedPokemon in cache) {
      setData(cache[selectedPokemon]);
      console.log("Found pokemon in cache");
      return;
    }

    async function fetchPokemonData() {
      setLoading(true);
      setError(null);

      try {
        const url = `https://pokeapi.co/api/v2/pokemon/${getPokedexNumber(selectedPokemon)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error fetching data: ${res.status} ${res.statusText}`);

        const pokemonData = await res.json();
        setData(pokemonData);

        cache[selectedPokemon] = pokemonData;
        localStorage.setItem("pokedex", JSON.stringify(cache));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemonData();
  }, [selectedPokemon, loading]);

  if (loading) return <div><h4>Loading...</h4></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="poke-card">

      {skill && (
        <Modal handleCloseModal={() => setSkill(null)}>
          <div>
            <h6>Name</h6>
            <h2>{skill.name}</h2>
          </div>
          <div>
            <h6>Description</h6>
            <p>{skill.description}</p>
          </div>
        </Modal>
      )}

      <div>
        <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{name}</h2>
      </div>



      <div className="type-container">
        {types?.map((typeObj, index) => (
          <TypeCard key={index} type={typeObj?.type?.name} />
        ))}
      </div>



      <div>
        <img
          className="default-img"
          src={`/pokemon/${getFullPokedexNumber(selectedPokemon)}.png`}
          alt={`${name}-large-img`}
        />
      </div>

      <div className="img-container">
        {imgList.map((url, index) => (
          <img key={index} src={url} alt={`sprite-${index}`} />
        ))}
      </div>



      <h3>Stats</h3>
      <div className="stats-card">
        {stats?.map((statObj, statIndex) => {
          const { stat, base_stat } = statObj;
          return (
            <div key={statIndex} className="stat-item">
              <p>{stat?.name.replaceAll("-", " ")}</p>
              <p>Base Stat: {base_stat}</p>
            </div>
          );
        })}
      </div>


      <h3>Moves</h3>
      <div className="pokemon-move-grid">
        {moves?.map((moveObj, moveIndex) => {
          const moveName = moveObj?.move?.name;
          const moveUrl = moveObj?.move?.url;

          return (
            <button
              className="button-card pokemon-move"
              key={moveIndex}
              onClick={() => {
                fetchMoveData(moveName, moveUrl);
                console.log(`You clicked on ${moveName}`);
              }}
            >
              {moveName?.replaceAll("-", " ")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
