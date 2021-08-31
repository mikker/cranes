import { useState } from "react";
import Picker from "../components/Picker";
import FlatCrane from "../components/FlatCrane";

export default function FlatPage() {
  const [colors, setColors] = useState({
    background: "#FF5B5B",
    color1: "#675EFF",
    color2: "#70DCFF",
    // crane: randomColor(),
    // emissive: randomColor(),
    // directLight: randomColor(),
  });

  return (
    <main className="flex min-h-screen">
      <div className="flex-0 p-2 bg-gray-100 space-y-1 flex flex-col">
        {Object.keys(colors).map((key) => (
        <Picker
          key={key}
          color={colors[key]}
          onChange={(color) => {
          const newColors = { ...colors, [key]: color.hex };
            setColors(newColors);
          }}
          />
          ))}
          <button
        onClick={() => {
            setColors(randomColors(colors));
            }}
          >
            ♻️
          </button>
      </div>

        <div className="flex-1 flex items-center justify-center relative z-0 bg-gray-800">
        <div className="flex-1 w-100 max-w-lg">
          <FlatCrane background={colors.background} color1={colors.color1} color2={colors.color2} />
        </div>
        </div>
    </main>
  );
}

function randomColors(colors) {
  const out = {};
  for (const key in colors) {
    out[key] = randomColor()
  }
  return out;
}

function randomColor() {
  return (
    "#" +
    Math.floor(Math.random() * 2 ** 24)
      .toString(16)
      .padStart(6, "0")
  );
}
