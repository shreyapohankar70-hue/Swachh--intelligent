import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup,Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


const highIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});

const mediumIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
  iconSize: [32, 32],
});

const lowIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
});
const gvpData = [
  {
    id: "GVP-001",
    position: [21.1458, 79.0882],
    risk: "HIGH",
    waste: 85,
    complaints: 14,
    delay: 2,
  },
  {
    id: "GVP-002",
    position: [21.1525, 79.0810],
    risk: "MEDIUM",
    waste: 55,
    complaints: 7,
    delay: 1,
  },
  {
    id: "GVP-003",
    position: [21.1380, 79.0950],
    risk: "LOW",
    waste: 25,
    complaints: 2,
    delay: 0,
  },
  {
    id: "GVP-004",
    position: [21.1580, 79.1050],
    risk: "HIGH",
    waste: 95,
    complaints: 18,
    delay: 3,
  },
  {
    id: "GVP-005",
    position: [21.1320, 79.0750],
    risk: "MEDIUM",
    waste: 60,
    complaints: 8,
    delay: 1,
  },
];
function calculateGvpScore(gvp) {
  return (
    gvp.waste * 0.4 +
    gvp.complaints * 2 +
    gvp.delay * 10
  );
}
function getRiskLevel(score) {
  if (score >= 70) {
    return "HIGH";
  }

  if (score >= 40) {
    return "MEDIUM";
  }

  return "LOW";
}

function App() {
  const highRiskCount = gvpData.filter(
  (gvp) => getRiskLevel(calculateGvpScore(gvp)) === "HIGH"
).length;

const mediumRiskCount = gvpData.filter(
  (gvp) => getRiskLevel(calculateGvpScore(gvp)) === "MEDIUM"
).length;

const lowRiskCount = gvpData.filter(
  (gvp) => getRiskLevel(calculateGvpScore(gvp)) === "LOW"
).length;
  const vehicleIcon = L.divIcon({
    html: '<span style="font-size:32px;">🚛</span>',
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
  const route = [
  [21.1500, 79.0900],
  [21.1520, 79.0930],
  [21.1550, 79.0960],
  [21.1580, 79.1000],
];

const [vehiclePosition, setVehiclePosition] = useState(route[0]);

useEffect(() => {
  let index = 0;

  const interval = setInterval(() => {
    index = (index + 1) % route.length;
    setVehiclePosition(route[index]);
  }, 2000);

  return () => clearInterval(interval);
}, []);
  return (
    <>
      <h1>Swachh Intelligence</h1>
      <div
  style={{
    display: "flex",
    gap: "15px",
    padding: "15px",
    flexWrap: "wrap",
  }}
>
  <div>
    🔴 <b>High Risk:</b> 2
  </div>

  <div>
    🟠 <b>Medium Risk:</b> 2
  </div>

  <div>
    🟢 <b>Low Risk:</b> 1
  </div>

  <div>
    🚛 <b>Active Vehicles:</b> 1
  </div>
</div>
      
<div
  style={{
    background: "white",
    padding: "15px",
    margin: "10px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    width: "260px",
    position: "relative",
    zIndex: 1000,
  }}
>
  <h2 style={{ margin: "0 0 10px 0" }}>
    🚛 Fleet Tracking
  </h2>

  <p><b>Vehicle:</b> MH-WASTE-01</p>
  <p><b>Status:</b> 🟢 ACTIVE</p>
  <p><b>Speed:</b> 24 km/h</p>
  <p><b>Ward:</b> 12</p>
  <p><b>Task:</b> Waste Collection</p>
  <p><b>Mode:</b> Simulated Live Tracking</p>
</div>

      <MapContainer
        center={[21.1458, 79.0882]}
        zoom={12}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline
        positions={route}
        pathOptions={{
          color: "blue",
          weight: 5,
        }}/>
{gvpData.map((gvp) => {
  const score = calculateGvpScore(gvp);
  const risk = getRiskLevel(score);

  let icon = lowIcon;

  if (risk === "HIGH") {
    icon = highIcon;
  } else if (risk === "MEDIUM") {
    icon = mediumIcon;
  }

  return (
    <Marker
      key={gvp.id}
      position={gvp.position}
      icon={icon}
    >
      <Popup>
        <b>{gvp.id}</b>
        <br />
        Risk: {risk}
        <br />
        Waste: {gvp.waste} kg
        <br />
        Complaints: {gvp.complaints}
        <br />
        Collection Delay: {gvp.delay} days
        <br />
        <br />
        <b>Prediction Score:</b> {score.toFixed(0)}
      </Popup>
    </Marker>
  );
})}

      </MapContainer>
    </>
  );
}

export default App;