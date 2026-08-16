import { useState, useEffect } from 'react'
import './App.css'; 

function App() {
  const [backendMessage, setBackendMessage] = useState('Waiting...');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [bookings, setBookings] = useState([]); 
  const [statusMessage, setStatusMessage] = useState(''); 

  const today = new Date().toISOString().split('T')[0];

  const fetchBookings = () => {
    fetch('http://localhost:5000/api/bookings')
      .then(response => response.json())
      .then(data => setBookings(data));
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/test')
      .then(response => response.json())
      .then(data => setBackendMessage(data.message));
    fetchBookings(); 
  }, []);

  const handleBooking = () => {
    setStatusMessage('Processing...'); 
    fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName: 'The Sunrise Room', checkIn, checkOut })
    })
    .then(response => response.json())
    .then(data => {
      setStatusMessage(data.message); 
      fetchBookings(); 
    })
    .catch(error => setStatusMessage('Error connecting to server!'));
  };

  // NEW: Function to delete a booking
  const cancelBooking = (id) => {
    setStatusMessage('Canceling...');
    fetch(`http://localhost:5000/api/bookings/${id}`, { method: 'DELETE' })
    .then(response => response.json())
    .then(data => {
      setStatusMessage(data.message);
      fetchBookings(); // Automatically refresh the list!
    })
    .catch(error => setStatusMessage('Error canceling booking!'));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { timeZone: 'UTC' });
  };

  return (
  <div>
      <img src="[https://images.unsplash.com/photo-1590490360182-c33d59735688?q=80&w=600&auto=format&fit=crop](https://images.unsplash.com/photo-1590490360182-c33d59735688?q=80&w=600&auto=format&fit=crop)" alt="Cozy B&B Room" className="cover-photo" />
      <h1>Cleghorn Canyon Bed and Breakfast</h1>
      <p>Server Status: {backendMessage}</p>
      <h2>The Sunrise Room - $120/night</h2>
      
      <p>Check-in: <input type="date" min={today} onChange={(e) => setCheckIn(e.target.value)} /></p>
      <p>Check-out: <input type="date" min={checkIn || today} onChange={(e) => setCheckOut(e.target.value)} /></p>
      
      <button onClick={handleBooking}>Book Now</button>
      
      <p><strong>{statusMessage}</strong></p>
      
      <h3>Current Reservations:</h3>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            <span>{booking.room_name}: {formatDate(booking.check_in)} to {formatDate(booking.check_out)}</span>
            <button className="cancel-btn" onClick={() => cancelBooking(booking.id)}>Cancel</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App