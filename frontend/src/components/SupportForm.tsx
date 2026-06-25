import { FormEvent, useState } from 'react';
import { createTicket } from '../api';
import type { CreateSupportFeedbackInput, FeedbackCategory, FeedbackSeverity } from '../types';

type Props = {
  token: string;
};

const initialForm: CreateSupportFeedbackInput = {
  category: 'bug-report',
  severity: 'medium',
  subject: '',
  details: '',
  pagePath: '/app/dashboard',
  sessionId: null,
  context: {
    browser: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    recentClientErrors: [],
  },
};

export default function SupportForm({ token }: Props) {
  const [form, setForm] = useState<CreateSupportFeedbackInput>(initialForm);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');

    try {
      const ticket = await createTicket(token, form);
      setStatusMessage(`Ticket ${ticket.ticketNumber} submitted`);
      setForm(initialForm);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Failed to submit ticket');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <h2>Submit Feedback</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Category
          <select
            value={form.category}
            onChange={event => setForm({ ...form, category: event.target.value as FeedbackCategory })}
          >
            <option value="support-request">Support request</option>
            <option value="bug-report">Bug report</option>
            <option value="product-feedback">Product feedback</option>
          </select>
        </label>

        <label>
          Severity
          <select
            value={form.severity}
            onChange={event => setForm({ ...form, severity: event.target.value as FeedbackSeverity })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="mission-blocking">Mission blocking</option>
          </select>
        </label>

        <label className="span-2">
          Subject
          <input value={form.subject} onChange={event => setForm({ ...form, subject: event.target.value })} />
        </label>

        <label className="span-2">
          Details
          <textarea value={form.details} onChange={event => setForm({ ...form, details: event.target.value })} />
        </label>

        <label>
          Page path
          <input value={form.pagePath} onChange={event => setForm({ ...form, pagePath: event.target.value })} />
        </label>

        <label>
          Session ID
          <input
            value={form.sessionId || ''}
            onChange={event => setForm({ ...form, sessionId: event.target.value || null })}
            placeholder="optional UUID"
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit ticket'}
        </button>
      </form>

      {statusMessage ? <p className="status-message">{statusMessage}</p> : null}
    </section>
  );
}

