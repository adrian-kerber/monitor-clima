import { useState } from "react";
import WeatherPanel from "./components/WeatherPanel";
import "./index.css";

// Função para mapear condições climáticas para classes CSS
const normalizeCondition = (condition) => {
  const map = {
    Clear: "clear",
    Clouds: "clouds",
    Rain: "rain",
    Drizzle: "drizzle",
    Mist: "mist",
    Fog: "fog",
    Snow: "snow",
    Thunderstorm: "rain", // tratamos como chuva
  };
  return map[condition] || "default";
};

function App() {
  const [city, setCity] = useState(() => localStorage.getItem("lastCity") || "");
  const [input, setInput] = useState("");
  const [weatherCondition, setWeatherCondition] = useState(""); // para controle do fundo

  const handleSearch = () => {
    if (input.trim() !== "") {
      setCity(input);
      localStorage.setItem("lastCity", input);
    }
  };

  return (
    <div className={`app ${normalizeCondition(weatherCondition)}`}>
      <h1>🌤️ Monitor de Clima Rural</h1>
      <div className="search">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite a cidade ou coordenadas"
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>
      {city && <WeatherPanel city={city} setCondition={setWeatherCondition} />}
    </div>
  );
}

export default App;
