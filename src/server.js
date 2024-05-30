// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { Pool } = require('pg');
// const config = require('./config');
// const articleRoutes = require('./routes/articles');
// const projectRoutes = require('./routes/projects');

// const app = express();
// const port = 3000;

// // Database connection configuration
// const pool = new Pool(config.db);

// app.use(cors());
// app.use(bodyParser.json());

// // Use routes
// app.use('/api/articles', articleRoutes(pool));
// app.use('/api/projects', projectRoutes(pool));

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const config = require('./config');
const articleRoutes = require('./routes/articles');
const projectRoutes = require('./routes/projects');

const app = express();
const port = 3000;

// Database connection configuration
const pool = new Pool(config.db);

app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use('/api/articles', articleRoutes(pool));
app.use('/api/projects', projectRoutes(pool));

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '..', 'client')));

// Serve the index.html file for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

