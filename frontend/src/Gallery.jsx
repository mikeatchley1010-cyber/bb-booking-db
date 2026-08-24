import React from 'react';

function Gallery() {
  
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
          <div key={index} style={{ 
            height: '250px', 
            borderRadius: '8px', 
            overflow: 'hidden', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease'
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

    </div>
  );
}

export default Gallery;