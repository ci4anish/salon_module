export interface SalonGeo {
  id: number;
  deg: {
    latitude: number;
    longitude: number;
  };
  utm: {
    easting: number;
    letter: string;
    northing: number;
    zone: number;
  }
}
