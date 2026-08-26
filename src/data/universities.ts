import { University } from '../types';

export const AFRICAN_UNIVERSITIES: University[] = [
  { id: 'uon', name: 'University of Nairobi', acronym: 'UoN', country: 'Kenya', city: 'Nairobi', verified: true },
  { id: 'ku', name: 'Kenyatta University', acronym: 'KU', country: 'Kenya', city: 'Nairobi', verified: true },
  { id: 'jkuat', name: 'Jomo Kenyatta University of Agriculture and Technology', acronym: 'JKUAT', country: 'Kenya', city: 'Juja', verified: true },
  { id: 'strath', name: 'Strathmore University', acronym: 'SU', country: 'Kenya', city: 'Nairobi', verified: true },
  { id: 'mak', name: 'Makerere University', acronym: 'MAK', country: 'Uganda', city: 'Kampala', verified: true },
  { id: 'uct', name: 'University of Cape Town', acronym: 'UCT', country: 'South Africa', city: 'Cape Town', verified: true },
  { id: 'wits', name: 'University of the Witwatersrand', acronym: 'Wits', country: 'South Africa', city: 'Johannesburg', verified: true },
  { id: 'unilag', name: 'University of Lagos', acronym: 'UNILAG', country: 'Nigeria', city: 'Lagos', verified: true },
  { id: 'covenant', name: 'Covenant University', acronym: 'CU', country: 'Nigeria', city: 'Ota', verified: true },
  { id: 'cairo', name: 'Cairo University', acronym: 'CU-EG', country: 'Egypt', city: 'Giza', verified: true },
  { id: 'ug', name: 'University of Ghana', acronym: 'UG', country: 'Ghana', city: 'Legon', verified: true },
  { id: 'knust', name: 'Kwame Nkrumah University of Science and Technology', acronym: 'KNUST', country: 'Ghana', city: 'Kumasi', verified: true },
  { id: 'ashesi', name: 'Ashesi University', acronym: 'AU', country: 'Ghana', city: 'Berekuso', verified: true },
  { id: 'aau', name: 'Addis Ababa University', acronym: 'AAU', country: 'Ethiopia', city: 'Addis Ababa', verified: true },
  { id: 'tuk', name: 'Technical University of Kenya', acronym: 'TUK', country: 'Kenya', city: 'Nairobi', verified: true },
  { id: 'moi', name: 'Moi University', acronym: 'MU', country: 'Kenya', city: 'Eldoret', verified: true },
  { id: 'egerton', name: 'Egerton University', acronym: 'EU', country: 'Kenya', city: 'Njoro', verified: true },
  { id: 'maseno', name: 'Maseno University', acronym: 'MSU', country: 'Kenya', city: 'Kisumu', verified: true },
  { id: 'usiu', name: 'United States International University Africa', acronym: 'USIU-A', country: 'Kenya', city: 'Nairobi', verified: true },
  { id: 'dekut', name: 'Dedan Kimathi University of Technology', acronym: 'DeKUT', country: 'Kenya', city: 'Nyeri', verified: true },
  { id: 'mku', name: 'Mount Kenya University', acronym: 'MKU', country: 'Kenya', city: 'Thika', verified: true },
  { id: 'ibadan', name: 'University of Ibadan', acronym: 'UI', country: 'Nigeria', city: 'Ibadan', verified: true },
  { id: 'pretoria', name: 'University of Pretoria', acronym: 'UP', country: 'South Africa', city: 'Pretoria', verified: true },
  { id: 'stellenbosch', name: 'Stellenbosch University', acronym: 'SU-SA', country: 'South Africa', city: 'Stellenbosch', verified: true },
  { id: 'dar', name: 'University of Dar es Salaam', acronym: 'UDSM', country: 'Tanzania', city: 'Dar es Salaam', verified: true },
  { id: 'rwanda', name: 'University of Rwanda', acronym: 'UR', country: 'Rwanda', city: 'Kigali', verified: true }
];

export function isValidUniversity(universityName: string): boolean {
  if (!universityName || universityName.trim().length < 2) return false;
  const lower = universityName.toLowerCase().trim();
  return AFRICAN_UNIVERSITIES.some(
    u => u.name.toLowerCase() === lower || 
         u.acronym.toLowerCase() === lower ||
         u.name.toLowerCase().includes(lower) ||
         lower.includes(u.name.toLowerCase())
  );
}

export function searchUniversities(query: string): University[] {
  if (!query || !query.trim()) return AFRICAN_UNIVERSITIES.slice(0, 8);
  const q = query.toLowerCase().trim();
  return AFRICAN_UNIVERSITIES.filter(
    u => u.name.toLowerCase().includes(q) ||
         u.acronym.toLowerCase().includes(q) ||
         u.country.toLowerCase().includes(q) ||
         u.city.toLowerCase().includes(q)
  );
}
