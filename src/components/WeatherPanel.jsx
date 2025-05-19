import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API_KEY = "e3573887622458feb65521ff3fe93d76"; // substitua com sua chave real

const agroTips = {
  Clear: "☀️ Dia ideal para aplicação de defensivos e secagem natural.",
  Clouds: "☁️ Dia nublado: boa temperatura para manejo de solo e irrigação.",
  Rain: "🌧️ Evite pulverizações. Verifique drenagem e áreas alagadas.",
  Drizzle: "🌦️ Atenção com operações de campo: risco de solo encharcado.",
  Thunderstorm: "⛈️ Chuva intensa prevista — evite entrada de máquinas.",
  Snow: "❄️ Proteja mudas e estruturas sensíveis ao frio.",
  Mist: "🌫️ Visibilidade reduzida — evite colheita e trânsito de máquinas.",
  Fog: "🌁 Neblina: cuidado com colheita e logística no campo.",
  default: "ℹ️ Sem recomendação específica para o clima atual.",
};

function WeatherPanel({ city, setCondition }) {
  const [weather, setWeather] = useState(null);
  const [conditionMain, setConditionMain] = useState("");

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
        );
        const data = await res.json();
        if (data.cod === "200") {
          setWeather(data);
          const currentCondition = data.list[0].weather[0].main;
          setConditionMain(currentCondition);
          setCondition(currentCondition);
        } else {
          setWeather(null);
          setCondition("default");
        }
      } catch (err) {
        console.error("Erro ao buscar clima:", err);
        setCondition("default");
      }
    }

    fetchWeather();
  }, [city, setCondition]);

  if (!weather) return <p>Carregando ou cidade não encontrada...</p>;

  const now = weather.list[0];
  const nextDays = weather.list.filter((_, i) => i % 8 === 0).slice(1, 6);

  const agroMessage = agroTips[conditionMain] || agroTips.default;

  const handleExportPDF = async () => {
  const element = document.querySelector(".weather-panel");

  if (!element) return;

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [canvas.width, canvas.height + 100],
  });

  pdf.setFont("Helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text("Relatório Climático da Fazenda", 30, 40);
  pdf.setFontSize(12);
  pdf.text(`Cidade: ${weather.city.name}`, 30, 60);
  pdf.text(`Data: ${new Date().toLocaleString("pt-BR")}`, 30, 80);

  pdf.addImage(imgData, "PNG", 30, 100, canvas.width * 0.9, canvas.height * 0.9);

  pdf.save(`clima-${weather.city.name.toLowerCase()}.pdf`);
};


  return (
    <div className="weather-panel">
      <h2>Agora em {weather.city.name}</h2>
      <img
        src={`https://openweathermap.org/img/wn/${now.weather[0].icon}@2x.png`}
        alt="Ícone do clima"
      />
      <p>
        🌡️ {now.main.temp}°C | 💧 {now.main.humidity}% | 🌬️ {now.wind.speed} km/h
      </p>
      <p>{now.weather[0].description}</p>

      {/* Mensagem agrícola */}
      <p style={{ marginTop: "10px", fontStyle: "italic" }}>{agroMessage}</p>

        <button onClick={handleExportPDF} style={{
  marginTop: "15px",
  padding: "10px 20px",
  backgroundColor: "#2196f3",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
}}>
  📤 Exportar PDF
</button>


      <h3>📅 Previsão para os próximos dias</h3>
      <ul>
        {nextDays.map((item, index) => (
          <li key={index}>
            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt="Ícone previsão"
              style={{ verticalAlign: "middle", width: "40px", marginRight: "10px" }}
            />
            {new Date(item.dt * 1000).toLocaleDateString()} - {item.main.temp}°C - {item.weather[0].description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WeatherPanel;
