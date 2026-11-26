import { addDays, todayISO } from './lib/dates';

export const SAMPLE_CARS = [
  { id: 1, name: 'Toyota Vitz', category: 'Hatchback', seats: 5, transmission: 'Automatic', fuel: 'Petrol', daily_rate: 3500, plate: 'KDA 214M' },
  { id: 2, name: 'Mazda Demio', category: 'Hatchback', seats: 5, transmission: 'Automatic', fuel: 'Petrol', daily_rate: 3800, plate: 'KDG 481T' },
  { id: 3, name: 'Toyota Axio', category: 'Sedan', seats: 5, transmission: 'Automatic', fuel: 'Petrol', daily_rate: 4500, plate: 'KCZ 907B' },
  { id: 4, name: 'Subaru Forester', category: 'SUV', seats: 5, transmission: 'Automatic', fuel: 'Petrol', daily_rate: 7500, plate: 'KDC 356K' },
  { id: 5, name: 'Toyota Land Cruiser Prado', category: 'SUV', seats: 7, transmission: 'Automatic', fuel: 'Diesel', daily_rate: 14000, plate: 'KDD 692W' },
  { id: 6, name: 'Toyota Hiace', category: 'Van', seats: 14, transmission: 'Manual', fuel: 'Diesel', daily_rate: 12000, plate: 'KDB 120H' },
];

// Worked out from today so the demo always shows one booked car with the default dates.
export function sampleBlockedRanges() {
  const today = todayISO();
  return {
    5: [{ start: addDays(today, 3), end: addDays(today, 6) }],
  };
}
