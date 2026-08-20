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
app.get('/api/setup-db', async (req, res) => {
  try {
    await pool.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS guest_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS guest_email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS guest_phone VARCHAR(50);
    `);
    res.send("Database upgraded successfully! You can close this tab.");
  } catch (err) {
    res.send("Error upgrading database: " + err.message);
  }
});
// 1. The receiving door (Saves new bookings & explodes packages!)
app.post('/api/bookings', async (req, res) => {
  try {
    // We are now grabbing guest details from the frontend request!
    const { guestName, guestEmail, guestPhone, roomName, checkIn, checkOut } = req.body;

    let roomsToBook = [];
    if (roomName === 'Family Package (BigHorn Lookout & Deer Run)') {
      roomsToBook = ['BigHorn Lookout', 'Deer Run'];
    } else if (roomName === 'The Full House Package (All 3 Rooms)') {
      roomsToBook = ['Buffalo Ridge', 'BigHorn Lookout', 'Deer Run'];
    } else {
      roomsToBook = [roomName]; 
    }

    for (const room of roomsToBook) {
      const overlapCheck = await pool.query(
        `SELECT * FROM reservations 
         WHERE room_name = $1 AND check_in < $3::DATE AND check_out > $2::DATE`,
        [room, checkIn, checkOut]
      );

      if (overlapCheck.rows.length > 0) {
        return res.status(400).json({ message: `Sorry! ${room} is already booked for those dates.` });
      }
    }

    // STEP 3: Now we save the guest_name, guest_email, and guest_phone into the database
    for (const room of roomsToBook) {
      await pool.query(
        "INSERT INTO reservations (guest_name, guest_email, guest_phone, room_name, check_in, check_out) VALUES ($1, $2, $3, $4, $5, $6)",
        [guestName, guestEmail, guestPhone, room, checkIn, checkOut]
      );
    }

    res.json({ message: "Booking saved successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save booking" });
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