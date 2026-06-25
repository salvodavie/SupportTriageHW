import { z } from 'zod';

export const createTicketSchema = z.object({
  category: z.enum(['support-request', 'bug-report', 'product-feedback']),
  severity: z.enum(['low', 'medium', 'high', 'mission-blocking']),
  subject: z.string().min(1, 'Subject is required').max(255).transform(value => value.trim()),
  details: z.string().min(1, 'Details are required').max(10000).transform(value => value.trim()),
  pagePath: z.string().min(1, 'Page path is required').max(1000),
  sessionId: z.string().uuid().nullable().optional(),
  context: z.object({
    browser: z.string().max(255).optional(),
    viewport: z.string().max(100).optional(),
    recentClientErrors: z.array(z.object({
      message: z.string().min(1).max(500),
      source: z.enum(['client', 'network', 'server']),
      at: z.number().int().nonnegative(),
    })).max(20).optional(),
  }).passthrough().optional().default({}),
});

export const updateTicketStatusSchema = z.object({
  status: z.enum(['open', 'in-progress', 'resolved']),
});

export const listTicketQuerySchema = z.object({
  status: z.enum(['open', 'in-progress', 'resolved']).optional(),
  category: z.enum(['support-request', 'bug-report', 'product-feedback']).optional(),
  severity: z.enum(['low', 'medium', 'high', 'mission-blocking']).optional(),
  q: z.string().max(200).optional(),
});

