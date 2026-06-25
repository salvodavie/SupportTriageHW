import { Router } from 'express';
import { requireAdmin, requireAuthenticatedUser } from './auth.js';
import type { TicketStore } from './store.js';
import {
  createTicketSchema,
  listTicketQuerySchema,
  updateTicketStatusSchema,
} from './schemas.js';

type RouteDeps = {
  store: TicketStore;
};

export function createSupportFeedbackRouter({ store: store }: RouteDeps): Router {
  const router = Router();

router.post('/', requireAuthenticatedUser, async (req, res) => {
  const result = createTicketSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      errors: result.error.issues.map(issue => issue.message),
      timestamp: Date.now(),
    });
    return;
  }

  const ticket = await store.create(result.data, req.user!);

  res.status(201).json({
    success: true,
    data: ticket,
    timestamp: Date.now(),
  });
});

router.get('/', requireAuthenticatedUser, requireAdmin, async (req, res) => {
  const result = listTicketQuerySchema.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({
      success: false,
      errors: result.error.issues.map(issue => issue.message),
      timestamp: Date.now(),
    });
    return;
  }

  const tickets = await store.list(result.data);

  res.status(200).json({
    success: true,
    data: tickets,
    timestamp: Date.now(),
  });
});

router.patch('/:id/status', requireAuthenticatedUser, requireAdmin, async (req, res) => {
  const result = updateTicketStatusSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      errors: result.error.issues.map(issue => issue.message),
      timestamp: Date.now(),
    });
    return;
  }

  const ticket = await store.updateStatus(req.params.id, result.data.status);

  if (!ticket) {
    res.status(404).json({
      success: false,
      error: 'Ticket not found',
      timestamp: Date.now(),
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: ticket,
    timestamp: Date.now(),
  });
});;

  return router;
}

