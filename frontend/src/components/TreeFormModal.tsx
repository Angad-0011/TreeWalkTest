import { FormEvent, useState } from 'react';
import { LatLng, TreeCondition } from '../types';

interface TreeFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { species: string; condition: TreeCondition; notes: string; location: LatLng }) => void;
  location: LatLng | null;
}

const CONDITIONS: TreeCondition[] = ['Good', 'Fair', 'Critical', 'Dead'];

export default function TreeFormModal({ open, onClose, onSubmit, location }: TreeFormModalProps) {
  const [species, setSpecies] = useState('');
  const [condition, setCondition] = useState<TreeCondition>('Good');
  const [notes, setNotes] = useState('');

  if (!open || !location) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({ species, condition, notes, location });
    setSpecies('');
    setCondition('Good');
    setNotes('');
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true">
        <header>
          <h3 style={{ margin: 0 }}>Label tree</h3>
          <p style={{ margin: '0.4rem 0 0', opacity: 0.8 }}>
            Location: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
          </p>
        </header>
        <form onSubmit={handleSubmit}>
          <label>
            Species
            <input
              type="text"
              value={species}
              placeholder="Oak, Maple, Elm..."
              onChange={(e) => setSpecies(e.target.value)}
              required
            />
          </label>
          <label>
            Condition
            <select value={condition} onChange={(e) => setCondition(e.target.value as TreeCondition)}>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            Notes
            <textarea
              rows={3}
              placeholder="Health notes, surroundings, maintenance needs"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
          <footer>
            <button className="secondary" type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </footer>
        </form>
      </div>
    </div>
  );
}
