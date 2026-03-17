import express from 'express';
import { query } from '../db/index.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all scrapbooks for current user
router.get('/', authenticate, async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM scrapbooks WHERE user_id = $1 ORDER BY updated_at DESC',
      [req.user.id]
    );
    res.json({ success: true, scrapbooks: result.rows });
  } catch (err) { next(err); }
});

// Get public scrapbooks (explore)
router.get('/explore', async (req, res, next) => {
  try {
    const { type, sort } = req.query;
    let sql = `SELECT s.*, u.name as author_name FROM scrapbooks s 
               JOIN users u ON s.user_id = u.id WHERE s.is_public = TRUE`;
    const params = [];
    
    if (type && type !== 'All') {
      params.push(type);
      sql += ` AND s.type = $${params.length}`;
    }
    
    sql += sort === 'popular' ? ' ORDER BY s.likes_count DESC' : ' ORDER BY s.created_at DESC';
    sql += ' LIMIT 50';
    
    const result = await query(sql, params);
    res.json({ success: true, scrapbooks: result.rows });
  } catch (err) { next(err); }
});

// Get single scrapbook
router.get('/:id', async (req, res, next) => {
  try {
    const result = await query(
      `SELECT s.*, u.name as author_name, 
       (SELECT json_agg(p ORDER BY p.page_number) FROM pages p WHERE p.scrapbook_id = s.id) as pages 
       FROM scrapbooks s JOIN users u ON s.user_id = u.id WHERE s.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, scrapbook: result.rows[0] });
  } catch (err) { next(err); }
});

// Create scrapbook
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { title, type, theme } = req.body;
    const result = await query(
      'INSERT INTO scrapbooks (user_id, title, type, theme) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, title, type, theme || 'minimal']
    );
    res.status(201).json({ success: true, scrapbook: result.rows[0] });
  } catch (err) { next(err); }
});

// Update scrapbook
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { title, type, theme, font, is_public } = req.body;
    const result = await query(
      `UPDATE scrapbooks SET title = COALESCE($1, title), type = COALESCE($2, type), 
       theme = COALESCE($3, theme), font = COALESCE($4, font), is_public = COALESCE($5, is_public),
       updated_at = CURRENT_TIMESTAMP WHERE id = $6 AND user_id = $7 RETURNING *`,
      [title, type, theme, font, is_public, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false });
    res.json({ success: true, scrapbook: result.rows[0] });
  } catch (err) { next(err); }
});

// Delete scrapbook
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await query('DELETE FROM scrapbooks WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// AI Generate (simulated)
router.post('/:id/generate', authenticate, async (req, res, next) => {
  try {
    const { photoIds } = req.body;
    const layouts = ['full', 'grid', 'split', 'collage'];
    const captions = [
      'A moment frozen in time',
      'Where memories begin',
      'Every picture tells a story',
      'Adventures await',
    ];

    const generatedPages = (photoIds || []).map((_, i) => ({
      page_number: i + 1,
      layout: layouts[i % layouts.length],
      caption: captions[i % captions.length],
    }));

    // Insert pages
    for (const page of generatedPages) {
      await query(
        'INSERT INTO pages (scrapbook_id, page_number, layout, caption) VALUES ($1, $2, $3, $4)',
        [req.params.id, page.page_number, page.layout, page.caption]
      );
    }

    await query('UPDATE scrapbooks SET page_count = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [generatedPages.length, req.params.id]);

    res.json({ success: true, pages: generatedPages, message: 'AI generation complete' });
  } catch (err) { next(err); }
});

export default router;
