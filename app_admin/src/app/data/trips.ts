import { Trip } from '../models/trip';

// Mock trip data used for component testing and as an offline fallback
export const trips: Trip[] = [
  {
    code: 'GALR210214',
    name: 'Gale Reef',
    length: '4 nights / 5 days',
    start: '2026-02-14T08:00:00Z',
    resort: 'Emerald Bay, 3 stars',
    perPerson: '799.00',
    image: 'reef1.jpg',
    description: 'Gale Reef is a beautiful destination featuring clear water, relaxing beaches, and unforgettable experiences.'
  },
  {
    code: 'DAWR210315',
    name: "Dawson's Reef",
    length: '4 nights / 5 days',
    start: '2026-03-15T08:00:00Z',
    resort: 'Blue Lagoon, 4 stars',
    perPerson: '1199.00',
    image: 'reef2.jpg',
    description: "Enjoy an exciting getaway at Dawson's Reef with comfortable accommodations and beautiful surroundings."
  },
  {
    code: 'CLAR210621',
    name: "Claire's Reef",
    length: '4 nights / 5 days',
    start: '2026-06-21T08:00:00Z',
    resort: 'Coral Sands, 5 stars',
    perPerson: '1499.00',
    image: 'reef3.jpg',
    description: "Experience a relaxing tropical vacation at Claire's Reef with excellent accommodations and scenic views."
  }
];
