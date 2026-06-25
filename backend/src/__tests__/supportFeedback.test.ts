import { randomUUID } from 'node:crypto';
import { rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { JsonTicketStore } from '../store.js';

const adminToken = 'candidate-admin-token';
const instructorToken = 'candidate-instructor-token';

const validPayload = {
  category: 'bug-report',
  severity: 'high',
  subject: 'Dashboard layout does not save',
  details: 'The layout reverts after refreshing the browser.',
  pagePath: '/app/dashboard',
  sessionId: '00000000-0000-4000-8000-000000000001',
  context: {
    browser: 'Chrome',
    viewport: '1440x900',
    recentClientErrors: [
      {
        message: 'Failed to save layout',
        source: 'client',
        at: 1710000000000,
      },
    ],
  },
};

describe('support feedback API', () => {
  let dataFile: string;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    dataFile = path.join(os.tmpdir(), `support-feedback-${randomUUID()}.json`);
    app = createApp({ store: new JsonTicketStore(dataFile) });
  });

  afterEach(async () => {
    await rm(dataFile, { force: true });
  });

  it('creates a ticket for an authenticated non-admin user', async () => {
    const response = await request(app)
      .post('/api/support-feedback')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send(validPayload)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      category: 'bug-report',
      severity: 'high',
      status: 'open',
      subject: 'Dashboard layout does not save',
      createdBy: {
        id: 'u-instructor',
        role: 'instructor',
      },
    });
    expect(response.body.data.id).toEqual(expect.any(String));
    expect(response.body.data.ticketNumber).toEqual(expect.any(Number));
    expect(response.body.data.createdAt).toEqual(expect.any(String));
  });

  it('rejects invalid ticket payloads with a validation error', async () => {
    const response = await request(app)
      .post('/api/support-feedback')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        ...validPayload,
        subject: '',
        severity: 'critical',
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.errors.length).toBeGreaterThan(0);
  });

  it('prevents non-admin users from listing tickets', async () => {
    await request(app)
      .get('/api/support-feedback')
      .set('Authorization', `Bearer ${instructorToken}`)
      .expect(403);
  });

  it('allows admins to list and filter tickets', async () => {
    await request(app)
      .post('/api/support-feedback')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send(validPayload)
      .expect(201);

    const response = await request(app)
      .get('/api/support-feedback?status=open&q=layout')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].subject).toContain('layout');
  });

  it('allows admins to update ticket status', async () => {
    const createResponse = await request(app)
      .post('/api/support-feedback')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send(validPayload)
      .expect(201);

    const ticketId = createResponse.body.data.id;

    const updateResponse = await request(app)
      .patch(`/api/support-feedback/${ticketId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'resolved' })
      .expect(200);

    expect(updateResponse.body.success).toBe(true);
    expect(updateResponse.body.data.status).toBe('resolved');
    expect(updateResponse.body.data.updatedAt).not.toBe(createResponse.body.data.updatedAt);

  });

  it('rejects requests without authentication', async () => {
    await request(app)
      .post('/api/support-feedback')
      .send(validPayload)
      .expect(401);
  });

  it('returns 404 when updating a ticket that does not exist', async () => {
    const response = await request(app)
      .patch('/api/support-feedback/not-a-real-ticket/status')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'resolved' })
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Ticket not found');
  });
});

