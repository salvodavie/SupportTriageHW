import type { FeedbackStatus, SupportFeedbackTicket } from '../types';

type Props = {
  ticket: SupportFeedbackTicket | null;
  onStatusChange: (ticketId: string, status: FeedbackStatus) => Promise<void>;
};

export default function TicketDetail({ ticket, onStatusChange }: Props) {
  if (!ticket) {
    return (
      <aside className="ticket-detail">
        <p>Select a ticket to inspect details.</p>
      </aside>
    );
  }

  return (
    <aside className="ticket-detail">
      <div className="panel-header">
        <h3>Ticket {ticket.ticketNumber}</h3>
        <select
          value={ticket.status}
          onChange={event => {
            void onStatusChange(ticket.id, event.target.value as FeedbackStatus);
          }}
        >
          <option value="open">Open</option>
          <option value="in-progress">In progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <dl>
        <dt>Subject</dt>
        <dd>{ticket.subject}</dd>
        <dt>Details</dt>
        <dd>{ticket.details}</dd>
        <dt>Page</dt>
        <dd>{ticket.pagePath}</dd>
        <dt>Diagnostic context</dt>
        <dd>
          <pre>{JSON.stringify(ticket.context, null, 2)}</pre>
        </dd>
      </dl>
    </aside>
  );
}

