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
    
      
      Cleghorn Canyon Bed and Breakfast
      Server Status: {backendMessage}
      
      Book Your Stay
      
      
        Select Room or Package: 
         setSelectedRoom(e.target.value)}>
          
            Buffalo Ridge
            Bighorn Lookout
            Deer Run
          
          
            The Couples Package (Buffalo Ridge + Bighorn Lookout)
            The Full House Package (All 3 Rooms)
          
        
      
      
      
      Check-in:  setCheckIn(e.target.value)} />
      Check-out:  setCheckOut(e.target.value)} />
      
      Book Now
      
      {statusMessage}
      
      Current Reservations:
      
        {bookings.map((booking) => (
          
            {booking.room_name}: {formatDate(booking.check_in)} to {formatDate(booking.check_out)}
             cancelBooking(booking.id)}>Cancel
          
        ))}
      
    
  );
}

export default BookingPage;