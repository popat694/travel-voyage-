
import React, { useState, useEffect } from 'react';
import { User, Trip, ViewState, ItineraryDay } from './types';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import TripWizard from './components/TripWizard';
import TripDetail from './components/TripDetail';
import { generateItinerary } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('auth');
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('voyage_user');
    const savedTrips = localStorage.getItem('voyage_trips');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('dashboard');
    }
    if (savedTrips) {
      setTrips(JSON.parse(savedTrips));
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (user) localStorage.setItem('voyage_user', JSON.stringify(user));
    else localStorage.removeItem('voyage_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('voyage_trips', JSON.stringify(trips));
  }, [trips]);

  const handleLogin = (u: User) => {
    setUser(u);
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setView('auth');
  };

  const handleCreateTrip = async (data: any) => {
    setIsGenerating(true);
    try {
      const itinerary = await generateItinerary(
        data.destination,
        data.startDate,
        data.endDate,
        data.preferences
      );

      const newTrip: Trip = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user!.id,
        destination: data.destination,
        startDate: data.startDate,
        endDate: data.endDate,
        preferences: data.preferences,
        itinerary: itinerary,
        history: [],
        createdAt: new Date().toISOString()
      };

      setTrips(prev => [newTrip, ...prev]);
      setSelectedTripId(newTrip.id);
      setView('detail');
    } catch (err) {
      alert("Error generating your itinerary. Please check your API key or connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateTrip = (newItinerary: ItineraryDay[]) => {
    setTrips(prev => prev.map(t => {
      if (t.id === selectedTripId) {
        return {
          ...t,
          itinerary: newItinerary,
          history: [t.itinerary, ...t.history].slice(0, 10) // Keep last 10 versions
        };
      }
      return t;
    }));
  };

  const currentTrip = trips.find(t => t.id === selectedTripId);

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      onNavigate={(v) => {
        if (v === 'create') setView('create');
        if (v === 'dashboard') setView('dashboard');
      }}
    >
      {view === 'auth' && <Auth onLogin={handleLogin} />}
      {view === 'dashboard' && (
        <Dashboard 
          trips={trips} 
          onSelectTrip={(t) => { setSelectedTripId(t.id); setView('detail'); }} 
          onCreateNew={() => setView('create')} 
        />
      )}
      {view === 'create' && (
        <TripWizard 
          onGenerate={handleCreateTrip} 
          onCancel={() => setView('dashboard')}
          loading={isGenerating}
        />
      )}
      {view === 'detail' && currentTrip && (
        <TripDetail 
          trip={currentTrip} 
          onUpdate={handleUpdateTrip}
          onBack={() => setView('dashboard')}
        />
      )}
    </Layout>
  );
};

export default App;
