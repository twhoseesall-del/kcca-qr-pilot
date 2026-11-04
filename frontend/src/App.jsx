import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons in Vite
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow });
L.Marker.prototype.options.icon = DefaultIcon;

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  // Use environment variable for API URL, fallback to localhost for dev
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const qrId = urlParams.get('id') || 'KCCA-NKS-001'; // Default for testing

    fetch(`${API_URL}/api/scan/${qrId}`)
      .then(res => res.json())
      .then(resData => {
        if (resData.error) setError(resData.error);
        else setData(resData);
      })
      .catch(() => setError("Network error. Please try again."));
  }, [API_URL]);

  if (error) return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}><h2>{error}</h2></div>;
  if (!data) return <div style={{ padding: '20px', textAlign: 'center' }}><h2>Loading urban information...</h2></div>;

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <header style={{ backgroundColor: '#003366', color: 'white', padding: '15px', textAlign: 'center' }}>
        <h3 style={{ margin: 0 }}>Kampala Capital City Authority</h3>
        <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>Directorate of Physical Planning</p>
      </header>

      <div style={{ padding: '20px' }}>
        <h1 style={{ color: '#333', marginTop: 0 }}>{data.name}</h1>
        
        <div style={{ backgroundColor: '#f4f4f4', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4 style={{ marginTop: 0 }}>🏛️ Heritage Information</h4>
          <p style={{ marginBottom: 0 }}>{data.heritage}</p>
        </div>

        <div style={{ backgroundColor: '#e6f2ff', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4 style={{ marginTop: 0 }}>📋 Live Planning Data (KCCA GIS)</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li><strong>Zone:</strong> {data.kcca_zoning.zone_type}</li>
            <li><strong>Road Reserve:</strong> {data.kcca_zoning.road_reserve}</li>
            <li><strong>Plot:</strong> {data.kcca_zoning.plot_number}</li>
          </ul>
        </div>

        <h4>📍 Location</h4>
        <MapContainer center={[data.location.lat, data.location.lng]} zoom={16} style={{ height: '250px', width: '100%', borderRadius: '8px', zIndex: 0 }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[data.location.lat, data.location.lng]}>
            <Popup>{data.name}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
