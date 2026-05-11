import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services';
import Spinner from '../components/Spinner';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale, BarElement, Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { STATUS_COLORS } from '../utils/constants';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const STATUS_HEX = {
  'Applied': '#3b82f6',
  'Under Review': '#f59e0b',
  'Interview Scheduled': '#8b5cf6',
  'Rejected': '#ef4444',
  'Accepted': '#22c55e',
  'Offer Received': '#10b981',
};

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getStats().then(({ data }) => { setStats(data); setLoading(false); });
  }, []);

  if (loading) return <Spinner size="lg" />;

  const pieData = {
    labels: stats.statusCounts.map((s) => s._id),
    datasets: [{
      data: stats.statusCounts.map((s) => s.count),
      backgroundColor: stats.statusCounts.map((s) => STATUS_HEX[s._id] || '#6b7280'),
      borderWidth: 2,
    }],
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const barData = {
    labels: stats.monthlyApps.map((m) => `${months[m._id.month - 1]} ${m._id.year}`),
    datasets: [{
      label: 'Applications',
      data: stats.monthlyApps.map((m) => m.count),
      backgroundColor: '#3b82f6',
      borderRadius: 6,
    }],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-blue-600' },
          { label: 'Accepted', value: stats.accepted, color: 'text-green-600' },
          { label: 'Acceptance Rate', value: `${stats.acceptanceRate}%`, color: 'text-purple-600' },
          { label: 'Upcoming Interviews', value: stats.upcomingInterviews, color: 'text-yellow-600' },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="card">
          <h2 className="font-semibold text-lg mb-4">Status Distribution</h2>
          {stats.statusCounts.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No data yet</p>
          ) : (
            <div className="max-w-xs mx-auto">
              <Pie data={pieData} options={{ plugins: { legend: { position: 'bottom' } } }} />
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="card">
          <h2 className="font-semibold text-lg mb-4">Applications per Month</h2>
          {stats.monthlyApps.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No data yet</p>
          ) : (
            <Bar data={barData} options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
            }} />
          )}
        </div>
      </div>

      {/* Deadline Soon */}
      {stats.deadlineSoon?.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-lg mb-4">⚠️ Deadlines This Week</h2>
          <div className="space-y-2">
            {stats.deadlineSoon.map((d) => (
              <div key={d._id} className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <span className="font-medium">{d.companyName} — {d.role}</span>
                <span className="text-sm text-yellow-700 dark:text-yellow-400">
                  {new Date(d.deadline).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
