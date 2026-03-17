import express from 'express';
import { query } from '../db/index.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT u.id, u.name, u.email, u.avatar_url, u.is_influencer, u.follower_count, u.created_at,
       (SELECT COUNT(*) FROM scrapbooks WHERE user_id = u.id) as scrapbook_count,
       (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as order_count
       FROM users u WHERE u.id = $1`,
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false });
    res.json({ success: true, profile: result.rows[0] });
  } catch (err) { next(err); }
});

// Update profile
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { name, avatar_url } = req.body;
    const result = await query(
      'UPDATE users SET name = COALESCE($1, name), avatar_url = COALESCE($2, avatar_url), updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, email, avatar_url',
      [name, avatar_url, req.user.id]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) { next(err); }
});

// Follow/unfollow
router.post('/follow/:userId', authenticate, async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (userId === req.user.id) return res.status(400).json({ success: false, message: 'Cannot follow yourself' });

    const existing = await query(
      'SELECT id FROM followers WHERE follower_id = $1 AND following_id = $2',
      [req.user.id, userId]
    );

    if (existing.rows.length > 0) {
      await query('DELETE FROM followers WHERE follower_id = $1 AND following_id = $2', [req.user.id, userId]);
      await query('UPDATE users SET follower_count = follower_count - 1 WHERE id = $1', [userId]);
      res.json({ success: true, action: 'unfollowed' });
    } else {
      await query('INSERT INTO followers (follower_id, following_id) VALUES ($1, $2)', [req.user.id, userId]);
      await query('UPDATE users SET follower_count = follower_count + 1 WHERE id = $1', [userId]);
      res.json({ success: true, action: 'followed' });
    }
  } catch (err) { next(err); }
});

export default router;
