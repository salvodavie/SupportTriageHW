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

export async function createTicket(
  token: string,
  payload: CreateSupportFeedbackInput
): Promise<SupportFeedbackTicket> {
  return requestJson<SupportFeedbackTicket>('/api/support-feedback', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function listTickets(
  token: string,
  query = ''
): Promise<SupportFeedbackTicket[]> {
  return requestJson<SupportFeedbackTicket[]>(
    `/api/support-feedback${query}`,
    token
  );
}

export async function updateTicketStatus(
  token: string,
  ticketId: string,
  status: FeedbackStatus
): Promise<SupportFeedbackTicket> {
  return requestJson<SupportFeedbackTicket>(
    `/api/support-feedback/${ticketId}/status`,
    token,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }
  );
}

export { requestJson };

