
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onNavigate: (view: 'dashboard' | 'create') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={() => onNavigate('dashboard')}
            >
              <div className="bg-indigo-600 p-2 rounded-lg mr-2 group-hover:bg-indigo-700 transition-colors">
                <i className="fas fa-plane-departure text-white text-xl"></i>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                VoyageAI
              </h1>
            </div>

            {user && (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => onNavigate('create')}
                  className="hidden sm:flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <i className="fas fa-plus mr-2"></i>
                  New Trip
                </button>
                <div className="flex items-center space-x-2 border-l pl-4 border-gray-200">
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <button 
                    onClick={onLogout}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Logout"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} VoyageAI. Built with Gemini AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
