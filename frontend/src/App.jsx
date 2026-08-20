import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BookingPage from './BookingPage';
import AdminPage from './AdminPage'; // <-- 1. We imported your new file here!
import './App.css';

const Home = () => <h2>Welcome to Cleghorn Canyon</h2>;
const Amenities = () => <h2>Our Amenities</h2>;
const Attractions = () => <h2>Local Attractions</h2>;
// 2. We removed the placeholder Admin component that was here.

function App() {
  return (
    <Router>
      <div>
        <nav className="nav-bar">
          <Link to="/">Home</Link>
          <Link to="/rooms">Rooms and Packages</Link>
          <Link to="/amenities">Amenities</Link>
          <Link to="/attractions">Attractions</Link>
          <Link to="/admin">Admin</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<BookingPage />} />
          <Route path="/amenities" element={<Amenities />} />
          <Route path="/attractions" element={<Attractions />} />
          {/* 3. We updated the element below to use your new AdminPage! */}
          <Route path="/admin" element={<AdminPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;