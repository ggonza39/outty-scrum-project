export type CitySuggestion = {
  label: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
};

export const CITY_SUGGESTIONS: CitySuggestion[] = [
  {
    label: "Denver, CO",
    city: "Denver",
    state: "CO",
    zip: "80202",
    lat: 39.7392,
    lng: -104.9903,
  },
  {
    label: "Atlanta, GA",
    city: "Atlanta",
    state: "GA",
    zip: "30303",
    lat: 33.749,
    lng: -84.388,
  },
  {
    label: "Seattle, WA",
    city: "Seattle",
    state: "WA",
    zip: "98101",
    lat: 47.6062,
    lng: -122.3321,
  },
  {
    label: "Austin, TX",
    city: "Austin",
    state: "TX",
    zip: "78701",
    lat: 30.2672,
    lng: -97.7431,
  },
  {
    label: "Miami, FL",
    city: "Miami",
    state: "FL",
    zip: "33101",
    lat: 25.7617,
    lng: -80.1918,
  },
  {
    label: "Chicago, IL",
    city: "Chicago",
    state: "IL",
    zip: "60601",
    lat: 41.8781,
    lng: -87.6298,
  },
  {
    label: "Los Angeles, CA",
    city: "Los Angeles",
    state: "CA",
    zip: "90012",
    lat: 34.0549,
    lng: -118.2426,
  },
  {
    label: "Phoenix, AZ",
    city: "Phoenix",
    state: "AZ",
    zip: "85004",
    lat: 33.4484,
    lng: -112.074,
  },
];
