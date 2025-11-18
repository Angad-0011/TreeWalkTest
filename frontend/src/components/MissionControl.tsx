import Papa from 'papaparse';
import { TreeRecord } from '../types';

interface MissionControlProps {
  trees: TreeRecord[];
  onImport: (records: TreeRecord[]) => void;
}

export default function MissionControl({ trees, onImport }: MissionControlProps) {
  const handleExport = () => {
    const csv = Papa.unparse(trees);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'treewalk.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<TreeRecord>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const filtered = results.data.filter((row) => row.lat && row.lng);
        const normalized: TreeRecord[] = filtered.map((row, index) => ({
          ...row,
          id: row.id || crypto.randomUUID(),
          lat: Number(row.lat),
          lng: Number(row.lng),
          createdAt: row.createdAt || new Date().toISOString(),
          species: row.species || `Imported tree ${index + 1}`,
          condition: (row.condition as TreeRecord['condition']) || 'Good',
        }));
        onImport(normalized);
      },
      error: (error) => {
        console.error('CSV import failed', error);
      },
    });
  };

  return (
    <div className="panel">
      <h2>Mission Control</h2>
      <div className="panel-body mission-control">
        <p>
          Import a CSV to visualize existing annotations or export your current session for sharing. Data is also stored in
          LocalStorage for instant persistence.
        </p>
        <button className="secondary" onClick={handleExport} disabled={!trees.length}>
          Export {trees.length} trees
        </button>
        <label>
          Import CSV
          <input type="file" accept=".csv" onChange={handleImport} />
        </label>
      </div>
    </div>
  );
}
