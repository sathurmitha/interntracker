import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { internshipService } from '../services';
import InternshipForm from '../components/InternshipForm';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';
import { formatDate, formatDateTime } from '../utils/constants';
import { TrashIcon, ClockIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const toDateInput = (val) => {
  if (!val) return '';
  const d = new Date(val);
  return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
};

const toDateTimeInput = (val) => {
  if (!val) return '';
  const d = new Date(val);
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 16);
};

export default function InternshipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [timelineNote, setTimelineNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const load = () =>
    internshipService.getOne(id).then(({ data }) => {
      setInternship(data);
      setForm({
        companyName: data.companyName, role: data.role, location: data.location || '',
        internshipType: data.internshipType, status: data.status, stipend: data.stipend || '',
        notes: data.notes || '', resume: null,
        applicationDate: toDateInput(data.applicationDate),
        deadline: toDateInput(data.deadline),
        interviewDate: toDateTimeInput(data.interviewDate),
        offerDeadline: toDateInput(data.offerDeadline),
      });
      setLoading(false);
    }).catch(() => { toast.error('Not found'); navigate('/internships'); });

  useEffect(() => { load(); }, [id]);

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v && k !== 'resume') fd.append(k, v); });
      if (form.resume) fd.append('resume', form.resume);
      const { data } = await internshipService.update(id, fd);
      setInternship(data);
      setEditing(false);
      toast.success('Updated!');
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this application?')) return;
    await internshipService.delete(id);
    toast.success('Deleted');
    navigate('/internships');
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!timelineNote.trim()) return;
    setAddingNote(true);
    try {
      await internshipService.addTimelineNote(id, timelineNote);
      setTimelineNote('');
      toast.success('Note added');
      load();
    } catch {
      toast.error('Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">{internship.companyName}</h1>
          <p className="text-gray-500">{internship.role}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <StatusBadge status={internship.status} />
          <button onClick={() => setEditing(!editing)} className="btn-secondary text-sm">
            {editing ? 'Cancel' : 'Edit'}
          </button>
          <button onClick={handleDelete} className="btn-danger text-sm flex items-center gap-1">
            <TrashIcon className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {editing ? (
        <div className="card">
          <InternshipForm form={form} onChange={handleChange} onSubmit={handleUpdate} loading={saving} submitLabel="Update" />
        </div>
      ) : (
        <div className="card space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              ['Location', internship.location || '—'],
              ['Type', internship.internshipType],
              ['Stipend', internship.stipend || '—'],
              ['Applied', formatDate(internship.applicationDate)],
              ['Deadline', formatDate(internship.deadline)],
              ['Interview', formatDateTime(internship.interviewDate)],
              ['Offer Deadline', formatDate(internship.offerDeadline)],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
                <p className="font-medium mt-0.5">{value}</p>
              </div>
            ))}
          </div>
          {internship.notes && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Notes</p>
              <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">{internship.notes}</p>
            </div>
          )}
          {internship.resumeURL && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Resume</p>
              <a href={internship.resumeURL} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">
                View Resume →
              </a>
            </div>
          )}
        </div>
      )}

      {/* Timeline */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <ClockIcon className="w-5 h-5 text-gray-400" />
          <h2 className="font-semibold text-lg">Activity Timeline</h2>
        </div>

        {/* Add note */}
        <form onSubmit={handleAddNote} className="flex gap-2 mb-6">
          <input
            className="input-field flex-1"
            placeholder="Add a note (e.g. Sent follow-up email...)"
            value={timelineNote}
            onChange={(e) => setTimelineNote(e.target.value)}
          />
          <button type="submit" className="btn-primary text-sm px-4" disabled={addingNote}>
            {addingNote ? '...' : 'Add'}
          </button>
        </form>

        {/* Timeline entries */}
        {!internship.timeline?.length ? (
          <p className="text-gray-400 text-sm text-center py-4">No activity yet. Status changes are logged automatically.</p>
        ) : (
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-4">
              {[...internship.timeline].reverse().map((entry, i) => (
                <div key={i} className="flex gap-4 relative">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 border-2 border-blue-400 flex-shrink-0 z-10" />
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={entry.status} />
                      <span className="text-xs text-gray-400">{formatDate(entry.date)}</span>
                    </div>
                    {entry.note && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{entry.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
