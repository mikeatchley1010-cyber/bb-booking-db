import { useState, useEffect } from 'react';

function AdminPage() {
  const [bookings, setBookings] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedRoomFilter, setSelectedRoomFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for soonest first

  const fetchBookings = () => {
    fetch('https://bb-booking-db-1.onrender.com/api/bookings')
      .then(response => response.json())
      .then(data => setBookings(data));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

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

  // 1. Filter bookings by selected room
  const filteredBookings = bookings.filter(b => {
    if (selectedRoomFilter === 'All') return true;
    return b.room_name === selectedRoomFilter;
  });

  // 2. Sort bookings by check-in date
  const sortedBookings = filteredBookings.sort((a, b) => {
    const dateA = new Date(a.check_in);
    const dateB = new Date(b.check_in);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Admin Dashboard</h1>
      <p>Filter, sort, and manage your property's reservations.</p>
      
      {statusMessage && <p style={{ fontWeight: 'bold', color: '#007bff' }}>{statusMessage}</p>}

      {/* Controls Bar: Filtering & Sorting */}
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
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Room</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Check-In</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Check-Out</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedBookings.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ padding: '15px', textAlign: 'center', color: '#666' }}>
                No reservations match your filter criteria.
              </td>
            </tr>
          ) : (
            sortedBookings.map((b) => (
              <tr key={b.id}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}><strong>{b.room_name}</strong></td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{formatDate(b.check_in)}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{formatDate(b.check_out)}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                  <button 
                    onClick={() => cancelBooking(b.id)}
                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                  >
                    Cancel Booking
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