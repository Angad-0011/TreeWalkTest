import { useEffect, useState } from 'react';
import { TreeRecord } from '../types';

const STORAGE_KEY = 'treewalk:trees';

export function useLocalTrees() {
  const [trees, setTrees] = useState<TreeRecord[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: TreeRecord[] = JSON.parse(raw);
        setTrees(parsed);
      } catch (err) {
        console.warn('Failed to parse stored trees', err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trees));
  }, [trees]);

  const addTree = (tree: TreeRecord) => {
    setTrees((prev) => [tree, ...prev]);
  };

  return { trees, setTrees, addTree };
}
