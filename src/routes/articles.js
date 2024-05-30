const express = require('express');

const articleRoutes = (pool) => {
  const router = express.Router();

  // Endpoint to get all articles
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM Articles');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  return router;
};

module.exports = articleRoutes;
