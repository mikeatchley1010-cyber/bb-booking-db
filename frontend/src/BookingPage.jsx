import { useState, useEffect } from 'react';
import './App.css'; 

function BookingPage() {
  const [backendMessage, setBackendMessage] = useState('Waiting...');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('Buffalo Ridge'); 
  const [bookings, setBookings] = useState([]); 
  const [statusMessage, setStatusMessage] = useState(''); 
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

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
      body: JSON.stringify({ 
        guestName, 
        guestEmail, 
        guestPhone, 
        roomName: selectedRoom, 
        checkIn, 
        checkOut 
      })
    }) // <--- This closing bracket and parenthesis was missing!
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
        <input type="text" placeholder="Full Name" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
        <input type="email" placeholder="Email Address" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
        <input type="tel" placeholder="Phone Number" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} />
        
        <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
          <option value="Buffalo Ridge">Buffalo Ridge</option>
          <option value="BigHorn Lookout">BigHorn Lookout</option>
          <option value="Deer Run">Deer Run</option>
          <option value="Family Package (BigHorn Lookout & Deer Run)">
            Family Package (BigHorn Lookout & Deer Run)
          </option>
          <option value="The Full House Package (All 3 Rooms)">
            The Full House Package (All 3 Rooms)
          </option>
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