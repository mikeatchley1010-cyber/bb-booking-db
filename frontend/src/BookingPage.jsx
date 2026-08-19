import { useState, useEffect } from 'react';
import './App.css'; 

function BookingPage() {
  const [backendMessage, setBackendMessage] = useState('Waiting...');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  // UPDATED: Now defaults to Buffalo Ridge
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
      .catch(error => setStatusMessage('Error connecting to server!'));
  };

  const cancelBooking = (id) => {
    setStatusMessage('Canceling...');
    fetch(`https://bb-booking-db-1.onrender.com/api/bookings/${id}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
        setStatusMessage(data.message);
        fetchBookings(); 
      })
      .catch(error => setStatusMessage('Error canceling booking!'));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { timeZone: 'UTC' });
  };  
    return (
    <div className="booking-container">
      <h1>Cleghorn Canyon Bed and Breakfast</h1>
      <p>Server Status: {backendMessage}</p>
      
      {/* Your form, dropdowns, and other booking layout goes here! */}
      
    </div>
  );
}

export default BookingPage;