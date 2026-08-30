import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// 👉 PASTE YOUR STRIPE PUBLISHABLE KEY HERE (starts with pk_test_...)
const stripePromise = loadStripe('pk_test_51UAHYQC29RQhxkOLAeOU4BAkz2ICDMHrLrYaPuardevJD3v2hdsuGbXaw6EciEk9BYaq8TT3185z0JHUukJv0puF009uytCKN1');

// --- THE SECURE STRIPE CHECKOUT FORM ---
const CheckoutForm = ({ bookingData, onSuccess, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage('');

    // 1. Tell Stripe to process the card securely
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // We handle the redirect manually so we can save to our database first
      },
      redirect: 'if_required' 
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // 2. If the card is approved, save the booking to your Render database!
      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData)
        });

        if (response.ok) {
          onSuccess();
        } else {
          setErrorMessage("Payment successful, but there was an error saving the booking. Please contact us.");
          setIsProcessing(false);
        }
      } catch (err) {
        console.error("Booking save error:", err);
        setErrorMessage("Network error saving booking.");
        setIsProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <PaymentElement />
      {errorMessage && <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', marginTop: '10px', fontWeight: 'bold' }}>{errorMessage}</div>}
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button type="button" onClick={onBack} disabled={isProcessing} style={{ flex: '1', padding: '12px', backgroundColor: '#e2e3e5', color: '#333', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>
          &larr; Back
        </button>
        <button type="submit" disabled={isProcessing || !stripe || !elements} style={{ flex: '2', padding: '12px', backgroundColor: '#2d4a22', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: isProcessing ? 'wait' : 'pointer', fontSize: '1.1rem' }}>
          {isProcessing ? 'Processing Payment...' : 'Pay & Confirm Reservation'}
        </button>
      </div>
    </form>
  );
};


// --- YOUR MAIN BOOKING PAGE ---
function BookingPage() {
  const location = useLocation();
  
  const [selectedRoom, setSelectedRoom] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('room') || 'family';
  });

  const [viewDate, setViewDate] = useState(new Date()); 
  
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '', phone: '' });
  const [bookingStatus, setBookingStatus] = useState('');
  const [baseBookedDates, setBaseBookedDates] = useState({ buffalo: [], bighorn: [], deer: [] });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings'); 
        if (response.ok) {
          const data = await response.json();
          const booked = { buffalo: [], bighorn: [], deer: [] };
          
          data.forEach(reservation => {
            let curr = new Date(reservation.check_in);
            curr.setMinutes(curr.getMinutes() + curr.getTimezoneOffset());
            
            let last = new Date(reservation.check_out);
            last.setMinutes(last.getMinutes() + last.getTimezoneOffset());

            while (curr < last) { 
              const dateStr = `${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2, '0')}-${String(curr.getDate()).padStart(2, '0')}`;
              if (reservation.room_name === 'buffalo') booked.buffalo.push(dateStr);
              if (reservation.room_name === 'bighorn') booked.bighorn.push(dateStr);
              if (reservation.room_name === 'deer') booked.deer.push(dateStr);
              curr.setDate(curr.getDate() + 1);
            }
          });
          setBaseBookedDates(booked);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roomFromUrl = queryParams.get('room');
    if (roomFromUrl) {
      setSelectedRoom(roomFromUrl);
      setCheckIn(null);
      setCheckOut(null);
      setErrorMessage('');
    }
  }, [location.search]);

  const rooms = [
    { id: 'family', name: 'Ultimate Family Package (All Rooms)' },
    { id: 'combo-bd', name: 'Family Combo: BigHorn & Deer Run' },
    { id: 'buffalo', name: 'Buffalo Ridge' },
    { id: 'bighorn', name: 'BigHorn Lookout' },
    { id: 'deer', name: 'Deer Run' }
  ];

  const getBookedForRoom = (roomId) => {
    if (roomId === 'buffalo') return baseBookedDates.buffalo;
    if (roomId === 'bighorn') return baseBookedDates.bighorn;
    if (roomId === 'deer') return baseBookedDates.deer;
    if (roomId === 'combo-bd') return [...new Set([...baseBookedDates.bighorn, ...baseBookedDates.deer])];
    if (roomId === 'family') return [...new Set([...baseBookedDates.buffalo, ...baseBookedDates.bighorn, ...baseBookedDates.deer])];
    return [];
  };

  const currentBookedDates = getBookedForRoom(selectedRoom);
  const today = new Date();
  const formatDate = (dateObj) => `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
  const parseDate = (dateStr) => { const [y, m, d] = dateStr.split('-'); return new Date(y, m - 1, d); };

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isPrevDisabled = currentYear === today.getFullYear() && currentMonth === today.getMonth();
  const isNextDisabled = currentYear === today.getFullYear() + 1 && currentMonth === today.getMonth();

  const handlePrevMonth = () => { if (!isPrevDisabled) setViewDate(new Date(currentYear, currentMonth - 1, 1)); };
  const handleNextMonth = () => { if (!isNextDisabled) setViewDate(new Date(currentYear, currentMonth + 1, 1)); };

  const checkOverlap = (startDate, endDate) => {
    let current = new Date(startDate);
    while (current <= endDate) {
      if (currentBookedDates.includes(formatDate(current))) return true;
      current.setDate(current.getDate() + 1);
    }
    return false;
  };

  const clearDates = () => {
    setCheckIn(null);
    setCheckOut(null);
    setErrorMessage('');
  };

  let selectedDatesArray = [];
  if (checkIn && checkOut) {
    let curr = parseDate(checkIn);
    const last = parseDate(checkOut);
    while (curr <= last) {
      selectedDatesArray.push(formatDate(curr));
      curr.setDate(curr.getDate() + 1);
    }
  }

  const handleDateClick = (day, isBooked, isPast) => {
    if (isPast) return;
    setErrorMessage('');

    const clickedDateStr = formatDate(new Date(currentYear, currentMonth, day));
    
    if (selectedDatesArray.includes(clickedDateStr)) {
      clearDates();
      return;
    }

    const dClicked = parseDate(clickedDateStr);

    if (checkIn) {
      const dCheckIn = parseDate(checkIn);
      if (dClicked > dCheckIn) {
        const diffDays = Math.ceil(Math.abs(dClicked - dCheckIn) / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 2) {
          if (checkOverlap(dCheckIn, dClicked)) {
            setErrorMessage('Cannot extend to this date. It overlaps with an existing reservation.');
            return;
          }
          setCheckOut(clickedDateStr);
          return;
        }
      }
    }

    if (isBooked) {
      setErrorMessage('This date is already booked.');
      return;
    }

    const autoCheckOutDate = new Date(dClicked);
    autoCheckOutDate.setDate(autoCheckOutDate.getDate() + 2);

    if (checkOverlap(dClicked, autoCheckOutDate)) {
      setErrorMessage('Cannot start here. The mandatory 2-night minimum stay overlaps with an existing reservation.');
      return;
    }

    setCheckIn(clickedDateStr);
    setCheckOut(formatDate(autoCheckOutDate));
  };

  const handleRoomChange = (roomId) => {
    setSelectedRoom(roomId);
    setCheckIn(null);
    setCheckOut(null);
    setErrorMessage('');
    setShowForm(false);
    setShowPayment(false);
    setBookingStatus('');
  };

  const displayPrettyDate = (dateString) => {
    if (!dateString) return '';
    return parseDate(dateString).toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  let totalNights = 0;
  if (checkIn && checkOut) {
    totalNights = Math.ceil(Math.abs(parseDate(checkOut) - parseDate(checkIn)) / (1000 * 60 * 60 * 24));
  }

  const handleInputChange = (e) => {
    setGuestInfo({ ...guestInfo, [e.target.name]: e.target.value });
  };

  const proceedToPayment = async (e) => {
    e.preventDefault();
    setBookingStatus('submitting');
    
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room: selectedRoom, nights: totalNights })
      });

      if (response.ok) {
        const data = await response.json();
        setClientSecret(data.clientSecret);
        setShowPayment(true);
        setBookingStatus('');
      } else {
        setBookingStatus('error');
      }
    } catch (error) {
      console.error("Payment Intent error:", error);
      setBookingStatus('error');
    }
  };

  const handleBookingSuccess = () => {
    setBookingStatus('success');
    setShowPayment(false);
    setShowForm(false);
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', fontFamily: '"Helvetica Neue", Arial, sans-serif' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2d4a22', marginBottom: '15px' }}>Check Availability</h1>
        <p style={{ fontSize: '1.2rem', color: '#555', fontWeight: 'bold' }}>
          * All reservations require a minimum 2-night stay.
        </p>
      </div>

      {!showForm && !showPayment && bookingStatus !== 'success' && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {rooms.map(room => (
            <button 
              key={room.id}
              onClick={() => handleRoomChange(room.id)}
              style={{
                padding: '10px 20px', fontSize: '1rem', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer',
                backgroundColor: selectedRoom === room.id ? '#2d4a22' : '#e9ecef', color: selectedRoom === room.id ? 'white' : '#555',
                boxShadow: selectedRoom === room.id ? '0 4px 10px rgba(45,74,34,0.3)' : 'none'
              }}
            >
              {room.name}
            </button>
          ))}
        </div>
      )}

      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '0 auto' }}>
        
        {!showForm && !showPayment && bookingStatus !== 'success' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <button onClick={handlePrevMonth} disabled={isPrevDisabled} style={{ padding: '8px 15px', backgroundColor: isPrevDisabled ? '#eee' : '#2d4a22', color: isPrevDisabled ? '#aaa' : 'white', border: 'none', borderRadius: '4px', cursor: isPrevDisabled ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>&larr; Prev</button>
              <h2 style={{ color: '#2d4a22', fontSize: '1.8rem', margin: 0 }}>{monthName}</h2>
              <button onClick={handleNextMonth} disabled={isNextDisabled} style={{ padding: '8px 15px', backgroundColor: isNextDisabled ? '#eee' : '#2d4a22', color: isNextDisabled ? '#aaa' : 'white', border: 'none', borderRadius: '4px', cursor: isNextDisabled ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>Next &rarr;</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center', fontWeight: 'bold', color: '#666', marginBottom: '15px' }}>
              <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
              {emptyDays.map(step => <div key={`empty-${step}`} style={{ padding: '15px' }}></div>)}
              {days.map(day => {
                const dateStr = formatDate(new Date(currentYear, currentMonth, day));
                const isBooked = currentBookedDates.includes(dateStr);
                const isSelected = selectedDatesArray.includes(dateStr);
                const isPast = new Date(currentYear, currentMonth, day, 23, 59, 59) < today;

                let bgColor = '#e2e3e5';
                let txtColor = '#333';
                let cursorStyle = 'pointer';

                if (isPast) { bgColor = '#f5f5f5'; txtColor = '#ccc'; cursorStyle = 'not-allowed'; }
                else if (isSelected) { bgColor = '#2d4a22'; txtColor = 'white'; }
                else if (isBooked) { bgColor = '#f8d7da'; txtColor = '#721c24'; cursorStyle = 'not-allowed'; }

                return (
                  <div key={day} onClick={() => handleDateClick(day, isBooked, isPast)}
                    style={{
                      padding: '15px 5px', textAlign: 'center', borderRadius: '6px', fontWeight: 'bold', cursor: cursorStyle,
                      backgroundColor: bgColor, color: txtColor, textDecoration: (isBooked || isPast) ? 'line-through' : 'none',
                      border: isSelected ? '2px solid #1a2e13' : '2px solid transparent', opacity: (isBooked || isPast) ? 0.6 : 1
                    }}>
                    {day}
                  </div>
                );
              })}
            </div>
            
            {errorMessage && ( <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '6px', textAlign: 'center', fontWeight: 'bold' }}>{errorMessage}</div> )}

            <div style={{ marginTop: '30px', textAlign: 'center', minHeight: '80px' }}>
              {!checkIn && <p style={{ fontSize: '1.1rem', color: '#666', fontStyle: 'italic' }}>Click your Check-In date. We will auto-select your 2-night minimum stay.</p>}
              
              {checkIn && checkOut && (
                <div>
                  <p style={{ fontSize: '1.2rem', color: '#2d4a22', fontWeight: 'bold', marginBottom: '15px' }}>{totalNights}-Night Stay Selected: <br/> {displayPrettyDate(checkIn)} – {displayPrettyDate(checkOut)}</p>
                  
                  <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={clearDates} style={{ backgroundColor: '#e2e3e5', color: '#333', padding: '12px 25px', border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                      Clear Dates
                    </button>

                    <button onClick={() => setShowForm(true)} style={{ backgroundColor: '#2d4a22', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                      Continue to Booking
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {showForm && !showPayment && (
          <div style={{ padding: '10px' }}>
            <h2 style={{ color: '#2d4a22', fontSize: '1.8rem', marginBottom: '10px', textAlign: 'center' }}>Guest Details</h2>
            
            <div style={{ backgroundColor: '#f4f7f6', padding: '15px', borderRadius: '8px', marginBottom: '25px' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}><strong>Room:</strong> {rooms.find(r => r.id === selectedRoom)?.name}</p>
              <p style={{ margin: '0', fontSize: '1.1rem' }}><strong>Dates:</strong> {displayPrettyDate(checkIn)} - {displayPrettyDate(checkOut)} ({totalNights} nights)</p>
            </div>

            <form onSubmit={proceedToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Full Name</label>
                <input type="text" name="name" required value={guestInfo.name} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }} placeholder="John Doe" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Email Address</label>
                <input type="email" name="email" required value={guestInfo.email} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }} placeholder="john@example.com" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Phone Number</label>
                <input type="tel" name="phone" required value={guestInfo.phone} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }} placeholder="(555) 123-4567" />
              </div>

              {bookingStatus === 'error' && (
                <p style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', margin: 0 }}>There was an error connecting to the server. Please try again.</p>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: '1', padding: '12px', backgroundColor: '#e2e3e5', color: '#333', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>
                  &larr; Back
                </button>
                <button type="submit" disabled={bookingStatus === 'submitting'} style={{ flex: '2', padding: '12px', backgroundColor: '#2d4a22', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: bookingStatus === 'submitting' ? 'wait' : 'pointer', fontSize: '1.1rem' }}>
                  {bookingStatus === 'submitting' ? 'Loading...' : 'Continue to Payment'}
                </button>
              </div>
            </form>
          </div>
        )}

        {showPayment && clientSecret && (
          <div style={{ padding: '10px' }}>
            <h2 style={{ color: '#2d4a22', fontSize: '1.8rem', marginBottom: '10px', textAlign: 'center' }}>Secure Checkout</h2>
            <div style={{ backgroundColor: '#f4f7f6', padding: '15px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center' }}>
              <p style={{ margin: '0', fontSize: '1.2rem' }}><strong>Total:</strong> ${(rooms.find(r => r.id === selectedRoom)?.id === 'buffalo' || rooms.find(r => r.id === selectedRoom)?.id === 'bighorn' ? 175 : rooms.find(r => r.id === selectedRoom)?.id === 'combo-bd' ? 295 : rooms.find(r => r.id === selectedRoom)?.id === 'family' ? 395 : 150) * totalNights}.00</p>
            </div>

            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm 
                bookingData={{ room: selectedRoom, checkIn, checkOut, guest: guestInfo }}
                onSuccess={handleBookingSuccess}
                onBack={() => setShowPayment(false)}
              />
            </Elements>
          </div>
        )}

        {bookingStatus === 'success' && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎉</div>
            <h3 style={{ color: '#2d4a22', fontSize: '1.5rem' }}>Payment & Booking Confirmed!</h3>
            <p style={{ color: '#555', fontSize: '1.1rem' }}>Thank you, {guestInfo.name}! Your reservation at Cleghorn Canyon is locked in.</p>
            <button onClick={() => { setShowForm(false); setShowPayment(false); setCheckIn(null); setCheckOut(null); setBookingStatus(''); }} style={{ marginTop: '20px', backgroundColor: '#2d4a22', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>
              Book Another Room
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default BookingPage;