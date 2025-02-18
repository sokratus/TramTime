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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-red-600 p-4 rounded-lg bg-red-50 border border-red-200">{error}</div>
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
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${activeTab === "lidl" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          onClick={() => setActiveTab("lidl")}
        >
          Towards Lidl
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${activeTab === "frankfurter" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
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
            <div key={index} className={`p-4 mb-4 rounded-lg border ${new Date(departure.when).getTime() < now.getTime() ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-primary">Tram {departure.line.name}</h2>
                  <h3 className="text-gray-600 text-sm">{departure.direction}</h3>
                </div>
                <div className="text-right">
                  <span className="text-lg font-medium text-gray-800">
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
                      return `${isPast ? "" : "In "}${diffMinutes}m ${diffSeconds}s${isPast ? " ago" : ""}`;
                    })()}
                  </span>
                  <div className="text-sm text-gray-500">
                    {(() => {
                      const departureTime = new Date(departure.when);
                      return `${departureTime.getHours().toString().padStart(2, "0")}:${departureTime.getMinutes().toString().padStart(2, "0")}`;
                    })()}
                  </div>
                </div>
              </div>
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
