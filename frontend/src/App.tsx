import { useMemo, useState } from 'react';
import AdminTriage from './components/AdminTriage';
import SupportForm from './components/SupportForm';
import type { UserRole } from './types';

const tokenByRole: Record<UserRole, string> = {
  admin: 'candidate-admin-token',
  instructor: 'candidate-instructor-token',
  student: 'candidate-student-token',
  observer: 'candidate-observer-token',
};

export default function App() {
  const [role, setRole] = useState<UserRole>('instructor');
  const [view, setView] = useState<'submit' | 'admin'>('submit');

  const token = useMemo(() => tokenByRole[role], [role]);

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Take-home exercise</p>
          <h1>Support Triage</h1>
        </div>

        <div className="toolbar">
          <label>
            Role
            <select value={role} onChange={event => setRole(event.target.value as UserRole)}>
              <option value="instructor">Instructor</option>
              <option value="student">Student</option>
              <option value="observer">Observer</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <div className="segmented-control" aria-label="View">
            <button className={view === 'submit' ? 'active' : ''} onClick={() => setView('submit')}>
              Submit
            </button>
            <button className={view === 'admin' ? 'active' : ''} onClick={() => setView('admin')}>
              Admin
            </button>
          </div>
        </div>
      </header>

      {view === 'submit' ? <SupportForm token={token} /> : <AdminTriage token={token} />}
    </main>
  );
}

