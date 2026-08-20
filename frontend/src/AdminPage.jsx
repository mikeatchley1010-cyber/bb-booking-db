import { useState, useEffect } from 'react';

function AdminPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch all bookings from your backend
    fetch('https://bb-booking-db-1.onrender.com/api/bookings')
      .then(response => response.json())
      .then(data => setBookings(data));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <p>Manage your reservations here.</p>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#eee', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Guest/Room</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Check-In</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Check-Out</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{b.room_name}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{b.check_in}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{b.check_out}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;