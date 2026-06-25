import type {
  ApiResponse,
  CreateSupportFeedbackInput,
  FeedbackStatus,
  SupportFeedbackTicket,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function requestJson<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...init.headers,
    },
  });

  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !body.success) {
    throw new Error(body.errors?.join('; ') || body.error || 'Request failed');
  }

  if (body.data === undefined) {
    throw new Error('Response did not include data');
  }

  return body.data;
}

export async function createTicket(_token: string, _payload: CreateSupportFeedbackInput): Promise<SupportFeedbackTicket> {
  throw new Error('TODO: call POST /api/support-feedback');
}

export async function listTickets(_token: string, _query = ''): Promise<SupportFeedbackTicket[]> {
  throw new Error('TODO: call GET /api/support-feedback');
}

export async function updateTicketStatus(
  _token: string,
  _ticketId: string,
  _status: FeedbackStatus
): Promise<SupportFeedbackTicket> {
  throw new Error('TODO: call PATCH /api/support-feedback/:id/status');
}

export { requestJson };

