import React from 'react';
import { STATUSES, TYPES } from '../utils/constants';

export default function InternshipForm({ form, onChange, onSubmit, loading, submitLabel = 'Save' }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Company Name *</label>
          <input className="input-field" required value={form.companyName} onChange={(e) => onChange('companyName', e.target.value)} placeholder="Google" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role *</label>
          <input className="input-field" required value={form.role} onChange={(e) => onChange('role', e.target.value)} placeholder="Software Engineer Intern" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input className="input-field" value={form.location} onChange={(e) => onChange('location', e.target.value)} placeholder="San Francisco, CA" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select className="input-field" value={form.internshipType} onChange={(e) => onChange('internshipType', e.target.value)}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Application Date</label>
          <input type="date" className="input-field" value={form.applicationDate} onChange={(e) => onChange('applicationDate', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Deadline</label>
          <input type="date" className="input-field" value={form.deadline} onChange={(e) => onChange('deadline', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select className="input-field" value={form.status} onChange={(e) => onChange('status', e.target.value)}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stipend</label>
          <input className="input-field" value={form.stipend} onChange={(e) => onChange('stipend', e.target.value)} placeholder="$2000/month" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Interview Date</label>
          <input type="datetime-local" className="input-field" value={form.interviewDate} onChange={(e) => onChange('interviewDate', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Offer Deadline</label>
          <input type="date" className="input-field" value={form.offerDeadline || ''} onChange={(e) => onChange('offerDeadline', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Resume (PDF/DOC)</label>
          <input type="file" accept=".pdf,.doc,.docx" className="input-field" onChange={(e) => onChange('resume', e.target.files[0])} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea className="input-field" rows={3} value={form.notes} onChange={(e) => onChange('notes', e.target.value)} placeholder="Any additional notes..." />
      </div>
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
