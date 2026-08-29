import React, { useState } from 'react';

function ContactUs() {
  // Your actual contact details go here!
  const contactInfo = {
    phone: "(605) 646-0257",
    email: "cleghorn.canyonbb@gmail.com",
    address: "5625 Cleghorn Canyon Road, Rapid City, SD 57702"
  };

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Thank you! Your message has been sent. We will get back to you shortly.");
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', fontFamily: '"Helvetica Neue", Arial, sans-serif' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2d4a22', marginBottom: '15px' }}>Contact Us</h1>
        <p style={{ fontSize: '1.2rem', color: '#555', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          Have a question about a reservation, our rooms, or the local area? We would love to hear from you.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
        
        {/* Left Side: Contact Info */}
        <div style={{ flex: '1 1 350px', backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#2d4a22', marginBottom: '25px' }}>Get in Touch</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#555', marginBottom: '5px' }}>Phone</h3>
            <p style={{ fontSize: '1.2rem', color: '#333', fontWeight: 'bold' }}>{contactInfo.phone}</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#555', marginBottom: '5px' }}>Email</h3>
            <p style={{ fontSize: '1.2rem', color: '#333', fontWeight: 'bold' }}>{contactInfo.email}</p>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#555', marginBottom: '5px' }}>Location</h3>
            <p style={{ fontSize: '1.1rem', color: '#333', lineHeight: '1.5' }}>{contactInfo.address}</p>
          </div>

          <div style={{ height: '200px', backgroundColor: '#e9ecef', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c757d', fontStyle: 'italic' }}>
            Interactive Map Coming Soon!
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div style={{ flex: '2 1 400px', backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#2d4a22', marginBottom: '25px' }}>Send a Message</h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>Your Name *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>Email Address *</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>Subject</label>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>Message *</label>
              <textarea required value={message} onChange={(e) => setMessage(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', minHeight: '150px', resize: 'vertical' }}></textarea>
            </div>

            <button type="submit" style={{ backgroundColor: '#2d4a22', color: 'white', padding: '15px 30px', border: 'none', borderRadius: '6px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', alignSelf: 'flex-start', transition: 'background-color 0.2s' }}>
              Send Message
            </button>

            {status && (
              <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '6px', fontWeight: 'bold' }}>
                {status}
              </div>
            )}

          </form>
        </div>

      </div>
    </div>
  );
}

// THIS is the crucial line that was missing!
export default ContactUs;