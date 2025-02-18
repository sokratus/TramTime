import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

type Direction = "lidl" | "frankfurter";

interface Departure {
  when: string;
  line: {
    name: string;
    mode: string;
  };
  direction: string;
}

const isTowardsLidl = (direction: string): boolean => {
  const lidlDirections = [
    "Wedding",
    "Virchow-Klinikum",
    "S+U Lichtenberg/Gudrunstraße",
  ];
  return lidlDirections.some((d) => direction.includes(d));
};

function App() {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [activeTab, setActiveTab] = useState<Direction>("lidl");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  const fetchDepartures = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://v6.bvg.transport.rest/stops/900120542/departures?duration=30&line=21"
      );
      console.log("API Response:", response.data);
      const departuresData = response.data.departures || [];
      console.log("Departures Data:", departuresData);
      setDepartures(departuresData);
      setError("");
    } catch (err) {
      setError("Failed to fetch departure times. Please try again later.");
      console.error("Error fetching departures:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartures();
    const fetchInterval = setInterval(fetchDepartures, 60000); // Refresh every minute
    const timeInterval = setInterval(() => setNow(new Date()), 1000); // Update time every second
    return () => {
      clearInterval(fetchInterval);
      clearInterval(timeInterval);
    };
  }, []);

  if (loading) {
    return (
      <div className="app">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">{error}</div>
      </div>
    );
  }

  const filteredDepartures = departures.filter((departure) =>
    activeTab === "lidl"
      ? isTowardsLidl(departure.direction)
      : !isTowardsLidl(departure.direction)
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 font-sans bg-white min-h-screen">
      <h1 className="text-2xl md:text-3xl text-gray-800 text-center mb-8 font-bold">
        Next Tram from Forckenbeckplatz
      </h1>
      <div className="tabs">
        <button
          className={`tab ${activeTab === "lidl" ? "active" : ""}`}
          onClick={() => setActiveTab("lidl")}
        >
          Towards Lidl
        </button>
        <button
          className={`tab ${activeTab === "frankfurter" ? "active" : ""}`}
          onClick={() => setActiveTab("frankfurter")}
        >
          Towards Frankfurter Tor
        </button>
      </div>
      <div className="departures shadow-lg">
        {filteredDepartures.length === 0 ? (
          <p className="text-center text-gray-600">
            No departures found in the next 30 minutes
          </p>
        ) : (
          filteredDepartures.map((departure, index) => (
            <div key={index} className={`departure-item ${new Date(departure.when).getTime() < now.getTime() ? 'past' : ''}`}>
              <div className="departure-header">
                <h2 className="tram-number">Tram {departure.line.name}</h2>
                <h3 className="destination">{departure.direction}</h3>
              </div>
              <span className="time">
                {(() => {
                  const departureTime = new Date(departure.when);
                  const diffMs = departureTime.getTime() - now.getTime();
                  const diffMinutes = Math.floor(
                    Math.abs(diffMs) / (1000 * 60)
                  );
                  const diffSeconds = Math.floor(
                    (Math.abs(diffMs) % (1000 * 60)) / 1000
                  );
                  const hours = departureTime
                    .getHours()
                    .toString()
                    .padStart(2, "0");
                  const minutes = departureTime
                    .getMinutes()
                    .toString()
                    .padStart(2, "0");
                  const isPast = diffMs < 0;
                  return `${
                    isPast ? "" : "In "
                  }${diffMinutes}m ${diffSeconds}s${
                    isPast ? " ago" : ""
                  } (${hours}:${minutes})`;
                })()}
              </span>
            </div>
          ))
        )}
      </div>
      <button
        onClick={fetchDepartures}
        className="block mx-auto px-6 py-3 bg-gradient-primary from-primary to-primary-dark text-white rounded-lg hover:from-primary-dark hover:to-primary transition-all duration-200 shadow-md mt-6"
      >
        Refresh
      </button>
    </div>
  );
}

export default App;
