import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { internshipService } from '../services';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';
import { STATUSES, formatDate } from '../utils/constants';
import { MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function Kanban() {
  const [columns, setColumns] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    internshipService.getAll({ limit: 200 }).then(({ data }) => {
      const grouped = STATUSES.reduce((acc, s) => ({ ...acc, [s]: [] }), {});
      data.internships.forEach((i) => { if (grouped[i.status]) grouped[i.status].push(i); });
      setColumns(grouped);
      setLoading(false);
    });
  }, []);

  const COLUMN_COLORS = {
    'Applied': 'border-blue-400',
    'Under Review': 'border-yellow-400',
    'Interview Scheduled': 'border-purple-400',
    'Rejected': 'border-red-400',
    'Accepted': 'border-green-400',
    'Offer Received': 'border-emerald-400',
  };

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <Link to="/add" className="btn-primary">+ Add New</Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUSES.map((status) => (
          <div key={status} className="flex-shrink-0 w-72">
            <div className={`bg-white dark:bg-gray-800 rounded-xl border-t-4 ${COLUMN_COLORS[status]} shadow-sm`}>
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="font-semibold text-sm">{status}</span>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium px-2 py-0.5 rounded-full">
                  {columns[status]?.length || 0}
                </span>
              </div>
              <div className="p-3 space-y-3 min-h-[200px]">
                {columns[status]?.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-8">No applications</p>
                ) : (
                  columns[status].map((item) => (
                    <Link key={item._id} to={`/internships/${item._id}`}
                      className="block bg-gray-50 dark:bg-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600">
                      <p className="font-semibold text-sm">{item.companyName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.role}</p>
                      <div className="mt-2 space-y-1">
                        {item.location && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <MapPinIcon className="w-3 h-3" /> {item.location}
                          </div>
                        )}
                        {item.deadline && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <CalendarIcon className="w-3 h-3" /> {formatDate(item.deadline)}
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
                          {item.internshipType}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
