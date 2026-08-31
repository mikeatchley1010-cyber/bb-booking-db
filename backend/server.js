require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const nodemailer = require('nodemailer'); 

// 👉 NEW: Force Render to use standard IPv4 internet (Fixes the ENETUNREACH error!)
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const app = express();
const PORT = process.env.PORT || 5000; 

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const ROOM_RATES = {
  'buffalo': 17500,
  'bighorn': 17500,
  'deer': 15000,   
  'combo-bd': 29500,
  'family': 39500   
};

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { room, nights } = req.body;
    const ratePerNight = ROOM_RATES[room];
    const totalAmount = ratePerNight * nights;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).send({ error: error.message });
  }
});

app.get('/api/setup-db', async (req, res) => {
  try {
    await pool.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS guest_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS guest_email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS guest_phone VARCHAR(50),
      ADD COLUMN IF NOT EXISTS guest_count VARCHAR(50),
      ADD COLUMN IF NOT EXISTS guest_ages VARCHAR(255);
    `);
    res.send("Database upgraded successfully! You can close this tab.");
  } catch (err) {
    res.send("Error upgrading database: " + err.message);
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { room, checkIn, checkOut, guest } = req.body;

    const guestName = guest?.name || 'Not Provided';
    const guestEmail = guest?.email || 'Not Provided';
    const guestPhone = guest?.phone || 'Not Provided';
    const guestCount = guest?.guestCount || 'Not Provided'; 
    const guestAges = guest?.guestAges || 'Not Provided';  

    let roomsToBook = [];
    let prettyRoomName = '';
    
    if (room === 'family') {
      roomsToBook = ['buffalo', 'bighorn', 'deer'];
      prettyRoomName = 'Ultimate Family Package';
    } else if (room === 'combo-bd') {
      roomsToBook = ['bighorn', 'deer'];
      prettyRoomName = 'Family Combo: BigHorn & Deer Run';
    } else {
      roomsToBook = [room]; 
      prettyRoomName = room === 'buffalo' ? 'Buffalo Ridge' : room === 'bighorn' ? 'BigHorn Lookout' : 'Deer Run';
    }

    for (const r of roomsToBook) {
      const overlapCheck = await pool.query(
        `SELECT * FROM reservations WHERE room_name = $1 AND check_in < $3::DATE AND check_out > $2::DATE`,
        [r, checkIn, checkOut]
      );
      if (overlapCheck.rows.length > 0) {
        return res.status(400).json({ message: `Sorry! A room in this package is already booked for those dates.` });
      }
    }

    for (const r of roomsToBook) {
      await pool.query(
        `INSERT INTO reservations (guest_name, guest_email, guest_phone, guest_count, guest_ages, room_name, check_in, check_out) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [guestName, guestEmail, guestPhone, guestCount, guestAges, r, checkIn, checkOut]
      );
    }

    // 👉 Send the automated emails!
    if (guestEmail !== 'Not Provided') {
      // 1. Send receipt to the Guest
      await transporter.sendMail({
        from: `"Cleghorn Canyon B&B" <${process.env.EMAIL_USER}>`,
        to: guestEmail,
        subject: 'Reservation Confirmed - Cleghorn Canyon B&B',
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2d4a22;">Thank you for booking with us, ${guestName}!</h2>
            <p>Your reservation is officially confirmed. We are so excited to host you at Cleghorn Canyon!</p>
            <div style="background-color: #f4f7f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2d4a22;">Booking Details:</h3>
              <p><strong>Room:</strong> ${prettyRoomName}</p>
              <p><strong>Check-in:</strong> ${checkIn}</p>
              <p><strong>Check-out:</strong> ${checkOut}</p>
              <p><strong>Guests:</strong> ${guestAges}</p>
            </div>
            <p>If you have any questions or special requests before your stay, please reply to this email.</p>
            <br/>
            <p>Warmly,</p>
            <p><strong>Cleghorn Canyon Bed and Breakfast</strong></p>
          </div>
        `
      });
    }

    // 2. Send notification to You
    await transporter.sendMail({
      from: `"Website Bookings" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, 
      subject: `🎉 New Booking! ${prettyRoomName} (${checkIn})`,
      html: `
        <h2>New Reservation Alert!</h2>
        <p>A new booking has been paid for and confirmed on the website.</p>
        <ul>
          <li><strong>Guest Name:</strong> ${guestName}</li>
          <li><strong>Email:</strong> ${guestEmail}</li>
          <li><strong>Phone:</strong> ${guestPhone}</li>
          <li><strong>Room:</strong> ${prettyRoomName}</li>
          <li><strong>Dates:</strong> ${checkIn} to ${checkOut}</li>
          <li><strong>Party:</strong> ${guestAges}</li>
        </ul>
        <p>This reservation has automatically been added to your Admin Dashboard calendar.</p>
      `
    });

    res.json({ message: "Booking saved and emails sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save booking" });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const allBookings = await pool.query("SELECT * FROM reservations ORDER BY check_in ASC");
    res.json(allBookings.rows); 
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    await pool.query("DELETE FROM reservations WHERE id = $1", [id]);
    res.json({ message: "Reservation canceled successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel booking" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});