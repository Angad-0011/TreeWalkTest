import { useCallback, useMemo, useState } from 'react';
import MapPanel from './components/MapPanel';
import MissionControl from './components/MissionControl';
import StreetPanel from './components/StreetPanel';
import TreeFormModal from './components/TreeFormModal';
import { LatLng, NearestImageResponse, TreeRecord } from './types';
import { useLocalTrees } from './hooks/useLocalTrees';

const defaultCenter: LatLng = { lat: 38.8895, lng: -77.0353 }; // National Mall

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function App() {
  const { trees, addTree, setTrees } = useLocalTrees();
  const [mode, setMode] = useState<'map' | 'street'>('map');
  const [mapCenter, setMapCenter] = useState<LatLng>(defaultCenter);
  const [selectedLocation, setSelectedLocation] = useState<LatLng>(defaultCenter);
  const [imageId, setImageId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [pendingLocation, setPendingLocation] = useState<LatLng | null>(null);

  const loadNearestImage = useCallback(async () => {
    setStatus('Fetching the closest panorama from the backend...');
    try {
      const response = await fetch(`${API_URL}/nearest-image?lat=${mapCenter.lat}&lng=${mapCenter.lng}`);
      if (!response.ok) {
        throw new Error('No panorama found. Move the map and try again.');
      }
      const payload = (await response.json()) as NearestImageResponse;
      setImageId(payload.image_id);
      setStatus(
        payload.source === 'stub'
          ? 'Running in stub mode because MAPILLARY_CLIENT_TOKEN is missing on the API.'
          : 'Loaded the closest Mapillary panorama.'
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Lookup failed';
      setStatus(message);
    }
  }, [mapCenter.lat, mapCenter.lng]);

  const handleStartExploring = () => {
    setMode('street');
    loadNearestImage();
  };

  const handleLabelTree = () => {
    setPendingLocation(selectedLocation);
    setShowForm(true);
  };

  const handleSubmitTree = ({ species, condition, notes, location }: { species: string; condition: TreeRecord['condition']; notes: string; location: LatLng }) => {
    const record: TreeRecord = {
      id: crypto.randomUUID(),
      species,
      condition,
      notes,
      lat: location.lat,
      lng: location.lng,
      createdAt: new Date().toISOString(),
      imageId,
    };
    addTree(record);
    setShowForm(false);
  };

  const legend = useMemo(
    () => [
      { label: 'Good', color: '#16a34a' },
      { label: 'Fair', color: '#eab308' },
      { label: 'Critical', color: '#dc2626' },
      { label: 'Dead', color: '#0ea5e9' },
    ],
    []
  );

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>TreeWalk</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>Virtual surveys powered by Mapillary and Leaflet.</p>
        </div>
        <div className="controls">
          <button className="secondary" onClick={() => setMode('map')}>
            Map mode
          </button>
          <button onClick={handleStartExploring}>Start exploring</button>
        </div>
      </header>

      <div className="app-grid">
        <div className="panel">
          <h2>Survey workspace</h2>
          <div className="panel-body" style={{ height: '100%' }}>
            {mode === 'map' ? (
              <MapPanel
                trees={trees}
                center={mapCenter}
                onCenterChange={setMapCenter}
                onSelectLocation={setSelectedLocation}
                height="720px"
              />
            ) : (
              <div className="street-mode">
                <StreetPanel imageId={imageId} center={mapCenter} onRefresh={loadNearestImage} onLabel={handleLabelTree} status={status} />
                <MapPanel
                  trees={trees}
                  center={mapCenter}
                  onCenterChange={setMapCenter}
                  onSelectLocation={(latlng) => {
                    setSelectedLocation(latlng);
                    setPendingLocation(latlng);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="panel">
          <h2>Session</h2>
          <div className="panel-body">
            <p style={{ marginTop: 0 }}>
              Click <strong>Start exploring</strong> to initiate the Mapillary handshake. In street mode, click Label Tree to drop a
              marker and fill in the details. Markers appear instantly on the map and stay synced via LocalStorage.
            </p>
            <div className="legend">
              {legend.map((item) => (
                <span key={item.label}>
                  <span className="dot" style={{ background: item.color }} />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          <MissionControl trees={trees} onImport={setTrees} />
        </div>
      </div>

      <TreeFormModal open={showForm} onClose={() => setShowForm(false)} onSubmit={handleSubmitTree} location={pendingLocation} />
    </div>
  );
}
