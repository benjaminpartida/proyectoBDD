const express = require('express');

const articleRoutes = (pool) => {
  const router = express.Router();

  // Endpoint para obtener todos los artículos o para buscar artículos
  router.get('/', async (req, res) => {
    try {
      let query = 'SELECT * FROM Articles';

      // Si se proporciona un parámetro de búsqueda en la URL, filtrar por él
      if (req.query.search) {
        const searchTerm = req.query.search;
        query += ` WHERE title ILIKE '%${searchTerm}%';`;
      }

      const result = await pool.query(query);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error en el servidor');
    }
  });

  return router;
};

module.exports = articleRoutes;
