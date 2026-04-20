import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ResourceDetail from './pages/ResourceDetail';
import UserProfile from './pages/UserProfile';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resource/:id" element={<ResourceDetail />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/category/:category" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;