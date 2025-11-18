import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents } from 'react-leaflet';
import { LatLng, TreeRecord } from '../types';

interface MapPanelProps {
  trees: TreeRecord[];
  center: LatLng;
  onCenterChange: (latlng: LatLng) => void;
  onSelectLocation?: (latlng: LatLng) => void;
  height?: string | number;
}

const conditionColor: Record<TreeRecord['condition'], string> = {
  Good: '#16a34a',
  Fair: '#eab308',
  Critical: '#dc2626',
  Dead: '#0ea5e9',
};

function LocationTracker({ onCenterChange, onSelectLocation }: { onCenterChange: (latlng: LatLng) => void; onSelectLocation?: (latlng: LatLng) => void }) {
  useMapEvents({
    moveend: (event) => {
      const c = event.target.getCenter();
      onCenterChange({ lat: c.lat, lng: c.lng });
    },
    click: (event) => {
      if (onSelectLocation) {
        onSelectLocation({ lat: event.latlng.lat, lng: event.latlng.lng });
      }
    },
  });
  return null;
}

export default function MapPanel({ trees, center, onCenterChange, onSelectLocation, height = '100%' }: MapPanelProps) {
  return (
    <div className="panel map-panel" style={{ height }}>
      <h2>Map</h2>
      <div style={{ height: 'calc(100% - 48px)' }}>
        <MapContainer center={[center.lat, center.lng]} zoom={17} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationTracker onCenterChange={onCenterChange} onSelectLocation={onSelectLocation} />
          {trees.map((tree) => (
            <CircleMarker
              key={tree.id}
              center={[tree.lat, tree.lng]}
              radius={7}
              color={conditionColor[tree.condition]}
              weight={2}
              fillOpacity={0.8}
            >
              <Popup>
                <div style={{ minWidth: 160 }}>
                  <strong>{tree.species || 'Tree'}</strong>
                  <div className={`badge ${tree.condition.toLowerCase()}`}>{tree.condition}</div>
                  <p style={{ marginTop: 4 }}>{tree.notes || 'No notes'}</p>
                  <small>Added {new Date(tree.createdAt).toLocaleString()}</small>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
