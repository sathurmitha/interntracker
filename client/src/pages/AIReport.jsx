import React, { useEffect, useState } from 'react';
import { reportService, internshipService } from '../services';
import Spinner from '../components/Spinner';
import {
  SparklesIcon, DocumentTextIcon, ExclamationTriangleIcon,
  LightBulbIcon, TrashIcon, PencilIcon, CheckCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const EMPTY_FORM = { title: '', content: '', weekNumber: 1, internshipId: '' };

export default function AIReport() {
  const [reports, setReports] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [selected, setSelected] = useState(null); // report being viewed/analyzed
  const [editingId, setEditingId] = useState(null);
  const [wordCount, setWordCount] = useState(0);

  const load = async () => {
    try {
      const [repRes, intRes] = await Promise.all([
        reportService.getAll(),
        internshipService.getAll({ limit: 100 }),
      ]);
      setReports(repRes.data || []);
      setInternships(intRes.data?.internships || []);
    } catch (err) {
      // load each independently so one failure doesn't block the other
      try {
        const repRes = await reportService.getAll();
        setReports(repRes.data || []);
      } catch { setReports([]); }
      try {
        const intRes = await internshipService.getAll({ limit: 100 });
        setInternships(intRes.data?.internships || []);
      } catch { setInternships([]); }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleContentChange = (val) => {
    setForm((f) => ({ ...f, content: val }));
    setWordCount(val.trim().split(/\s+/).filter(Boolean).length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const { data } = await reportService.update(editingId, form);
        setReports((r) => r.map((x) => x._id === editingId ? data : x));
        if (selected?._id === editingId) setSelected(data);
        toast.success('Report updated');
        setEditingId(null);
      } else {
        const { data } = await reportService.create(form);
        setReports((r) => [data, ...r]);
        toast.success('Report saved');
      }
      setForm(EMPTY_FORM);
      setWordCount(0);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleAnalyze = async (report) => {
    setAnalyzing(true);
    setSelected(report);
    try {
      const { data } = await reportService.analyze(report._id);
      const updated = { ...report, ...data };
      setSelected(updated);
      setReports((r) => r.map((x) => x._id === report._id ? updated : x));
      toast.success('AI analysis complete!');
    } catch {
      toast.error('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleEdit = (report) => {
    setEditingId(report._id);
    setForm({
      title: report.title,
      content: report.content,
      weekNumber: report.weekNumber,
      internshipId: report.internshipId?._id || '',
    });
    setWordCount(report.content.trim().split(/\s+/).filter(Boolean).length);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report?')) return;
    await reportService.delete(id);
    setReports((r) => r.filter((x) => x._id !== id));
    if (selected?._id === id) setSelected(null);
    toast.success('Deleted');
  };

  const wordCountColor = wordCount === 0 ? 'text-gray-400'
    : wordCount < 50 ? 'text-red-500'
    : wordCount < 150 ? 'text-yellow-500'
    : 'text-green-500';

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SparklesIcon className="w-7 h-7 text-blue-600" />
        <h1 className="text-2xl font-bold">AI Report Summary</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left: Write Report ── */}
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-gray-400" />
              {editingId ? 'Edit Report' : 'Write Report'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Report Title *</label>
                  <input className="input-field" required value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Week 3 Progress Report" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Week Number</label>
                  <input type="number" min="1" max="52" className="input-field" value={form.weekNumber}
                    onChange={(e) => setForm({ ...form, weekNumber: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Internship (optional)</label>
                  <select className="input-field" value={form.internshipId}
                    onChange={(e) => setForm({ ...form, internshipId: e.target.value })}>
                    <option value="">— Select —</option>
                    {internships.map((i) => (
                      <option key={i._id} value={i._id}>{i.companyName} — {i.role}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium">Report Content *</label>
                  <span className={`text-xs font-medium ${wordCountColor}`}>
                    {wordCount} words {wordCount < 50 ? '(too short)' : wordCount < 150 ? '(good)' : '✓ detailed'}
                  </span>
                </div>
                <textarea
                  className="input-field resize-none"
                  rows={10}
                  required
                  value={form.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder={`Describe your week in detail:\n\n• What tasks did you work on?\n• What did you learn?\n• What challenges did you face?\n• What are your plans for next week?\n• Any team meetings or mentor feedback?`}
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update Report' : 'Save Report'}
                </button>
                {editingId && (
                  <button type="button" className="btn-secondary"
                    onClick={() => { setEditingId(null); setForm(EMPTY_FORM); setWordCount(0); }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Writing Tips */}
          <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
              <LightBulbIcon className="w-4 h-4" /> Writing Tips for a Strong Report
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
              <li>Aim for at least 150 words</li>
              <li>Mention specific tasks and tools used</li>
              <li>Describe challenges and how you solved them</li>
              <li>Include learning outcomes and new skills</li>
              <li>State your goals for next week</li>
              <li>Reference any team meetings or mentor feedback</li>
            </ul>
          </div>
        </div>

        {/* ── Right: Reports List + AI Results ── */}
        <div className="space-y-4">
          {/* AI Analysis Result */}
          {selected && (
            <div className="card border-2 border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-blue-600" />
                  AI Analysis — {selected.title}
                </h2>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
              </div>

              {analyzing ? (
                <div className="text-center py-8">
                  <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">AI is analyzing your report...</p>
                </div>
              ) : selected.aiSummary ? (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">📋 Summary</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selected.aiSummary}</p>
                  </div>

                  {/* Issues */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <ExclamationTriangleIcon className="w-3.5 h-3.5 text-red-500" /> Incomplete / Missing
                    </p>
                    {selected.aiIssues?.length === 0 ? (
                      <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <p className="text-sm text-green-700 dark:text-green-400">No issues detected! Your report covers all key areas.</p>
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {selected.aiIssues.map((issue, i) => (
                          <li key={i} className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <ExclamationTriangleIcon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700 dark:text-red-400">{issue}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Feedback */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <LightBulbIcon className="w-3.5 h-3.5 text-yellow-500" /> AI Feedback & Suggestions
                    </p>
                    <ul className="space-y-2">
                      {selected.aiFeedback?.map((fb, i) => (
                        <li key={i} className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <LightBulbIcon className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-yellow-800 dark:text-yellow-300">{fb}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selected.analyzedAt && (
                    <p className="text-xs text-gray-400 text-right">
                      Analyzed {new Date(selected.analyzedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <SparklesIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Click "Analyze" to run AI analysis on this report</p>
                </div>
              )}
            </div>
          )}

          {/* Reports List */}
          <div className="card">
            <h2 className="font-semibold text-lg mb-4">Your Reports ({reports.length})</h2>
            {reports.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <DocumentTextIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p>No reports yet. Write your first one!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div key={report._id}
                    className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                      selected?._id === report._id
                        ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                    onClick={() => setSelected(report)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold truncate">{report.title}</p>
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full flex-shrink-0">
                            Week {report.weekNumber}
                          </span>
                          {report.aiSummary && (
                            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1">
                              <SparklesIcon className="w-3 h-3" /> Analyzed
                            </span>
                          )}
                        </div>
                        {report.internshipId && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {report.internshipId.companyName} — {report.internshipId.role}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {report.content.trim().split(/\s+/).filter(Boolean).length} words ·{' '}
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAnalyze(report); }}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Run AI Analysis"
                        >
                          <SparklesIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEdit(report); }}
                          className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(report._id); }}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
