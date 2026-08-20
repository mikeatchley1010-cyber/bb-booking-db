import { useState, useEffect } from 'react';

function BookingPage() {
  const [backendMessage, setBackendMessage] = useState('Waiting...');
  const [statusMessage, setStatusMessage] = useState(''); 

  // Guest Details
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestCount, setGuestCount] = useState('2 Guests');
  const [guestAges, setGuestAges] = useState('');

  // Reservation Details
  const [selectedRoom, setSelectedRoom] = useState(''); 
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  // Property Data (Placeholder images and descriptions)
  const roomData = [
    {
      name: 'Buffalo Ridge',
      description: 'A cozy, rustic retreat with sweeping valley views and premium comforts.',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80'
    },
    {
      name: 'BigHorn Lookout',
      description: 'Spacious and bright, featuring a private balcony perfect for morning coffee.',
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80'
    },
    {
      name: 'Deer Run',
      description: 'A peaceful, secluded room tucked away for ultimate privacy and relaxation.',
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80'
    },
    {
      name: 'Family Package (BigHorn Lookout & Deer Run)',
      description: 'Book both rooms together to give the whole family plenty of space.',
      image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80'
    },
    {
      name: 'The Full House Package (All 3 Rooms)',
      description: 'Rent the entire bed and breakfast for your exclusive private getaway.',
      image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&q=80'
    }
  ];

  useEffect(() => {
    fetch('https://bb-booking-db-1.onrender.com/api/test')
      .then(response => response.json())
      .then(data => setBackendMessage(data.message))
      .catch(() => setBackendMessage('Server offline'));
  }, []);

  const handleBooking = () => {
    if (!selectedRoom || !checkIn || !checkOut || !guestName) {
      setStatusMessage('Please select a room, dates, and enter your name.');
      return;
    }

    setStatusMessage('Processing your reservation...'); 
    fetch('https://bb-booking-db-1.onrender.com/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        guestName, guestEmail, guestPhone, guestCount, guestAges, roomName: selectedRoom, checkIn, checkOut 
      })
    })
      .then(response => response.json())
      .then(data => {
        setStatusMessage(data.message); 
        if (data.message.includes('successfully')) {
          // Clear form on success
          setGuestName(''); setGuestEmail(''); setGuestPhone(''); setGuestAges(''); setSelectedRoom('');
        }
      })
      .catch(() => setStatusMessage('Error connecting to server!'));
  };

  return (
    <div style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif', color: '#333', backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '50px' }}>
      
      {/* HEADER */}
      <header style={{ backgroundColor: '#2d4a22', color: 'white', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ margin: '0', fontSize: '2.5rem', fontWeight: '300', letterSpacing: '1px' }}>Cleghorn Canyon</h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '1.2rem', fontStyle: 'italic', opacity: '0.9' }}>Bed & Breakfast</p>
      </header>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* STEP 1: DATES & GUESTS BAR */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginTop: '-25px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>Check-In</label>
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>Check-Out</label>
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>Guests</label>
            <select value={guestCount} onChange={(e) => setGuestCount(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}>
              <option value="1 Guest">1 Guest</option>
              <option value="2 Guests">2 Guests</option>
              <option value="3 Guests">3 Guests</option>
              <option value="4+ Guests">4+ Guests</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', marginTop: '40px' }}>
          
          {/* STEP 2: ROOM SELECTION */}
          <div style={{ flex: '2 1 600px' }}>
            <h2 style={{ fontSize: '1.5rem', borderBottom: '2px solid #2d4a22', paddingBottom: '10px', marginBottom: '20px' }}>1. Choose Your Room</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {roomData.map((room) => (
                <div 
                  key={room.name}
                  onClick={() => setSelectedRoom(room.name)}
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    overflow: 'hidden',
                    boxShadow: selectedRoom === room.name ? '0 0 0 3px #2d4a22' : '0 2px 8px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: '1px solid #eee'
                  }}
                >
                  <div style={{ width: '250px', backgroundImage: `url(${room.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                  <div style={{ padding: '20px', flex: '1' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem', color: '#2d4a22' }}>{room.name}</h3>
                    <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '0.95rem', lineHeight: '1.4' }}>{room.description}</p>
                    <button 
                      style={{ 
                        padding: '8px 16px', 
                        backgroundColor: selectedRoom === room.name ? '#2d4a22' : '#f4f4f4', 
                        color: selectedRoom === room.name ? 'white' : '#333', 
                        border: 'none', 
                        borderRadius: '4px', 
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      {selectedRoom === room.name ? '✓ Selected' : 'Select Room'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 3: GUEST DETAILS & CHECKOUT */}
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'sticky', top: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', borderBottom: '2px solid #2d4a22', paddingBottom: '10px', margin: '0 0 20px 0' }}>2. Guest Details</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>Full Name *</label>
                  <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>Email Address</label>
                  <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>Phone Number</label>
                  <input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>Guest Ages (e.g. 2 adults, 1 child age 5)</label>
                  <input type="text" value={guestAges} onChange={(e) => setGuestAges(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
                </div>

                {/* Booking Summary Box */}
                <div style={{ backgroundColor: '#f4f7f6', padding: '15px', borderRadius: '6px', marginTop: '10px', border: '1px solid #e1e8e4' }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}><strong>Room:</strong> {selectedRoom || 'None selected'}</p>
                  <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}><strong>Dates:</strong> {checkIn ? `${checkIn} to ${checkOut}` : 'None selected'}</p>
                </div>

                <button 
                  onClick={handleBooking}
                  style={{ width: '100%', padding: '15px', backgroundColor: '#2d4a22', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 6px rgba(45, 74, 34, 0.3)' }}
                >
                  Confirm Reservation
                </button>
                
                {statusMessage && (
                  <p style={{ margin: '15px 0 0 0', padding: '10px', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold', backgroundColor: statusMessage.includes('successfully') ? '#d4edda' : '#f8d7da', color: statusMessage.includes('successfully') ? '#155724' : '#721c24' }}>
                    {statusMessage}
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default BookingPage;