
import React, { useState } from 'react';
import { TripPreferences } from '../types';
import { INTEREST_OPTIONS, TRAVEL_TYPES, BUDGET_LEVELS } from '../constants';

interface TripWizardProps {
  onGenerate: (data: {
    destination: string;
    startDate: string;
    endDate: string;
    preferences: TripPreferences;
  }) => void;
  onCancel: () => void;
  loading: boolean;
}

const TripWizard: React.FC<TripWizardProps> = ({ onGenerate, onCancel, loading }) => {
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelType, setTravelType] = useState<TripPreferences['travelType']>('solo');
  const [budget, setBudget] = useState<TripPreferences['budget']>('mid-range');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    if (step === 1) return destination && startDate && endDate;
    if (step === 2) return travelType && budget;
    return selectedInterests.length > 0;
  };

  const handleSubmit = () => {
    onGenerate({
      destination,
      startDate,
      endDate,
      preferences: {
        travelType,
        budget,
        interests: selectedInterests
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-gray-50 px-8 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Step {step} of 3</span>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-300" 
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Where are we going?</h2>
                <p className="text-gray-500">Enter your destination and travel dates to get started.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Destination</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <i className="fas fa-location-dot"></i>
                  </div>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Kyoto, Japan"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Travel Style & Budget</h2>
                <p className="text-gray-500">Help us personalize the activities for you.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">Travel Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {TRAVEL_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setTravelType(type.value as any)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                        travelType === type.value 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                          : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      <i className={`fas ${type.icon} text-2xl mb-2`}></i>
                      <span className="text-xs font-bold">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">Budget Range</label>
                <div className="grid grid-cols-3 gap-4">
                  {BUDGET_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setBudget(level.value as any)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                        budget === level.value 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                          : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      <i className={`fas ${level.icon} text-xl mb-2`}></i>
                      <span className="text-xs font-bold">{level.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">What do you love?</h2>
                <p className="text-gray-500">Pick at least one interest to shape your itinerary.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INTEREST_OPTIONS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`flex items-center px-4 py-3 rounded-xl border-2 transition-all text-left ${
                      selectedInterests.includes(interest)
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      selectedInterests.includes(interest) ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'
                    }`}>
                      {selectedInterests.includes(interest) && <i className="fas fa-check text-white text-[10px]"></i>}
                    </div>
                    <span className="text-sm font-medium">{interest}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 flex justify-between items-center pt-8 border-t border-gray-100">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="px-6 py-3 text-gray-600 font-semibold hover:text-gray-900"
                disabled={loading}
              >
                Back
              </button>
            ) : (
              <button
                onClick={onCancel}
                className="px-6 py-3 text-gray-400 font-semibold hover:text-gray-600"
                disabled={loading}
              >
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid() || loading}
                className="px-10 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid() || loading}
                className="flex items-center px-10 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin mr-2"></i>
                    Crafting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-wand-magic-sparkles mr-2"></i>
                    Generate Itinerary
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="mt-8 text-center animate-pulse">
          <p className="text-indigo-600 font-medium">Our AI is researching local hotspots, checking travel times, and building your dream trip...</p>
        </div>
      )}
    </div>
  );
};

export default TripWizard;
