import React, { useState } from 'react';

function BookingPage() {
  const [selectedRoom, setSelectedRoom] = useState('buffalo');
  const [viewDate, setViewDate] = useState(new Date()); 
  
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const rooms = [
    { id: 'buffalo', name: 'Buffalo Ridge' },
    { id: 'bighorn', name: 'BigHorn Lookout' },
    { id: 'deer', name: 'Deer Run' },
    { id: 'combo-bd', name: 'Family Combo: BigHorn & Deer Run' },
    { id: 'family', name: 'Ultimate Family Package (All Rooms)' }
  ];

  // Base booked dates (Open for now, ready for your database later!)
  const baseBookedDates = {
    buffalo: [],
    bighorn: [],
    deer: []
  };

  const getBookedForRoom = (roomId) => {
    if (roomId === 'buffalo') return baseBookedDates.buffalo;
    if (roomId === 'bighorn') return baseBookedDates.bighorn;
    if (roomId === 'deer') return baseBookedDates.deer;
    
    if (roomId === 'combo-bd') {
      return [...new Set([...baseBookedDates.bighorn, ...baseBookedDates.deer])];
    }
    if (roomId === 'family') {
      return [...new Set([...baseBookedDates.buffalo, ...baseBookedDates.bighorn, ...baseBookedDates.deer])];
    }
    return [];
  };

  const currentBookedDates = getBookedForRoom(selectedRoom);

  // --- CALENDAR & DATE MATH ---
  const today = new Date();
  
  const formatDate = (dateObj) => {
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
  };

  const parseDate = (dateStr) => {
    const [y, m, d] = dateStr.split('-');
    return new Date(y, m - 1, d);
  };

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

  // Helper function to check if a range of dates hits any already-booked dates
  const checkOverlap = (startDate, endDate) => {
    let current = new Date(startDate);
    while (current <= endDate) {
      if (currentBookedDates.includes(formatDate(current))) return true;
      current.setDate(current.getDate() + 1);
    }
    return false;
  };

  // --- SMART AUTO-SELECT LOGIC ---
  const handleDateClick = (day, isBooked, isPast) => {
    if (isPast) return;
    setErrorMessage('');

    const clickedDateStr = formatDate(new Date(currentYear, currentMonth, day));
    const dClicked = parseDate(clickedDateStr);

    // SCENARIO 1: We already have a check-in. Are they trying to extend their stay?
    if (checkIn) {
      const dCheckIn = parseDate(checkIn);
      
      // If they clicked a date AFTER their check-in
      if (dClicked > dCheckIn) {
        const diffTime = Math.abs(dClicked - dCheckIn);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // If it's a valid extension (3 or more nights)
        if (diffDays >= 3) {
          if (checkOverlap(dCheckIn, dClicked)) {
            setErrorMessage('Cannot extend to this date. It overlaps with an existing reservation.');
            return;
          }
          // Success! Extend the checkout date!
          setCheckOut(clickedDateStr);
          return;
        }
      }
    }

    // SCENARIO 2: Brand new selection OR they clicked a date to start over
    if (isBooked) {
      setErrorMessage('This date is already booked.');
      return;
    }

    // Automatically calculate the checkout date (3 days later)
    const autoCheckOutDate = new Date(dClicked);
    autoCheckOutDate.setDate(autoCheckOutDate.getDate() + 3);

    // Ensure this new 3-day block doesn't hit someone else's reservation
    if (checkOverlap(dClicked, autoCheckOutDate)) {
      setErrorMessage('Cannot start here. The mandatory 3-night minimum stay overlaps with an existing reservation.');
      return;
    }

    // Success! Lock in the 3 nights automatically!
    setCheckIn(clickedDateStr);
    setCheckOut(formatDate(autoCheckOutDate));
  };

  const handleRoomChange = (roomId) => {
    setSelectedRoom(roomId);
    setCheckIn(null);
    setCheckOut(null);
    setErrorMessage('');
  };

  const displayPrettyDate = (dateString) => {
    if (!dateString) return '';
    return parseDate(dateString).toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Generate an array of all selected dates to highlight them green on the calendar
  let selectedDatesArray = [];
  if (checkIn && checkOut) {
    let curr = parseDate(checkIn);
    const last = parseDate(checkOut);
    while (curr <= last) {
      selectedDatesArray.push(formatDate(curr));
      curr.setDate(curr.getDate() + 1);
    }
  }

  // Calculate total nights
  let totalNights = 0;
  if (checkIn && checkOut) {
    totalNights = Math.ceil(Math.abs(parseDate(checkOut) - parseDate(checkIn)) / (1000 * 60 * 60 * 24));
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', fontFamily: '"Helvetica Neue", Arial, sans-serif' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2d4a22', marginBottom: '15px' }}>Check Availability</h1>
        <p style={{ fontSize: '1.2rem', color: '#555', fontWeight: 'bold' }}>
          * All reservations require a minimum 3-night stay.
        </p>
      </div>

      {/* ROOM SELECTOR TABS */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {rooms.map(room => (
          <button 
            key={room.id}
            onClick={() => handleRoomChange(room.id)}
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: selectedRoom === room.id ? '#2d4a22' : '#e9ecef',
              color: selectedRoom === room.id ? 'white' : '#555',
              transition: 'all 0.2s',
              boxShadow: selectedRoom === room.id ? '0 4px 10px rgba(45,74,34,0.3)' : 'none'
            }}
          >
            {room.name}
          </button>
        ))}
      </div>

      {/* CALENDAR CONTAINER */}
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button onClick={handlePrevMonth} disabled={isPrevDisabled} style={{ padding: '8px 15px', backgroundColor: isPrevDisabled ? '#eee' : '#2d4a22', color: isPrevDisabled ? '#aaa' : 'white', border: 'none', borderRadius: '4px', cursor: isPrevDisabled ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
            &larr; Prev
          </button>
          
          <h2 style={{ color: '#2d4a22', fontSize: '1.8rem', margin: 0 }}>{monthName}</h2>

          <button onClick={handleNextMonth} disabled={isNextDisabled} style={{ padding: '8px 15px', backgroundColor: isNextDisabled ? '#eee' : '#2d4a22', color: isNextDisabled ? '#aaa' : 'white', border: 'none', borderRadius: '4px', cursor: isNextDisabled ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
            Next &rarr;
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center', fontWeight: 'bold', color: '#666', marginBottom: '15px' }}>
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
          {emptyDays.map(step => (
            <div key={`empty-${step}`} style={{ padding: '15px' }}></div>
          ))}

          {days.map(day => {
            const dateStr = formatDate(new Date(currentYear, currentMonth, day));
            const isBooked = currentBookedDates.includes(dateStr);
            const isSelected = selectedDatesArray.includes(dateStr);
            const isPast = new Date(currentYear, currentMonth, day, 23, 59, 59) < today;

            let bgColor = '#e2e3e5';
            let txtColor = '#333';
            let cursorStyle = 'pointer';

            if (isPast) {
              bgColor = '#f5f5f5';
              txtColor = '#ccc';
              cursorStyle = 'not-allowed';
            } else if (isSelected) {
              bgColor = '#2d4a22';
              txtColor = 'white';
            } else if (isBooked) {
              bgColor = '#f8d7da';
              txtColor = '#721c24';
              cursorStyle = 'not-allowed';
            }

            return (
              <div 
                key={day} 
                onClick={() => handleDateClick(day, isBooked, isPast)}
                style={{
                  padding: '15px 5px',
                  textAlign: 'center',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: cursorStyle,
                  backgroundColor: bgColor,
                  color: txtColor,
                  textDecoration: (isBooked || isPast) ? 'line-through' : 'none',
                  border: isSelected ? '2px solid #1a2e13' : '2px solid transparent',
                  opacity: (isBooked || isPast) ? 0.6 : 1,
                  transition: 'background-color 0.2s'
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
        
        {/* Error Message Space */}
        {errorMessage && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '6px', textAlign: 'center', fontWeight: 'bold' }}>
            {errorMessage}
          </div>
        )}

        {/* Selection Feedback */}
        <div style={{ marginTop: '30px', textAlign: 'center', minHeight: '80px' }}>
          {!checkIn && (
             <p style={{ fontSize: '1.1rem', color: '#666', fontStyle: 'italic', marginTop: '10px' }}>
               Click your desired <strong>Check-In</strong> date. We will automatically select your 3-night minimum stay.
             </p>
          )}

          {checkIn && checkOut && (
            <div>
              <p style={{ fontSize: '1.2rem', color: '#2d4a22', fontWeight: 'bold', marginBottom: '5px' }}>
                {totalNights}-Night Stay Selected: <br/> 
                {displayPrettyDate(checkIn)} – {displayPrettyDate(checkOut)}
              </p>
              <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '15px', fontStyle: 'italic' }}>
                Want to stay longer? Click any available date after your checkout to extend your stay, or choose a new start date.
              </p>
              <button style={{ backgroundColor: '#2d4a22', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                Continue to Booking
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default BookingPage;