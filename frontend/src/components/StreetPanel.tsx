import { LatLng } from '../types';

interface StreetPanelProps {
  imageId: string | null;
  center: LatLng;
  onRefresh: () => void;
  onLabel: () => void;
  status?: string;
}

export default function StreetPanel({ imageId, center, onRefresh, onLabel, status }: StreetPanelProps) {
  return (
    <div className="panel viewer-shell">
      <div className="viewer-placeholder" id="mapillary-viewer">
        <div>
          <p style={{ margin: '0 0 0.35rem 0', fontWeight: 700 }}>Street View</p>
          <p style={{ margin: 0 }}>
            {imageId ? (
              <>
                Loaded panorama <strong>{imageId}</strong>
              </>
            ) : (
              <>Waiting for a Mapillary image. Click Refresh to try again.</>
            )}
          </p>
          <p style={{ marginTop: '0.75rem', opacity: 0.8 }}>
            Center: {center.lat.toFixed(5)}, {center.lng.toFixed(5)}
          </p>
          {status && <p style={{ marginTop: '0.35rem', color: '#eab308' }}>{status}</p>}
        </div>
      </div>
      <div className="crosshair" aria-hidden="true" />
      <div className="viewer-hud">
        <div className="top-row">
          <div className="meta">
            <span className="badge fair">Street Mode</span>
            <span>Target the tree in view, then label it.</span>
          </div>
          <div className="controls">
            <button className="secondary" onClick={onRefresh}>
              Refresh image
            </button>
            <button onClick={onLabel}>Label Tree</button>
          </div>
        </div>
      </div>
    </div>
  );
}
