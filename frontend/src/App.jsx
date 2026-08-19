import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BookingPage from './BookingPage';
import './App.css';

// Notice the  tags wrapping the text!
const Home = () => Welcome to Cleghorn Canyon;
const Amenities = () => Our Amenities;
const Attractions = () => Local Attractions;
const Admin = () => Secure Admin Dashboard;

function App() {
  return (
    
      
        
          Home
          Rooms & Packages
          Amenities
          Attractions
          Admin
        

        
          } />
          } />
          } />
          } />
          } />
        
      
    
  );
}

export default App;