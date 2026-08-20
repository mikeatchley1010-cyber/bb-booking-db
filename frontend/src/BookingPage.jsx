import { useState, useEffect } from 'react';
import './App.css'; 

function BookingPage() {
  const [backendMessage, setBackendMessage] = useState('Waiting...');
  const [bookings, setBookings] = useState([]); 
  const [statusMessage, setStatusMessage] = useState(''); 

  // Guest Details State
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestCount, setGuestCount] = useState('2 Guests');
  const [guestAges, setGuestAges] = useState('');

  // Reservation Details State
  const [selectedRoom, setSelectedRoom] = useState('Buffalo Ridge'); 
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

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
        guestCount,
        guestAges,
        roomName: selectedRoom, 
        checkIn, 
        checkOut 
      })
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
    <div className="booking-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Cleghorn Canyon Bed and Breakfast</h1>
      <p>Server Status: {backendMessage}</p>
      
      <div className="booking-form-section" style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2>Book Your Stay</h2>
        
        <input 
          type="text" 
          placeholder="Full Name" 
          value={guestName} 
          onChange={(e) => setGuestName(e.target.value)} 
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          value={guestEmail} 
          onChange={(e) => setGuestEmail(e.target.value)} 
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input 
          type="tel" 
          placeholder="Phone Number" 
          value={guestPhone} 
          onChange={(e) => setGuestPhone(e.target.value)} 
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            value={guestCount} 
            onChange={(e) => setGuestCount(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: '1' }}
          >
            <option value="1 Guest">1 Guest</option>
            <option value="2 Guests">2 Guests</option>
            <option value="3 Guests">3 Guests</option>
            <option value="4+ Guests">4+ Guests</option>
          </select>
          <input 
            type="text" 
            placeholder="Ages / Age Ranges (e.g. 2 adults, 1 child age 6)" 
            value={guestAges} 
            onChange={(e) => setGuestAges(e.target.value)} 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: '2' }}
          />
        </div>
        
        <select 
          value={selectedRoom} 
          onChange={(e) => setSelectedRoom(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
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
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: '1' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Check-In:</label>
            <input 
              type="date" 
              value={checkIn} 
              onChange={(e) => setCheckIn(e.target.value)} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ flex: '1' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Check-Out:</label>
            <input 
              type="date" 
              value={checkOut} 
              onChange={(e) => setCheckOut(e.target.value)} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <button 
          onClick={handleBooking}
          style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px', fontSize: '16px', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
        >
          Confirm Booking
        </button>
        {statusMessage && <p style={{ fontWeight: 'bold', margin: '5px 0' }}>{statusMessage}</p>}
      </div>

      <div className="reservations-section" style={{ marginTop: '30px' }}>
        <h2>Current Reservations</h2>
        {bookings.map((b) => (
          <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}>
            <span><strong>{b.room_name}</strong>: {formatDate(b.check_in)} to {formatDate(b.check_out)}</span>
            <button 
              onClick={() => cancelBooking(b.id)}
              style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingPage;