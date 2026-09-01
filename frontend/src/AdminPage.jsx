import { useState, useEffect } from 'react';

function AdminPage() {
  // --- Security State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // --- Dashboard State ---
  const [bookings, setBookings] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedRoomFilter, setSelectedRoomFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc'); 

  // --- Block Dates State ---
  const [blockRoom, setBlockRoom] = useState('buffalo');
  const [blockCheckIn, setBlockCheckIn] = useState('');
  const [blockCheckOut, setBlockCheckOut] = useState('');
  const [blockReason, setBlockReason] = useState('Blocked for Maintenance');
  const [blockStatus, setBlockStatus] = useState('');

  const fetchBookings = () => {
    fetch('https://bb-booking-db-1.onrender.com/api/bookings')
      .then(response => response.json())
      .then(data => setBookings(data));
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'Cleghorn2026') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Incorrect password. Please try again.');
      setPasswordInput('');
    }
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

  // 👉 NEW: Function to bypass Stripe and force a block into the database
  const handleBlockDates = async (e) => {
    e.preventDefault();
    setBlockStatus('Blocking dates...');

    const checkInDate = new Date(blockCheckIn);
    const checkOutDate = new Date(blockCheckOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights < 1) {
      setBlockStatus('Check-out must be at least 1 day after check-in!');
      return;
    }

    const payload = {
      room: blockRoom,
      checkIn: blockCheckIn,
      checkOut: blockCheckOut,
      nights: nights,
      guest: {
        name: `ADMIN BLOCK: ${blockReason}`,
        email: 'Not Provided',
        phone: 'Not Provided',
        guestCount: '0',
        guestAges: 'N/A'
      },
      promoCode: ''
    };

    try {
      const response = await fetch('https://bb-booking-db-1.onrender.com/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setBlockStatus('Dates successfully blocked!');
        setBlockCheckIn('');
        setBlockCheckOut('');
        setBlockReason('Blocked for Maintenance');
        fetchBookings(); // Refresh the table
        setTimeout(() => setBlockStatus(''), 3000);
      } else {
        const data = await response.json();
        setBlockStatus(`Error: ${data.message}`);
      }
    } catch (err) {
      setBlockStatus('Network error while blocking dates.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { timeZone: 'UTC' });
  };

  const filteredBookings = bookings.filter(b => {
    if (selectedRoomFilter === 'All') return true;
    return b.room_name === selectedRoomFilter;
  });

  const sortedBookings = filteredBookings.sort((a, b) => {
    const dateA = new Date(a.check_in);
    const dateB = new Date(b.check_in);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // --- Login Screen ---
  if (!isAuthenticated) {
    return (
      <div style={{ padding: '50px 20px', maxWidth: '400px', margin: '0 auto', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h2>Admin Access Required</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <input 
            type="password" 
            placeholder="Enter Password" 
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button 
            type="submit"
            style={{ background: '#333', color: 'white', border: 'none', padding: '10px', fontSize: '16px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Unlock Dashboard
          </button>
        </form>
        {loginError && <p style={{ color: '#dc3545', marginTop: '15px', fontWeight: 'bold' }}>{loginError}</p>}
      </div>
    );
  }

  // --- Main Dashboard ---
  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <a 
            href="https://dashboard.stripe.com" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ backgroundColor: '#635bff', color: 'white', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 2px 4px rgba(99, 91, 255, 0.3)' }}
          >
            Stripe Dashboard &rarr;
          </a>

          <button 
            onClick={() => setIsAuthenticated(false)}
            style={{ background: 'transparent', border: '1px solid #333', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Log Out
          </button>
        </div>
      </div>
      
      {/* 👉 NEW: Manual Date Blocker Form */}
      <div style={{ background: '#fff3cd', border: '1px solid #ffeeba', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#856404' }}>Manual Date Blocker</h3>
        <form onSubmit={handleBlockDates} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
          
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px', color: '#856404' }}>Room to Block:</label>
            <select required value={blockRoom} onChange={(e) => setBlockRoom(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="buffalo">Buffalo Ridge</option>
              <option value="bighorn">BigHorn Lookout</option>
              <option value="deer">Deer Run</option>
              <option value="combo-bd">Family Combo (BigHorn & Deer)</option>
              <option value="family">Ultimate Family Package (All Rooms)</option>
            </select>
          </div>

          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px', color: '#856404' }}>Check-In:</label>
            <input type="date" required value={blockCheckIn} onChange={(e) => setBlockCheckIn(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px', color: '#856404' }}>Check-Out:</label>
            <input type="date" required value={blockCheckOut} onChange={(e) => setBlockCheckOut(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px', color: '#856404' }}>Reason (Optional):</label>
            <input type="text" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="e.g. Cash Booking / Maintenance" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <button type="submit" style={{ flex: '1 1 150px', background: '#d39e00', color: 'white', border: 'none', padding: '11px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Block Dates
          </button>
        </form>
        {blockStatus && <p style={{ margin: '15px 0 0 0', fontWeight: 'bold', color: blockStatus.includes('Error') ? '#dc3545' : '#28a745' }}>{blockStatus}</p>}
      </div>

      <p>Manage and review your incoming reservations.</p>
      {statusMessage && <p style={{ fontWeight: 'bold', color: '#007bff' }}>{statusMessage}</p>}

      <div style={{ display: 'flex', gap: '20px', background: '#f4f4f4', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Filter by Room:</label>
          <select 
            value={selectedRoomFilter} 
            onChange={(e) => setSelectedRoomFilter(e.target.value)}
            style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="All">All Rooms</option>
            <option value="Buffalo Ridge">Buffalo Ridge</option>
            <option value="BigHorn Lookout">BigHorn Lookout</option>
            <option value="Deer Run">Deer Run</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Sort by Check-In:</label>
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="asc">Soonest First</option>
            <option value="desc">Latest First</option>
          </select>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#eee', textAlign: 'left' }}>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Guest / Reason</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Contact</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Room</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Check-In</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Check-Out</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedBookings.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ padding: '15px', textAlign: 'center', color: '#666' }}>
                No reservations match your filter criteria.
              </td>
            </tr>
          ) : (
            sortedBookings.map((b) => (
              <tr key={b.id} style={{ backgroundColor: b.guest_name.includes('ADMIN BLOCK') ? '#fff3cd' : 'transparent' }}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}><strong>{b.guest_name || 'N/A'}</strong></td>
                <td style={{ padding: '12px', border: '1px solid #ddd', fontSize: '14px' }}>
                  {b.guest_email !== 'Not Provided' && <div>{b.guest_email}</div>}
                  {b.guest_phone !== 'Not Provided' && <div style={{ color: '#555' }}>{b.guest_phone}</div>}
                  {b.guest_email === 'Not Provided' && b.guest_phone === 'Not Provided' && 'N/A'}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}><strong>{b.room_name}</strong></td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{formatDate(b.check_in)}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{formatDate(b.check_out)}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                  <button 
                    onClick={() => cancelBooking(b.id)}
                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                  >
                    {b.guest_name.includes('ADMIN BLOCK') ? 'Unblock' : 'Cancel'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;