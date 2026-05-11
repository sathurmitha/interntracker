import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { internshipService } from '../services';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';
import { formatDate, STATUSES } from '../utils/constants';
import { MagnifyingGlassIcon, TrashIcon, PencilIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function InternshipList() {
  const [data, setData] = useState({ internships: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', sort: '-createdAt', page: 1 });
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await internshipService.getAll(filters);
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await internshipService.delete(id);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await internshipService.update(id, { status });
      toast.success('Status updated');
      setData((prev) => ({
        ...prev,
        internships: prev.internships.map((i) => i._id === id ? { ...i, status } : i),
      }));
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await internshipService.exportCSV();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'internships.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('CSV downloaded!');
    } catch {
      toast.error('Export failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Internships</h1>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="btn-secondary flex items-center gap-2 text-sm">
            <ArrowDownTrayIcon className="w-4 h-4" /> Export CSV
          </button>
          <Link to="/add" className="btn-primary">+ Add New</Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="input-field pl-9"
              placeholder="Search company or role..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            />
          </div>
          <select className="input-field sm:w-48" value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select className="input-field sm:w-48" value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="companyName">Company A-Z</option>
            <option value="-deadline">Deadline Soon</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? <Spinner /> : data.internships.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No internships found</p>
            <Link to="/add" className="text-blue-600 hover:underline mt-2 block">Add your first application</Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 text-left">
                  <tr>
                    {['Company', 'Role', 'Type', 'Applied', 'Deadline', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {data.internships.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-3 font-medium">{item.companyName}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.role}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.internshipType}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDate(item.applicationDate)}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDate(item.deadline)}</td>
                      <td className="px-4 py-3">
                        {/* Quick status update dropdown */}
                        <select
                          className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={item.status}
                          disabled={updatingId === item._id}
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        >
                          {STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link to={`/internships/${item._id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                            <PencilIcon className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(item._id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500">Total: {data.total}</p>
                <div className="flex gap-2">
                  <button className="btn-secondary text-sm py-1 px-3" disabled={filters.page === 1}
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>Prev</button>
                  <span className="px-3 py-1 text-sm">Page {filters.page} of {data.pages}</span>
                  <button className="btn-secondary text-sm py-1 px-3" disabled={filters.page === data.pages}
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
