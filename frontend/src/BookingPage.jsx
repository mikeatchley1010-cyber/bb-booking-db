import React, { useState } from 'react';

function BookingPage() {
  const [selectedRoom, setSelectedRoom] = useState('buffalo');
  // We now track the month the user is currently looking at
  const [viewDate, setViewDate] = useState(new Date()); 
  const [selectedDates, setSelectedDates] = useState([]); 
  const [errorMessage, setErrorMessage] = useState('');

  const rooms = [
    { id: 'buffalo', name: 'Buffalo Ridge' },
    { id: 'bighorn', name: 'BigHorn Lookout' },
    { id: 'deer', name: 'Deer Run' },
    { id: 'combo-bd', name: 'Family Combo: BigHorn + Deer Run' },
    { id: 'family', name: 'Ultimate Family Package (All Rooms)' }
  ];

  // CLEARED OUT: All dates are now completely open!
  // These will eventually be filled by your database with formatted dates like "2026-09-15"
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
  
  // Format a Date object to "YYYY-MM-DD" for accurate tracking
  const formatDate = (dateObj) => {
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
  };

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  
  const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // --- NAVIGATION CONTROLS ---
  // Disable "Previous" if we are looking at the current month
  const isPrevDisabled = currentYear === today.getFullYear() && currentMonth === today.getMonth();
  // Disable "Next" if we are 12 months ahead
  const isNextDisabled = currentYear === today.getFullYear() + 1 && currentMonth === today.getMonth();

  const handlePrevMonth = () => {
    if (!isPrevDisabled) setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    if (!isNextDisabled) setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // --- 3-NIGHT MINIMUM LOGIC ---
  const handleDateClick = (day, isBooked, isPast) => {
    if (isBooked || isPast) return;

    setErrorMessage('');

    // Create real Date objects for the 3 days so it can cross over into new months safely
    const d1 = new Date(currentYear, currentMonth, day);
    const d2 = new Date(currentYear, currentMonth, day + 1);
    const d3 = new Date(currentYear, currentMonth, day + 2);

    const s1 = formatDate(d1);
    const s2 = formatDate(d2);
    const s3 = formatDate(d3);

    // Check if the 2nd or 3rd day are already booked
    if (currentBookedDates.includes(s2) || currentBookedDates.includes(s3)) {
      setErrorMessage(`Cannot book starting on this date. The mandatory 3-night stay overlaps with an existing reservation.`);
      setSelectedDates([]);
      return;
    }

    // Success! Save the exact formatted dates
    setSelectedDates([s1, s2, s3]);
  };

  const handleRoomChange = (roomId) => {
    setSelectedRoom(roomId);
    setSelectedDates([]);
    setErrorMessage('');
  };

  // Helper to make selected dates look pretty for the user at the bottom
  const displayPrettyDate = (dateString) => {
    if (!dateString) return '';
    const [y, m, d] = dateString.split('-');
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('default', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', fontFamily: '"Helvetica Neue", Arial, sans-serif' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2d4a22', marginBottom: '15px' }}>Check Availability</h1>
        <p style={{ fontSize: '1.2rem', color: '#555', fontWeight: 'bold' }}>
          * Please note: All reservations require a minimum 3-night stay.
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
        
        {/* Month Navigation Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button 
            onClick={handlePrevMonth} 
            disabled={isPrevDisabled}
            style={{ padding: '8px 15px', backgroundColor: isPrevDisabled ? '#eee' : '#2d4a22', color: isPrevDisabled ? '#aaa' : 'white', border: 'none', borderRadius: '4px', cursor: isPrevDisabled ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          >
            &larr; Prev
          </button>
          
          <h2 style={{ color: '#2d4a22', fontSize: '1.8rem', margin: 0 }}>
            {monthName}
          </h2>

          <button 
            onClick={handleNextMonth} 
            disabled={isNextDisabled}
            style={{ padding: '8px 15px', backgroundColor: isNextDisabled ? '#eee' : '#2d4a22', color: isNextDisabled ? '#aaa' : 'white', border: 'none', borderRadius: '4px', cursor: isNextDisabled ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          >
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
            const isSelected = selectedDates.includes(dateStr);
            
            // Check if date is in the past (before today)
            const isPast = new Date(currentYear, currentMonth, day, 23, 59, 59) < today;

            let bgColor = '#e2e3e5'; // Default available
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
        <div style={{ marginTop: '30px', textAlign: 'center', minHeight: '60px' }}>
          {selectedDates.length > 0 ? (
            <div>
              <p style={{ fontSize: '1.2rem', color: '#2d4a22', fontWeight: 'bold', marginBottom: '15px' }}>
                3-Night Stay Selected: <br/> 
                {displayPrettyDate(selectedDates[0])} – Checkout {displayPrettyDate(selectedDates[2])}
              </p>
              <button style={{ backgroundColor: '#2d4a22', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                Continue to Booking
              </button>
            </div>
          ) : (
            <p style={{ fontSize: '1.1rem', color: '#666', fontStyle: 'italic', marginTop: '10px' }}>
              Click on an available start date to reserve your 3-night block.
            </p>
          )}
        </div>

      </div>

    </div>
  );
}

export default BookingPage;