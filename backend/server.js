import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import scrapbookRoutes from './routes/scrapbooks.js';
import orderRoutes from './routes/orders.js';
import uploadRoutes from './routes/upload.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'MemoryBook API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scrapbooks', scrapbookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 MemoryBook API running on http://localhost:${PORT}`);
  console.log(`📖 Health: http://localhost:${PORT}/api/health`);
});

export default app;
