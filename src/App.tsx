import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import NavigatePage from './pages/Navigate';
import Tutorials from './pages/Tutorials';
import TutorialDetail from './pages/TutorialDetail';
import Resources from './pages/Resources';
import ResourceDetail from './pages/ResourceDetail';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import Social from './pages/Social';
import Messages from './pages/Messages';
import Friends from './pages/Friends';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import { useUserStore } from './store/userStore';

function App() {
  const { user } = useUserStore();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/navigate" element={<NavigatePage />} />
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="/tutorials/:id" element={<TutorialDetail />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/:id" element={<ResourceDetail />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/social" element={user ? <Social /> : <Navigate to="/login" />} />
        <Route path="/social/messages" element={user ? <Messages /> : <Navigate to="/login" />} />
        <Route path="/social/friends" element={user ? <Friends /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;