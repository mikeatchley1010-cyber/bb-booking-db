import { useState, useEffect } from 'react';
import './App.css'; 

function BookingPage() {
  const [backendMessage, setBackendMessage] = useState('Waiting...');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('Buffalo Ridge'); 
  const [bookings, setBookings] = useState([]); 
  const [statusMessage, setStatusMessage] = useState(''); 

  const today = new Date().toISOString().split('T')[0];

  const fetchBookings = () => {
    fetch('https://bb-booking-db-1.onrender.com/api/bookings')
      .then(response => response.json())
      .then(data => setBookings(data));
  };

  useEffect(() => {
    fetch('https://bb-booking-db-1.onrender.com/api/test')
      .then(response => response.json())
      .then(data => setBackendMessage(data.message));
    fetchBookings(); 
  }, []);

  const handleBooking = () => {
    setStatusMessage('Processing...'); 
    fetch('https://bb-booking-db-1.onrender.com/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName: selectedRoom, checkIn, checkOut }) 
    })
      .then(response => response.json())
      .then(data => {
        setStatusMessage(data.message); 
        fetchBookings(); 
      })
      .catch(() => setStatusMessage('Error connecting to server!'));
  };

  const cancelBooking = (id) => {
    setStatusMessage('Canceling...');
    fetch(`https://bb-booking-db-1.onrender.com/api/bookings/${id}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
        setStatusMessage(data.message);
        fetchBookings(); 
      })
      .catch(() => setStatusMessage('Error canceling booking!'));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { timeZone: 'UTC' });
  };

  return (
    <div className="booking-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Cleghorn Canyon Bed and Breakfast</h1>
      <p>Server Status: {backendMessage}</p>
      
      <div className="booking-form-section" style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        <h2>Book Your Stay</h2>
        <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
          <option value="Buffalo Ridge">Buffalo Ridge</option>
          <option value="BigHorn Lookout">Canyon Suite</option>
          <option value="Deer Run">Ponderosa Room</option>
        </select>
        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
        <button onClick={handleBooking}>Confirm Booking</button>
        {statusMessage && <p>{statusMessage}</p>}
      </div>

      <div className="reservations-section">
        <h2>Current Reservations</h2>
        {bookings.map((b) => (
          <div key={b.id}>
            <strong>{b.room_name}</strong>: {formatDate(b.check_in)} to {formatDate(b.check_out)}
            <button onClick={() => cancelBooking(b.id)}>Cancel</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingPage;