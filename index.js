require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Import aggregated routes
const routes = require('./routes');

// Middleware to parse JSON bodies
app.use(express.json());

// Mount routes under /api (e.g., /api/users)
app.use('/api', routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
