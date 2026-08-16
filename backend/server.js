require('dotenv').config(); // NEW: Unlocks the secret vault!
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
// NEW: Cloud servers pick their own ports, so we let them!
const PORT = process.env.PORT || 5000; 

app.use(cors());
app.use(express.json());

// NEW: Connects to Cloud PostgreSQL using your hidden vault
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required by cloud databases
  }
});

// 1. The receiving door (Saves new bookings)
app.post('/api/bookings', async (req, res) => {
  try {
    const { roomName, checkIn, checkOut } = req.body;
    const overlapCheck = await pool.query(
      `SELECT * FROM reservations 
       WHERE room_name = $1 AND check_in < $3::DATE AND check_out > $2::DATE`,
      [roomName, checkIn, checkOut]
    );

    if (overlapCheck.rows.length > 0) {
      return res.status(400).json({ message: "Sorry! Those dates are already booked." });
    }

    await pool.query(
      "INSERT INTO reservations (room_name, check_in, check_out) VALUES ($1, $2, $3)",
      [roomName, checkIn, checkOut]
    );
    res.json({ message: "Booking saved successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save booking" });
  }
});

// 2. The sending door (Reads saved bookings)
app.get('/api/bookings', async (req, res) => {
  try {
    const allBookings = await pool.query("SELECT * FROM reservations ORDER BY check_in ASC");
    res.json(allBookings.rows); 
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// 3. The exit door (Deletes a booking)
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    await pool.query("DELETE FROM reservations WHERE id = $1", [id]);
    res.json({ message: "Reservation canceled successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel booking" });
  }
});

app.get('/api/test', (req, res) => {
  res.json({ message: "Hello from your custom B&B backend!" });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});