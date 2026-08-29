import React from 'react';

function Contact() {
  
  // 👉 UPDATE THIS WITH YOUR REAL PHONE NUMBER!
  const displayPhone = "(605) 646-0257"; 
  const clickToCallLink = "tel:6056460257"; // No dashes or spaces here, just the numbers

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', fontFamily: '"Helvetica Neue", Arial, sans-serif' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2d4a22', marginBottom: '15px' }}>Contact Us</h1>
        <p style={{ fontSize: '1.2rem', color: '#555', lineHeight: '1.6' }}>
          We would love to hear from you! Reach out with any questions about your stay, special requests, or booking inquiries.
        </p>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '50px 30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* EMAIL SECTION */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#555', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Us</h2>
          {/* This href="mailto:..." is what opens their email app automatically */}
          <a 
            href="mailto:cleghorn.canyonbb@gmail.com" 
            style={{ fontSize: '1.4rem', color: '#2d4a22', fontWeight: 'bold', textDecoration: 'none', borderBottom: '2px solid #2d4a22', paddingBottom: '2px' }}
          >
            cleghorn.canyonbb@gmail.com
          </a>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eaeaea', width: '60%', margin: '0 auto' }} />

        {/* PHONE SECTION */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#555', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Call Us</h2>
          {/* This href="tel:..." is what makes cell phones dial the number instantly */}
          <a 
            href={clickToCallLink} 
            style={{ fontSize: '1.4rem', color: 'white', backgroundColor: '#2d4a22', fontWeight: 'bold', textDecoration: 'none', padding: '12px 30px', borderRadius: '30px', display: 'inline-block', boxShadow: '0 4px 10px rgba(45,74,34,0.3)', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            📞 {displayPhone}
          </a>
          <p style={{ fontSize: '0.95rem', color: '#888', marginTop: '15px', fontStyle: 'italic' }}>
            (Tap the button from your mobile phone to call instantly)
          </p>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eaeaea', width: '60%', margin: '0 auto' }} />

        {/* LOCATION SECTION */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#555', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Location</h2>
          <p style={{ fontSize: '1.2rem', color: '#333', margin: 0, lineHeight: '1.6' }}>
            Cleghorn Canyon Rd<br />
            Rapid City, SD 57702
          </p>
        </div>

      </div>
    </div>
  );
}

export default Contact;