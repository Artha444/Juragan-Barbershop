import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic API routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Juragan Barbershop API is running',
    timestamp: new Date().toISOString()
  });
});

// A sample endpoint to test database or simple data
app.get('/api/services', (req: Request, res: Response) => {
  res.json([
    { id: 1, name: 'Haircut Premium', price: 50000, duration: '30 min' },
    { id: 2, name: 'Hair Washing & Styling', price: 30000, duration: '20 min' },
    { id: 3, name: 'Shaving', price: 20000, duration: '15 min' },
    { id: 4, name: 'Hair Coloring', price: 100000, duration: '60 min' }
  ]);
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
