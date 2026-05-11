import React, { useEffect, useState } from 'react';
import { reminderService, internshipService } from '../services';
import Spinner from '../components/Spinner';
import { TrashIcon, BellIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../utils/constants';
import toast from 'react-hot-toast';

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ internshipId: '', reminderDate: '', message: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [remRes, intRes] = await Promise.all([
      reminderService.getAll(),
      internshipService.getAll({ limit: 100 }),
    ]);
    setReminders(remRes.data);
    setInternships(intRes.data.internships);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await reminderService.create(form);
      toast.success('Reminder set!');
      setForm({ internshipId: '', reminderDate: '', message: '' });
      load();
    } catch {
      toast.error('Failed to create reminder');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await reminderService.delete(id);
    toast.success('Reminder deleted');
    setReminders((r) => r.filter((x) => x._id !== id));
  };

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Reminders</h1>

      {/* Add Reminder */}
      <div className="card">
        <h2 className="font-semibold text-lg mb-4">Set New Reminder</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Internship (optional)</label>
            <select className="input-field" value={form.internshipId}
              onChange={(e) => setForm({ ...form, internshipId: e.target.value })}>
              <option value="">— General Reminder —</option>
              {internships.map((i) => (
                <option key={i._id} value={i._id}>{i.companyName} — {i.role}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reminder Date & Time *</label>
            <input type="datetime-local" className="input-field" required value={form.reminderDate}
              onChange={(e) => setForm({ ...form, reminderDate: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message *</label>
            <input className="input-field" required value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="e.g. Submit application for Google SWE Intern" />
          </div>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Set Reminder'}
          </button>
        </form>
      </div>

      {/* Reminders List */}
      <div className="card">
        <h2 className="font-semibold text-lg mb-4">Your Reminders</h2>
        {reminders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <BellIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No reminders set</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map((r) => (
              <div key={r._id} className="flex items-start justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                  <p className="font-medium">{r.message}</p>
                  {r.internshipId && (
                    <p className="text-sm text-blue-600 mt-0.5">
                      {r.internshipId.companyName} — {r.internshipId.role}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">{formatDate(r.reminderDate)}</p>
                </div>
                <button onClick={() => handleDelete(r._id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
