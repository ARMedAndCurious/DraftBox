import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PenSquare, Home, FileText, ClipboardList, LogOut } from 'lucide-react';

const Navbar = () => {
  const { token, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!token) return null; // Don't show navbar on login/register

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Feed', path: '/', icon: <Home className="w-4 h-4 mr-2" /> },
    { name: 'Write', path: '/write', icon: <PenSquare className="w-4 h-4 mr-2" /> },
    { name: 'My Articles', path: '/my-articles', icon: <FileText className="w-4 h-4 mr-2" /> },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Review Queue', path: '/review', icon: <ClipboardList className="w-4 h-4 mr-2" /> });
  }

  return (
    <nav className="bg-dark-surface border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">DraftBox</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-gray-800 text-primary' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2 text-primary" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
