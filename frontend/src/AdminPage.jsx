import { useState, useEffect } from 'react';

function AdminPage() {
  const [bookings, setBookings] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

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
        fetchBookings(); // Refresh the list instantly
      })
      .catch(() => setStatusMessage('Error canceling booking!'));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { timeZone: 'UTC' });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Admin Dashboard</h1>
      <p>Manage and cancel reservations here.</p>
      
      {statusMessage && <p style={{ fontWeight: 'bold', color: '#007bff' }}>{statusMessage}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#eee', textAlign: 'left' }}>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Room</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Check-In</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Check-Out</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ padding: '15px', textAlign: 'center', color: '#666' }}>
                No active reservations found.
              </td>
            </tr>
          ) : (
            bookings.map((b) => (
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