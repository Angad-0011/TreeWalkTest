export type TreeCondition = 'Good' | 'Fair' | 'Critical' | 'Dead';

export interface TreeRecord {
  id: string;
  lat: number;
  lng: number;
  species: string;
  condition: TreeCondition;
  notes?: string;
  createdAt: string;
  imageId?: string | null;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface NearestImageResponse {
  image_id: string | null;
  lat: number;
  lng: number;
  distance: number | null;
  source: 'mapillary' | 'stub';
}
