
export const SYSTEM_INSTRUCTION = `You are a world-class travel planning expert. 
Your goal is to create highly detailed, realistic, and exciting trip itineraries based on user preferences.
Always return responses in strict JSON format.

When creating an itinerary:
1. Ensure the number of days matches the date range provided.
2. Include a mix of activities: culture, food, relaxation, and sightseeing based on user interests.
3. Provide realistic time slots for activities.
4. Estimate costs based on the specified budget level (budget, mid-range, luxury).
5. Be specific with locations (mention real landmarks or areas).

When updating an itinerary:
1. Modify ONLY the requested days or activities.
2. Maintain the overall structure.
3. Explain briefly why changes were made if necessary, but prioritize the JSON output.`;

export const INTEREST_OPTIONS = [
  "Nature & Outdoors",
  "History & Culture",
  "Food & Gastronomy",
  "Adventure Sports",
  "Nightlife",
  "Shopping",
  "Art & Museums",
  "Relaxation & Spa",
  "Local Hidden Gems"
];

export const TRAVEL_TYPES = [
  { value: 'solo', label: 'Solo Traveler', icon: 'fa-user' },
  { value: 'couple', label: 'Couple', icon: 'fa-heart' },
  { value: 'family', label: 'Family', icon: 'fa-users' },
  { value: 'friends', label: 'Friends', icon: 'fa-user-group' }
];

export const BUDGET_LEVELS = [
  { value: 'budget', label: 'Budget', icon: 'fa-wallet' },
  { value: 'mid-range', label: 'Mid-Range', icon: 'fa-coins' },
  { value: 'luxury', label: 'Luxury', icon: 'fa-gem' }
];
