const express = require('express');

const projectRoutes = (pool) => {
  const router = express.Router();

  // Endpoint to get all projects
    // Endpoint to get all projects or search for projects
  router.get('/', async (req, res) => {
    try {
      let query = 'SELECT * FROM ReviewProjects';

      // Si se proporciona un parámetro de búsqueda en la URL, filtrar por él
      if (req.query.search) {
        const searchTerm = req.query.search;
        query += ` WHERE project_title ILIKE '%${searchTerm}%';`;
      }

      const result = await pool.query(query);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  // Endpoint to create a new project
  router.post('/', async (req, res) => {
    const { project_title, article_id, team_name } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO ReviewProjects (project_title, article_id, team_name, status) VALUES ($1, $2, $3, $4) RETURNING *',
        [project_title, article_id, team_name, 'new']
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  // Endpoint to update a project
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { project_title, article_id, team_name } = req.body;
    try {
      const result = await pool.query(
        'UPDATE ReviewProjects SET project_title = $1, article_id = $2, team_name = $3 WHERE review_project_id = $4 RETURNING *',
        [project_title, article_id, team_name, id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  // Endpoint to delete a project
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM ReviewProjects WHERE review_project_id = $1', [id]);
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  // Endpoint to update project status
  router.put('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const result = await pool.query(
        'UPDATE ReviewProjects SET status = $1 WHERE review_project_id = $2 RETURNING *',
        [status, id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  return router;
};

module.exports = projectRoutes;
