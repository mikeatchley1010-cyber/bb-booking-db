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
    
    // 👉 Charge only 50% for the deposit!
    const depositAmount = Math.round(totalAmount / 2);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: depositAmount,
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
    const { room, checkIn, checkOut, nights, guest } = req.body;

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

    // 1. Save the booking
    for (const r of roomsToBook) {
      await pool.query(
        `INSERT INTO reservations (guest_name, guest_email, guest_phone, guest_count, guest_ages, room_name, check_in, check_out) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [guestName, guestEmail, guestPhone, guestCount, guestAges, r, checkIn, checkOut]
      );
    }

    // 2. Calculate the exact dollar amounts for the receipt
    const ratePerNight = ROOM_RATES[room] / 100;
    const totalCost = ratePerNight * nights;
    const amountPaid = totalCost / 2;
    const amountRemaining = totalCost / 2;

    // 3. Send the receipt via EmailJS with full Error Logging
    try {
      if (guestEmail !== 'Not Provided') {
        const emailData = {
          service_id: process.env.EMAILJS_SERVICE_ID,
          template_id: process.env.EMAILJS_TEMPLATE_ID,
          user_id: process.env.EMAILJS_PUBLIC_KEY,
          accessToken: process.env.EMAILJS_PRIVATE_KEY,
          template_params: {
            guest_email: guestEmail,
            guest_name: guestName,
            room_name: prettyRoomName,
            check_in: checkIn,
            check_out: checkOut,
            guest_ages: guestAges,
            total_cost: `$${totalCost.toFixed(2)}`,
            amount_paid: `$${amountPaid.toFixed(2)}`,
            amount_remaining: `$${amountRemaining.toFixed(2)}`
          }
        };

        console.log("Attempting to send email via EmailJS...");

        const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData)
        });

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.error("EmailJS Rejected the email. Reason:", errorText);
        } else {
          console.log("EmailJS successfully sent the receipt!");
        }
      }
    } catch (emailError) {
      console.error("Email API failed completely:", emailError.message);
    }

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