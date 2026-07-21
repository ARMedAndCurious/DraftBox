import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import WriteArticle from './pages/WriteArticle';
import MyArticles from './pages/MyArticles';
import ReviewQueue from './pages/ReviewQueue';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-dark-bg text-white font-sans">
          <Navbar />
          <main>
            <Routes>
              {/* Public routes (though Feed is protected in requirements, let's protect it) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes for any logged-in user */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Feed />} />
                <Route path="/write" element={<WriteArticle />} />
                <Route path="/my-articles" element={<MyArticles />} />
              </Route>

              {/* Admin Only Route */}
              <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route path="/review" element={<ReviewQueue />} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
