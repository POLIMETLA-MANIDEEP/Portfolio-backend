const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(bodyParser.json()); // Parse JSON request bodies

// POST route to send messages
app.post('/send-message', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('Please provide all required fields.');
  }

  try {
    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.PASSWORD, // Your app password
      },
    });

    // Email options
    const mailOptions = {
      from: email, // Sender's email
      to: process.env.EMAIL, // Your email to receive messages
      subject: `New Message from ${name}`,
      text: message,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).send('Message sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error.message);
    res.status(500).send('Failed to send message.');
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
