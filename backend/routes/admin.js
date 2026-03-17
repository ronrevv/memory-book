import express from 'express';
import { query } from '../db/index.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require auth + admin role
router.use(authenticate, isAdmin);

// Dashboard stats
router.get('/stats', async (req, res, next) => {
  try {
    const [users, orders, scrapbooks, revenue] = await Promise.all([
      query('SELECT COUNT(*) FROM users'),
      query('SELECT COUNT(*) FROM orders'),
      query('SELECT COUNT(*) FROM scrapbooks'),
      query('SELECT COALESCE(SUM(total), 0) as total_revenue FROM orders'),
    ]);
    res.json({
      success: true,
      stats: {
        users: parseInt(users.rows[0].count),
        orders: parseInt(orders.rows[0].count),
        scrapbooks: parseInt(scrapbooks.rows[0].count),
        revenue: parseFloat(revenue.rows[0].total_revenue),
      }
    });
  } catch (err) { next(err); }
});

// Get all orders
router.get('/orders', async (req, res, next) => {
  try {
    const result = await query(
      `SELECT o.*, u.name as customer_name, u.email as customer_email, s.title as scrapbook_title
       FROM orders o JOIN users u ON o.user_id = u.id LEFT JOIN scrapbooks s ON o.scrapbook_id = s.id
       ORDER BY o.created_at DESC LIMIT 100`
    );
    res.json({ success: true, orders: result.rows });
  } catch (err) { next(err); }
});

// Update order status
router.patch('/orders/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'printing', 'binding', 'dispatched', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const result = await query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false });
    res.json({ success: true, order: result.rows[0] });
  } catch (err) { next(err); }
});

// Get all users
router.get('/users', async (req, res, next) => {
  try {
    const result = await query(
      `SELECT u.id, u.name, u.email, u.role, u.is_influencer, u.created_at,
       (SELECT COUNT(*) FROM scrapbooks WHERE user_id = u.id) as scrapbook_count,
       (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as order_count
       FROM users u ORDER BY u.created_at DESC`
    );
    res.json({ success: true, users: result.rows });
  } catch (err) { next(err); }
});

// Manage templates
router.get('/templates', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM templates ORDER BY use_count DESC');
    res.json({ success: true, templates: result.rows });
  } catch (err) { next(err); }
});

router.post('/templates', async (req, res, next) => {
  try {
    const { name, type, layout_config, theme_config } = req.body;
    const result = await query(
      'INSERT INTO templates (name, type, layout_config, theme_config) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, type, JSON.stringify(layout_config || {}), JSON.stringify(theme_config || {})]
    );
    res.status(201).json({ success: true, template: result.rows[0] });
  } catch (err) { next(err); }
});

// Revenue analytics
router.get('/analytics/revenue', async (req, res, next) => {
  try {
    const result = await query(
      `SELECT DATE_TRUNC('month', created_at) as month, 
       SUM(total) as revenue, COUNT(*) as order_count
       FROM orders GROUP BY month ORDER BY month DESC LIMIT 12`
    );
    res.json({ success: true, analytics: result.rows });
  } catch (err) { next(err); }
});

export default router;
