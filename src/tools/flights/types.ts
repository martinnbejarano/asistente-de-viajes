export interface FlightLocationData {
  id: string;
  type: string;
  name: string;
  code: string;
  city: string;
  cityName: string;
  regionName: string;
  country: string;
  countryName: string;
  countryNameShort: string;
  photoUri: string;
  distanceToCity?: number;
  parent: string;
}

export interface FlightLocationResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: FlightLocationData[];
}

export interface Price {
  currencyCode: string;
  units: number;
  nanos: number;
}

export interface FlightSearchItem {
  departureDate: string;
  returnDate: string;
  searchDates: string[];
  offsetDays: number;
  isCheapest: boolean;
  price: Price;
}

export interface FlightSearchResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: FlightSearchItem[];
}
