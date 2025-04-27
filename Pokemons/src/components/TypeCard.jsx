import { pokemonTypeColors } from "../utils";

export default function TypeCard(props) {
  const { type } = props;

  // Get the color and background for the given type
  const typeColor = pokemonTypeColors?.[type]?.color || "black"; // Default to black
  const typeBackground = pokemonTypeColors?.[type]?.background || "gray"; // Default to gray

  return (
    <div 
      className="type-tile"
      style={{
        color: typeColor,
        background: typeBackground,
      }}
    >
      <p>{type}</p>
    </div>
  );
}
