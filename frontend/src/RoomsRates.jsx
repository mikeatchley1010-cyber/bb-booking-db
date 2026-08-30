import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function RoomsRates() {
  // NEW: State to track which image is currently expanded
  const [expandedImg, setExpandedImg] = useState(null);

  // I have rearranged this list to match your exact requested order!
  const rooms = [
    {
      id: 'family',
      name: 'Ultimate Family Package (All Rooms)',
      rate: '$395 / night',
      description: 'Book the entire Bed & Breakfast for your ultimate private getaway. Enjoy exclusive access to all three rooms—Buffalo Ridge, BigHorn Lookout, and Deer Run—for your family or group.',
      features: ['Three Bedrooms/Bathrooms','Free Hot Breakfast', 'Sleeps up to 6 Adults', 'Accommidates small children','Roll away; pack & play available', 'Ultimate Privacy', 'Free Wi-Fi & TV'],
      images: ['/Buffalo2.JPG', '/Bighorn2-rm.jpeg']
    },    {
      id: 'combo-bd',
      name: 'Family Combo: BigHorn & Deer Run',
      rate: '$295 / night',
      description: 'Perfect for families with kids! These two rooms feature a convenient adjoining door, giving you the space and privacy of two separate rooms while keeping everyone safely connected.',
      features: ['Two Bedrooms/Bathrooms','1 Queen Bed & 1 Double + trundel bed','Sleeps up to 4 Adults', 'Accommidates small children', 'Free Hot Breakfast', 'Adjoining Door','Free Wi-Fi & TV'],
      images: ['/BigHornrm3.JPG', '/deerrun2.JPG']
    },
    {
      id: 'buffalo',
      name: 'Buffalo Ridge',
      rate: '$175 / night',
      description: 'A cozy, rustic retreat with sweeping valley views and premium comforts. The perfect getaway to unwind and disconnect.',
      features: ['Queen Size Bed', 'En-suite Bathroom', 'Private Balcony', 'Free Hot Breakfast', 'Free Wi-Fi & TV'],
      images: ['/Buffaloridge.JPG', '/BuffaloBath1.jpeg']
    },
    {
      id: 'bighorn',
      name: 'BigHorn Lookout',
      rate: '$175 / night',
      description: 'Spacious and bright, featuring a private balcony perfect for your morning Home rosted coffee while watching the sun rise over the canyon.',
      features: ['Queen Size Bed', 'En-suite Bathroom', 'Private Balcony', 'Sitting Area', 'Free Hot Breakfast', 'Free Wi-Fi & TV'],
      images: ['/Bighorn2-rm.jpeg', '/Bighorn-bath.jpeg']
    },
    {
      id: 'deer',
      name: 'Deer Run',
      rate: '$150 / night',
      description: 'A peaceful, secluded room tucked away for ultimate privacy and relaxation after a long day of exploring the Black Hills.',
      features: ['Double Size Bed & Trundel Bed', 'En-suite Bathroom', 'private access to Large back deck', 'Walk-in Shower', , 'Free Hot Breakfast','Free Wi-Fi & TV'],
      images: ['/Deerrun1-rm.jpeg', '/deerrunbath.JPG']
    }
  ];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto', fontFamily: '"Helvetica Neue", Arial, sans-serif' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2d4a22', marginBottom: '15px' }}>Rooms, Rates & Packages</h1>
        <p style={{ fontSize: '1.2rem', color: '#555', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          Experience the comfort and tranquility of Cleghorn Canyon. All reservations require a 2-night minimum stay.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
        {rooms.map((room) => (
          <div key={room.id} style={{ display: 'flex', flexWrap: 'wrap', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            
            {/* The 2-Picture Side-by-Side Layout */}
            <div style={{ flex: '1 1 400px', display: 'flex', gap: '2px', backgroundColor: '#eee', minHeight: '350px' }}>
              {room.images.map((img, index) => (
                <div 
                  key={index} 
                  onClick={() => setExpandedImg(img)} // NEW: Click to expand
                  title="Click to expand"
                  style={{ 
                    flex: '1', 
                    backgroundImage: `url(${img})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                    cursor: 'zoom-in', // Shows magnifying glass
                    transition: 'opacity 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                ></div>
              ))}
            </div>
            
            {/* Room Details Container */}
            <div style={{ flex: '1 1 400px', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ fontSize: '2rem', color: '#2d4a22', margin: 0 }}>{room.name}</h2>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#555', backgroundColor: '#f4f7f6', padding: '8px 15px', borderRadius: '20px' }}>{room.rate}</span>
              </div>
              
              <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>{room.description}</p>
              
              <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: 0, margin: '0 0 30px 0', listStyle: 'none' }}>
                {room.features.map((feature, i) => (
                  <li key={i} style={{ color: '#555', fontSize: '0.95rem' }}>✓ {feature}</li>
                ))}
              </ul>

              <Link to="/availability" style={{ alignSelf: 'flex-start', backgroundColor: '#2d4a22', color: 'white', padding: '12px 25px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
                Check Availability
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* NEW: LIGHTBOX OVERLAY */}
      {expandedImg && (
        <div 
          onClick={() => setExpandedImg(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'zoom-out'
          }}
        >
          <button 
            onClick={() => setExpandedImg(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '30px',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '3rem',
              cursor: 'pointer',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            &times;
          </button>
          <img 
            src={expandedImg} 
            alt="Expanded room view" 
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              borderRadius: '8px',
              boxShadow: '0 5px 25px rgba(0,0,0,0.5)',
              objectFit: 'contain'
            }} 
            onClick={(e) => e.stopPropagation()} // Prevents clicking the image itself from closing it
          />
        </div>
      )}

    </div>
  );
}

export default RoomsRates;