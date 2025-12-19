
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In this React demo, we simulate the authentication
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: isLogin ? 'Explorer' : name,
      email: email
    };
    onLogin(user);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
      {/* Left side: Hero/Branding */}
      <div className="lg:flex-1 bg-indigo-600 flex flex-col justify-center px-12 py-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-400 rounded-full opacity-30 blur-3xl"></div>
        
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center px-3 py-1 bg-indigo-500/50 backdrop-blur rounded-full text-sm font-bold mb-6 border border-indigo-400/30">
            <i className="fas fa-sparkles mr-2 text-yellow-300"></i>
            AI-POWERED TRAVEL
          </div>
          <h2 className="text-5xl font-black mb-6 leading-tight">Your Personal Travel Architect.</h2>
          <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
            Stop stressing over details. Tell us your vibe, and our AI will build a perfect, day-wise itinerary in seconds.
          </p>
          <div className="space-y-4">
            {[
              "Intelligent Day-by-Day Planning",
              "Real-time Chat Refinement",
              "Personalized for your Budget",
              "Curated Hidden Gems & Local Spots"
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <div className="bg-indigo-400/40 p-1 rounded-full">
                  <i className="fas fa-check text-indigo-200 text-xs"></i>
                </div>
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="lg:flex-1 bg-white flex flex-col justify-center items-center px-8 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-black text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h3>
            <p className="text-gray-500">
              {isLogin ? 'Enter your details to manage your trips.' : 'Create an account to start your journey.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl shadow-lg hover:bg-indigo-700 transform hover:-translate-y-1 transition-all active:scale-95 mt-4"
            >
              {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-indigo-600 font-bold hover:underline"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">Or continue with</p>
            <div className="flex justify-center space-x-4">
              <button className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                <i className="fab fa-google text-gray-600"></i>
              </button>
              <button className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                <i className="fab fa-apple text-gray-600"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
