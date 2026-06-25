import { useEffect, useMemo, useState } from 'react';
import { listTickets, updateTicketStatus } from '../api';
import TicketDetail from './TicketDetail';
import type { FeedbackStatus, SupportFeedbackTicket } from '../types';

type Props = {
  token: string;
};

export default function AdminTriage({ token }: Props) {
  const [tickets, setTickets] = useState<SupportFeedbackTicket[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<FeedbackStatus | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadTickets() {
    setIsLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (status) params.set('status', status);
      const queryString = params.toString();
      setTickets(await listTickets(token, queryString ? `?${queryString}` : ''));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadTickets();
  }, [token]);

  const selectedTicket = useMemo(
    () => tickets.find(ticket => ticket.id === selectedId) || null,
    [selectedId, tickets]
  );

  async function handleStatusChange(ticketId: string, nextStatus: FeedbackStatus) {
    const updated = await updateTicketStatus(token, ticketId, nextStatus);
    setTickets(current => current.map(ticket => (ticket.id === updated.id ? updated : ticket)));
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Admin Triage</h2>
        <button onClick={loadTickets} disabled={isLoading}>
          Refresh
        </button>
      </div>

      <div className="filters">
        <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search tickets" />
        <select value={status} onChange={event => setStatus(event.target.value as FeedbackStatus | '')}>
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="in-progress">In progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <button onClick={loadTickets}>Apply</button>
      </div>

      {error ? <p className="error-message">{error}</p> : null}
      {isLoading ? <p>Loading tickets...</p> : null}
      {!isLoading && tickets.length === 0 ? <p>No tickets found.</p> : null}

      {tickets.length > 0 ? (
        <div className="triage-layout">
          <table>
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Subject</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr
                  key={ticket.id}
                  className={ticket.id === selectedId ? 'selected' : ''}
                  onClick={() => setSelectedId(ticket.id)}
                >
                  <td>{ticket.ticketNumber}</td>
                  <td>{ticket.severity}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.subject}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <TicketDetail ticket={selectedTicket} onStatusChange={handleStatusChange} />
        </div>
      ) : null}
    </section>
  );
}

