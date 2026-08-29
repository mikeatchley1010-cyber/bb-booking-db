import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif', paddingBottom: '60px' }}>
      
      {/* HERO SECTION */}
      <div style={{ 
        height: '40vh', 
        minHeight: '350px',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url("/Housecabin.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1 style={{ fontSize: '4rem', margin: '0 0 15px 0', fontWeight: '300', letterSpacing: '2px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          Cleghorn Canyon
        </h1>
        <p style={{ fontSize: '1.5rem', fontStyle: 'italic', margin: '0 0 30px 0', opacity: '0.9', textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
          Your private escape in the heart of the Black Hills
        </p>
        
        <Link to="/rooms-and-rates" style={{ 
          backgroundColor: '#2d4a22', 
          color: 'white', 
          padding: '15px 35px', 
          borderRadius: '4px', 
          textDecoration: 'none', 
          fontWeight: 'bold', 
          fontSize: '1.2rem',
          transition: 'background-color 0.2s',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
        }}>
          Book Your Stay
        </Link>
      </div>

      {/* WELCOME SECTION */}
      <div style={{ maxWidth: '900px', margin: '50px auto', padding: '0 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#2d4a22', marginBottom: '20px' }}>Welcome to Our Bed & Breakfast</h2>
        <p style={{ fontSize: '1.2rem', color: '#555', lineHeight: '1.8' }}>
          Nestled in the breathtaking scenery of Rapid City, Cleghorn Canyon Bed & Breakfast offers a peaceful retreat for nature lovers, adventurers, and those simply looking to unwind. Experience rustic charm combined with modern comforts, all just minutes away from the most iconic attractions in South Dakota.
        </p>
      </div>

      {/* HIGHLIGHTS CARDS */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        
        {/* BOX 1: Meet Your Hosts */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          
          {/* 👉 UPDATED: Now pointing to your local hosts.jpg file */}
          <div style={{ height: '220px', backgroundImage: 'url("/Host1.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#eee' }}></div>
          
          <div style={{ padding: '30px', flex: '1', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.6rem', color: '#2d4a22', marginBottom: '15px' }}>Meet Your Hosts</h3>
            <p style={{ color: '#666', lineHeight: '1.6', margin: 0 }}>
              We are thrilled to welcome you to our home. We love sharing our slice of heaven in the canyon and providing you with genuine hospitality, great food, and the best local tips.
            </p>
          </div>
        </div>

        {/* BOX 2: Perfect Location (Interactive Map) */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '220px', backgroundColor: '#eee' }}>
            <iframe 
              title="Cleghorn Canyon Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.5!2d-103.3134!3d44.0772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x877d5c90b63c87e1%3A0x6e78842cd8946726!2sCleghorn%20Canyon%20Rd%2C%20Rapid%20City%2C%20SD%2057702!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div style={{ padding: '30px', flex: '1', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.6rem', color: '#2d4a22', marginBottom: '15px' }}>Perfect Location</h3>
            <p style={{ color: '#666', lineHeight: '1.6', margin: 0 }}>
              The ideal basecamp for your Black Hills adventure. We are just minutes away from Rapid City, Mount Rushmore, Custer State Park, and the Badlands.
            </p>
          </div>
        </div>

        {/* BOX 3: Nature at Your Door */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          
          {/* 👉 UPDATED: Now pointing to your local nature.jpg file */}
          <div style={{ height: '220px', backgroundImage: 'url("/Canyonkake.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#eee' }}></div>
          
          <div style={{ padding: '30px', flex: '1', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.6rem', color: '#2d4a22', marginBottom: '15px' }}>Nature at Your Door</h3>
            <p style={{ color: '#666', lineHeight: '1.6', margin: 0 }}>
              Wake up to breathtaking canyon views, wandering local wildlife, and pristine hiking trails right outside your bedroom window.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;