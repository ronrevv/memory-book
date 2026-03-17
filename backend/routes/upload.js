import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate } from '../middleware/auth.js';
import { query } from '../db/index.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|heic|heif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext || mime);
  }
});

const router = express.Router();

// Upload single photo
router.post('/photo', authenticate, upload.single('photo'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const result = await query(
      `INSERT INTO photos (user_id, scrapbook_id, original_url, file_size, source)
       VALUES ($1, $2, $3, $4, 'upload') RETURNING *`,
      [req.user.id, req.body.scrapbook_id, `/uploads/${req.file.filename}`, req.file.size]
    );

    res.status(201).json({ success: true, photo: result.rows[0] });
  } catch (err) { next(err); }
});

// Upload multiple photos
router.post('/photos', authenticate, upload.array('photos', 50), async (req, res, next) => {
  try {
    const photos = [];
    for (const file of req.files || []) {
      const result = await query(
        `INSERT INTO photos (user_id, scrapbook_id, original_url, file_size, source)
         VALUES ($1, $2, $3, $4, 'upload') RETURNING *`,
        [req.user.id, req.body.scrapbook_id, `/uploads/${file.filename}`, file.size]
      );
      photos.push(result.rows[0]);
    }
    res.status(201).json({ success: true, photos, count: photos.length });
  } catch (err) { next(err); }
});

// Import from Instagram (simulated)
router.post('/import/instagram', authenticate, async (req, res) => {
  res.json({ success: true, message: 'Instagram import — connect your account in settings', photos: [] });
});

// Import from Google Photos (simulated)
router.post('/import/google', authenticate, async (req, res) => {
  res.json({ success: true, message: 'Google Photos import — connect your account in settings', photos: [] });
});

export default router;
