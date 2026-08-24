import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import BookingPage from './BookingPage';
import AdminPage from './AdminPage';
import Attractions from './Attractions';
import RoomsRates from './RoomsRates';
import Gallery from './Gallery';
import ContactUs from './ContactUs';
import './App.css';

function App() {
  return (
    <Router>
      <div style={{ margin: 0, padding: 0, fontFamily: '"Helvetica Neue", Arial, sans-serif' }}>
        
        <nav style={{ backgroundColor: '#2d4a22', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Cleghorn Canyon</Link>
          </div>
          
          <div style={{ display: 'flex', gap: '25px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.05rem' }}>Home</Link>
            <Link to="/rooms-and-rates" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.05rem' }}>Rooms & Rates</Link>
            <Link to="/attractions" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.05rem' }}>Attractions</Link>
            <Link to="/gallery" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.05rem' }}>Gallery</Link>
            <Link to="/contact" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.05rem' }}>Contact Us</Link>
            
            <Link to="/availability" style={{ backgroundColor: 'white', color: '#2d4a22', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.05rem' }}>
              Availability
            </Link>

            <Link to="/admin" style={{ color: '#88a87d', textDecoration: 'none', fontSize: '0.8rem', marginLeft: '10px' }}>Admin</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms-and-rates" element={<RoomsRates />} />
          <Route path="/attractions" element={<Attractions />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/availability" element={<BookingPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;