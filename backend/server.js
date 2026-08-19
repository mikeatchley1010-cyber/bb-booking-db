require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000; 

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  }
});

// 1. The receiving door (Saves new bookings & explodes packages!)
app.post('/api/bookings', async (req, res) => {
  try {
    const { roomName, checkIn, checkOut } = req.body;

    // STEP 1: Translate the dropdown choice into physical rooms
    let roomsToBook = [];
    if (roomName === 'The Couples Package (Buffalo Ridge + Bighorn Lookout)') {
      roomsToBook = ['Buffalo Ridge', 'Bighorn Lookout'];
    } else if (roomName === 'The Full House Package (All 3 Rooms)') {
      roomsToBook = ['Buffalo Ridge', 'Bighorn Lookout', 'Deer Run'];
    } else {
      // If it's not a package, just book the single room they selected
      roomsToBook = [roomName]; 
    }

    // STEP 2: Check the database to make sure EVERY room is available
    for (const room of roomsToBook) {
      const overlapCheck = await pool.query(
        `SELECT * FROM reservations 
         WHERE room_name = $1 AND check_in < $3::DATE AND check_out > $2::DATE`,
        [room, checkIn, checkOut]
      );

      if (overlapCheck.rows.length > 0) {
        return res.status(400).json({ 
          message: `Sorry! ${room} is already booked for those dates.` 
        });
      }
    }

    // STEP 3: If we get here, all rooms are free! Save them to the database.
    for (const room of roomsToBook) {
      await pool.query(
        "INSERT INTO reservations (room_name, check_in, check_out) VALUES ($1, $2, $3)",
        [room, checkIn, checkOut]
      );
    }

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