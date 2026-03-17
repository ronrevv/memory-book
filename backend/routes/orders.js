import express from 'express';
import { query } from '../db/index.js';
import { authenticate } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Create order
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { scrapbook_id, page_count, cover_type, gift_wrap, express_delivery, shipping } = req.body;
    
    const basePrice = 29.99;
    const extraPages = page_count > 20 ? (page_count - 20) * 0.5 : 0;
    const coverCharge = cover_type === 'hard' ? 10 : 0;
    const giftCharge = gift_wrap ? 5.99 : 0;
    const expressCharge = express_delivery ? 9.99 : 0;
    const total = basePrice + extraPages + coverCharge + giftCharge + expressCharge;
    
    const orderNumber = `MB-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    
    const result = await query(
      `INSERT INTO orders (user_id, scrapbook_id, order_number, page_count, cover_type, gift_wrap, 
       express_delivery, subtotal, total, shipping_name, shipping_address, shipping_city, 
       shipping_state, shipping_zip, payment_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'demo') RETURNING *`,
      [req.user.id, scrapbook_id, orderNumber, page_count, cover_type, gift_wrap, express_delivery,
       total, total, shipping?.name, shipping?.address, shipping?.city, shipping?.state, shipping?.zip]
    );
    
    res.status(201).json({ success: true, order: result.rows[0] });
  } catch (err) { next(err); }
});

// Get user's orders
router.get('/', authenticate, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT o.*, s.title as scrapbook_title, s.type as scrapbook_type
       FROM orders o LEFT JOIN scrapbooks s ON o.scrapbook_id = s.id
       WHERE o.user_id = $1 ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, orders: result.rows });
  } catch (err) { next(err); }
});

// Get single order
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT o.*, s.title as scrapbook_title FROM orders o 
       LEFT JOIN scrapbooks s ON o.scrapbook_id = s.id
       WHERE (o.id = $1 OR o.order_number = $1) AND o.user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false });
    res.json({ success: true, order: result.rows[0] });
  } catch (err) { next(err); }
});

// Payment (demo)
router.post('/:id/pay', authenticate, async (req, res) => {
  res.json({
    success: true,
    message: 'Payment processed (demo mode)',
    payment: { status: 'succeeded', mode: 'demo' },
  });
});

export default router;
