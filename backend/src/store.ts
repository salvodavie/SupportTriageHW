import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type {
  AuthenticatedUser,
  CreateSupportFeedbackInput,
  FeedbackStatus,
  SupportFeedbackTicket,
  TicketListFilters,
} from './types.js';

export interface TicketStore {
  create(input: CreateSupportFeedbackInput, user: AuthenticatedUser): Promise<SupportFeedbackTicket>;
  list(filters?: TicketListFilters): Promise<SupportFeedbackTicket[]>;
  findById(id: string): Promise<SupportFeedbackTicket | null>;
  updateStatus(id: string, status: FeedbackStatus): Promise<SupportFeedbackTicket | null>;
}

export class JsonTicketStore implements TicketStore {
  constructor(private readonly filePath = path.join(process.cwd(), 'data', 'support-feedback.json')) {}

  async create(input: CreateSupportFeedbackInput, user: AuthenticatedUser): Promise<SupportFeedbackTicket> {
  const tickets = await this.readAll();
  const now = new Date().toISOString();

  const ticket: SupportFeedbackTicket = {
    ...input,
    id: this.makeTicketId(),
    ticketNumber: this.nextTicketNumber(tickets),
    status: 'open',
    createdBy: user,
    context: input.context ?? {},
    createdAt: now,
    updatedAt: now,
  };

  tickets.push(ticket);
  await this.writeAll(tickets);

  return ticket;
}

async list(filters: TicketListFilters = {}): Promise<SupportFeedbackTicket[]> {
  const tickets = await this.readAll();

  return tickets.filter(ticket => {
    if (filters.status && ticket.status !== filters.status) return false;
    if (filters.category && ticket.category !== filters.category) return false;
    if (filters.severity && ticket.severity !== filters.severity) return false;

    if (filters.q) {
      const query = filters.q.toLowerCase();
      const searchableText = [
        ticket.subject,
        ticket.details,
        ticket.pagePath, 
        ticket.category,
        ticket.severity,
        ticket.status,
      ].join(' ').toLowerCase();

      if (!searchableText.includes(query)) return false;
    }

    return true;
  });
}

async findById(id: string): Promise<SupportFeedbackTicket | null> {
  const tickets = await this.readAll();
  return tickets.find(ticket => ticket.id === id) ?? null;
}

async updateStatus(id: string, status: FeedbackStatus): Promise<SupportFeedbackTicket | null> {
  const tickets = await this.readAll();
  const index = tickets.findIndex(ticket => ticket.id === id);

  if (index === -1) {
    return null;
  }

  const updatedTicket: SupportFeedbackTicket = {
    ...tickets[index],
    status,
    updatedAt: new Date().toISOString(),
  };

  tickets[index] = updatedTicket;
  await this.writeAll(tickets);

  return updatedTicket;
}

  protected async readAll(): Promise<SupportFeedbackTicket[]> {
    try {
      const contents = await readFile(this.filePath, 'utf8');
      return JSON.parse(contents) as SupportFeedbackTicket[];
    } catch (error: unknown) {
      if (typeof error === 'object' && error && 'code' in error && error.code === 'ENOENT') {
        return [];
      }

      throw error;
    }
  }

  protected async writeAll(tickets: SupportFeedbackTicket[]): Promise<void> {
    await mkdir(path.dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, `${JSON.stringify(tickets, null, 2)}\n`, 'utf8');
  }

  protected makeTicketId(): string {
    return randomUUID();
  }

  protected nextTicketNumber(tickets: SupportFeedbackTicket[]): number {
    const maxTicketNumber = tickets.reduce((max, ticket) => Math.max(max, ticket.ticketNumber), 1000);
    return maxTicketNumber + 1;
  }

}

