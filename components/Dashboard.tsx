
import React from 'react';
import { Trip } from '../types';

interface DashboardProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
  onCreateNew: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ trips, onSelectTrip, onCreateNew }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Your Adventures</h2>
          <p className="mt-1 text-gray-500 text-lg">Manage and explore your upcoming and past trips.</p>
        </div>
        <button
          onClick={onCreateNew}
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transform hover:-translate-y-1 transition-all"
        >
          <i className="fas fa-plus mr-2"></i>
          Plan a New Trip
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
          <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-map-marked-alt text-indigo-400 text-3xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-8">
            Start your next journey by letting our AI craft the perfect itinerary for you.
          </p>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center px-6 py-3 border border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Create your first trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => onSelectTrip(trip)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="h-40 bg-indigo-100 relative overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${trip.destination}/600/400`} 
                  alt={trip.destination}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-700 shadow-sm uppercase">
                  {trip.preferences.budget}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {trip.destination}
                  </h3>
                  <span className="text-gray-400">
                    <i className="fas fa-chevron-right text-xs"></i>
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <i className="far fa-calendar-alt mr-2 text-indigo-400"></i>
                  {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium capitalize">
                    {trip.preferences.travelType}
                  </span>
                  {trip.preferences.interests.slice(0, 2).map((interest, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-medium">
                      {interest}
                    </span>
                  ))}
                  {trip.preferences.interests.length > 2 && (
                    <span className="text-gray-400 text-xs flex items-center">
                      +{trip.preferences.interests.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
