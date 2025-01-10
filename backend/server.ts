import express, { Response } from 'express';
import cors from 'cors';
import petsRouter from './modules/pets/routes.js';
import analyticsRouter from './modules/analytics/routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.get('/api/health', (_, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use('/api/pets', petsRouter);
app.use('/api/analytics', analyticsRouter);


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

