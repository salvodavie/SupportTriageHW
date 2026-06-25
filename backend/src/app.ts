import cors from 'cors';
import express from 'express';
import { createSupportFeedbackRouter } from './routes.js';
import { JsonTicketStore, type TicketStore } from './store.js';

type AppDeps = {
  store?: TicketStore;
};

export function createApp(deps: AppDeps = {}) {
  const app = express();
  const store = deps.store ?? new JsonTicketStore();

  app.use(cors());
  app.use(express.json({ limit: '200kb' }));

  app.get('/health', (_req, res) => {
    res.json({
      success: true,
      data: { status: 'ok' },
      timestamp: Date.now(),
    });
  });

  app.use('/api/support-feedback', createSupportFeedbackRouter({ store }));

  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: 'Not found',
      timestamp: Date.now(),
    });
  });

  return app;
}

