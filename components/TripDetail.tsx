
import React, { useState, useRef, useEffect } from 'react';
import { Trip, ItineraryDay } from '../types';
import { refineItinerary } from '../services/geminiService';

interface TripDetailProps {
  trip: Trip;
  onUpdate: (newItinerary: ItineraryDay[]) => void;
  onBack: () => void;
}

const TripDetail: React.FC<TripDetailProps> = ({ trip, onUpdate, onBack }) => {
  const [activeDay, setActiveDay] = useState(1);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const currentDayData = trip.itinerary.find(d => d.dayNumber === activeDay) || trip.itinerary[0];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLoading]);

  const handleSendChat = async () => {
    if (!chatMessage.trim() || chatLoading) return;
    
    setChatLoading(true);
    try {
      const updated = await refineItinerary(trip.itinerary, chatMessage, trip.preferences);
      onUpdate(updated);
      setChatMessage('');
    } catch (err) {
      alert("Failed to update itinerary. Please try again.");
    } finally {
      setChatLoading(false);
    }
  };

  const handleRestore = (historyIdx: number) => {
    onUpdate(trip.history[historyIdx]);
    setShowHistory(false);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
      {/* Main Content - Itinerary */}
      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={onBack}
            className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors mb-6 group"
          >
            <i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
            Back to Dashboard
          </button>

          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
            <div>
              <h2 className="text-4xl font-black text-gray-900 leading-tight">{trip.destination}</h2>
              <p className="text-gray-500 text-lg">
                {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className="p-3 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 shadow-sm transition-all"
                title="Version History"
              >
                <i className="fas fa-history"></i>
              </button>
              <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl text-indigo-700 font-bold flex items-center">
                <i className="fas fa-coins mr-2"></i>
                {trip.preferences.budget.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Day Navigation */}
          <div className="flex overflow-x-auto pb-4 gap-2 mb-10 no-scrollbar">
            {trip.itinerary.map((day) => (
              <button
                key={day.dayNumber}
                onClick={() => setActiveDay(day.dayNumber)}
                className={`flex-shrink-0 px-6 py-3 rounded-2xl font-bold transition-all ${
                  activeDay === day.dayNumber
                    ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Day {day.dayNumber}
              </button>
            ))}
          </div>

          {/* Selected Day View */}
          {currentDayData && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mr-4 text-white">
                    <i className="far fa-calendar text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{currentDayData.title}</h3>
                    <p className="text-gray-400 font-medium">{new Date(currentDayData.date).toDateString()}</p>
                  </div>
                </div>

                <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
                  {currentDayData.activities.map((activity, idx) => (
                    <div key={idx} className="relative pl-12">
                      <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-white border-4 border-indigo-600 flex items-center justify-center z-10">
                        <i className={`fas ${
                          activity.type === 'food' ? 'fa-utensils' :
                          activity.type === 'sightseeing' ? 'fa-camera' :
                          activity.type === 'transport' ? 'fa-bus' :
                          activity.type === 'rest' ? 'fa-bed' : 'fa-star'
                        } text-indigo-600 text-xs`}></i>
                      </div>
                      <div className="bg-gray-50/50 hover:bg-gray-50 p-5 rounded-2xl border border-transparent hover:border-indigo-100 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase">{activity.time}</span>
                          {activity.costEstimate && (
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">
                              {activity.costEstimate}
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1">{activity.title}</h4>
                        <div className="flex items-center text-gray-500 text-sm mb-3">
                          <i className="fas fa-location-dot mr-2 text-red-400"></i>
                          {activity.location}
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {currentDayData.notes && (
                  <div className="mt-8 bg-amber-50 rounded-2xl p-6 border border-amber-100">
                    <h5 className="flex items-center text-amber-800 font-bold text-sm uppercase tracking-wider mb-2">
                      <i className="fas fa-sticky-note mr-2"></i>
                      Travel Notes
                    </h5>
                    <p className="text-amber-900/70 italic text-sm">{currentDayData.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar - Chat & Tools */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-2xl relative">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-black text-gray-900 flex items-center">
            <i className="fas fa-robot text-indigo-600 mr-2"></i>
            Voyage AI Assistant
          </h3>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Itinerary Planner</p>
        </div>

        {/* Chat Messages - Simulating a helper chat context */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-sm text-indigo-800 leading-relaxed">
            <p className="font-bold mb-1">How can I help you improve this trip?</p>
            <p>You can ask me things like:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>"Add a rest morning on Day 2"</li>
              <li>"Replace expensive restaurants with local food stalls"</li>
              <li>"Suggest more nature spots for Day 3"</li>
            </ul>
          </div>

          {chatLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center space-x-2 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span className="text-xs font-medium text-gray-400">Voyage AI is planning...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="relative">
            <textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendChat();
                }
              }}
              placeholder="Ask for changes..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none min-h-[100px] transition-all"
            />
            <button
              onClick={handleSendChat}
              disabled={!chatMessage.trim() || chatLoading}
              className="absolute bottom-3 right-3 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md"
            >
              <i className={`fas ${chatLoading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center uppercase tracking-widest font-bold">
            Powered by Gemini 3 Flash
          </p>
        </div>

        {/* Version History Modal Overlay */}
        {showHistory && (
          <div className="absolute inset-0 z-50 bg-white flex flex-col animate-slideUp">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-gray-900 uppercase tracking-wider text-sm">Itinerary History</h3>
              <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {trip.history.length === 0 ? (
                <p className="text-center text-gray-400 text-sm mt-10">No previous versions yet.</p>
              ) : (
                trip.history.map((h, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 border border-gray-200 rounded-2xl hover:border-indigo-400 transition-all cursor-pointer group flex justify-between items-center"
                    onClick={() => handleRestore(idx)}
                  >
                    <div>
                      <p className="font-bold text-gray-900">Version {trip.history.length - idx}</p>
                      <p className="text-xs text-gray-400">Created after AI refinement</p>
                    </div>
                    <i className="fas fa-rotate-left text-gray-300 group-hover:text-indigo-500 transition-colors"></i>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetail;
