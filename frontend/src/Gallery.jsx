import React, { useState } from 'react';

function Gallery() {
  // NEW: State to track which image is currently expanded
  const [expandedImg, setExpandedImg] = useState(null);

  // Here are all your photos, mixed up for a beautifully varied gallery grid!
  const images = [
    "/Housemotorcycle.jpg",
    "/homemadepies.jpg",
    "/Mountrushnight.jpg",
    "/Donkeys.jpg",
    "/Bighorn41.jpg",
    "/Chapel.jpg",
    "/Turkey.JPG",
    "/whoopiepie.jpg",
    "/Cabinwall.jpg",
    "/Tunnle1.jpg",
    "/Breakfast2.jpg",
    "/Mountaingoat.jpg",
    "/Buffola4.jpg",
    "/Peacock.JPG",
    "/President2.jpg",
    "/Deerwall.JPG",
    "/BisonSign.jpg",
    "/Ironmgtsign.jpg"
  ];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: '"Helvetica Neue", Arial, sans-serif' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2d4a22', marginBottom: '15px' }}>Photo Gallery</h1>
        <p style={{ fontSize: '1.2rem', color: '#555', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          Take a look around Cleghorn Canyon, our cozy rooms, homemade treats, and the incredible wildlife and sights of the Black Hills.
        </p>
      </div>

      {/* The Gallery Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {images.map((img, index) => (
          <div 
            key={index} 
            onClick={() => setExpandedImg(img)} // NEW: Click to expand
            style={{ 
              height: '250px', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              cursor: 'zoom-in' // NEW: Shows magnifying glass cursor
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ 
              width: '100%', 
              height: '100%', 
              backgroundImage: `url(${img})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              backgroundColor: '#eee'
            }}></div>
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
            alt="Expanded view" 
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

export default Gallery;