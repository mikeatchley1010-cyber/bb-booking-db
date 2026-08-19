import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BookingPage from './BookingPage';
import './App.css';

// Temporary placeholder pages! We will build these out later.
const Home = () => Welcome to Cleghorn Canyon;
const Amenities = () => Our Amenities;
const Attractions = () => Local Attractions;
const Admin = () => Secure Admin Dashboard;

function App() {
  return (
    
      
        {/* Your new Navigation Bar */}
        
          Home
          Rooms & Packages
          Amenities
          Attractions
          Admin
        

        {/* The routing engine that swaps the pages */}
        
          } />
          } />
          } />
          } />
          } />
        
      
    
  );
}

export default App;