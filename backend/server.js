require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 

const app = express();
const PORT = process.env.PORT || 5000; 

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
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
    
    if (room === 'family') {
      roomsToBook = ['buffalo', 'bighorn', 'deer'];
    } else if (room === 'combo-bd') {
      roomsToBook = ['bighorn', 'deer'];
    } else {
      roomsToBook = [room]; 
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

    // Save the booking to the database
    for (const r of roomsToBook) {
      await pool.query(
        `INSERT INTO reservations (guest_name, guest_email, guest_phone, guest_count, guest_ages, room_name, check_in, check_out) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [guestName, guestEmail, guestPhone, guestCount, guestAges, r, checkIn, checkOut]
      );
    }

    // Instantly return the Success message back to the website
    res.json({ message: "Booking saved successfully!" });

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