
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  costEstimate: string;
  type: 'sightseeing' | 'food' | 'rest' | 'transport' | 'activity';
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  title: string;
  activities: Activity[];
  notes?: string;
}

export interface TripPreferences {
  travelType: 'solo' | 'couple' | 'family' | 'friends';
  budget: 'budget' | 'mid-range' | 'luxury';
  interests: string[];
}

export interface Trip {
  id: string;
  userId: string;
  destination: string;
  startDate: string;
  endDate: string;
  preferences: TripPreferences;
  itinerary: ItineraryDay[];
  history: ItineraryDay[][]; // Version history
  createdAt: string;
}

export type ViewState = 'auth' | 'dashboard' | 'create' | 'detail';
