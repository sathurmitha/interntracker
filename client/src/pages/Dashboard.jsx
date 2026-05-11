import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService, internshipService } from '../services';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';
import { formatDate } from '../utils/constants';
import {
  BriefcaseIcon, CheckCircleIcon, XCircleIcon, ClockIcon, CalendarIcon, GiftIcon,
} from '@heroicons/react/24/outline';

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    if (!targetDate) return;
    const tick = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) { setTimeLeft('Now!'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(d > 0 ? `${d}d ${h}h` : `${h}h ${m}m`);
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

function CountdownCard({ interview }) {
  const countdown = useCountdown(interview?.interviewDate);
  if (!interview) return null;
  return (
    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider">Next Interview</p>
        <p className="font-bold mt-0.5">{interview.companyName}</p>
        <p className="text-sm text-gray-500">{interview.role}</p>
        <p className="text-xs text-gray-400 mt-1">{formatDate(interview.interviewDate)}</p>
      </div>
      <div className="text-right">
        <p className="text-3xl font-extrabold text-purple-600">{countdown}</p>
        <p className="text-xs text-gray-400">remaining</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [nextInterview, setNextInterview] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, internRes, offerRes] = await Promise.all([
          analyticsService.getStats(),
          internshipService.getAll({ limit: 5, sort: '-createdAt' }),
          internshipService.getAll({ status: 'Offer Received', limit: 10 }),
        ]);
        setStats(statsRes.data);
        setRecent(internRes.data.internships);
        setOffers(offerRes.data.internships);

        // Find next upcoming interview
        const interviewRes = await internshipService.getAll({
          status: 'Interview Scheduled', sort: 'interviewDate', limit: 1,
        });
        const upcoming = interviewRes.data.internships.find(
          (i) => i.interviewDate && new Date(i.interviewDate) > new Date()
        );
        setNextInterview(upcoming || null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Spinner size="lg" />;

  const getCount = (status) => stats?.statusCounts?.find((s) => s._id === status)?.count || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link to="/add" className="btn-primary">+ Add Internship</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Applications" value={stats?.total || 0} icon={BriefcaseIcon} color="blue" />
        <StatCard title="Accepted" value={stats?.accepted || 0} icon={CheckCircleIcon} color="green" subtitle={`${stats?.acceptanceRate || 0}% rate`} />
        <StatCard title="Rejected" value={getCount('Rejected')} icon={XCircleIcon} color="red" />
        <StatCard title="Upcoming Interviews" value={stats?.upcomingInterviews || 0} icon={CalendarIcon} color="purple" />
      </div>

      {/* Interview Countdown */}
      {nextInterview && <CountdownCard interview={nextInterview} />}

      {/* Offer Deadline Warnings */}
      {offers.length > 0 && (
        <div className="card border-l-4 border-emerald-500">
          <div className="flex items-center gap-2 mb-3">
            <GiftIcon className="w-5 h-5 text-emerald-600" />
            <h2 className="font-semibold text-lg">🎉 Offers Received</h2>
          </div>
          <div className="space-y-2">
            {offers.map((o) => (
              <Link key={o._id} to={`/internships/${o._id}`}
                className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                <div>
                  <p className="font-medium">{o.companyName} — {o.role}</p>
                  {o.stipend && <p className="text-sm text-emerald-700 dark:text-emerald-400">{o.stipend}</p>}
                </div>
                <StatusBadge status={o.status} />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Recent Applications</h2>
            <Link to="/internships" className="text-blue-600 text-sm hover:underline">View all</Link>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <BriefcaseIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No applications yet</p>
              <Link to="/add" className="text-blue-600 text-sm hover:underline mt-1 block">Add your first one</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((item) => (
                <Link key={item._id} to={`/internships/${item._id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div>
                    <p className="font-medium">{item.companyName}</p>
                    <p className="text-sm text-gray-500">{item.role}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Deadlines Soon */}
        <div className="card">
          <h2 className="font-semibold text-lg mb-4">Upcoming Deadlines</h2>
          {!stats?.deadlineSoon?.length ? (
            <div className="text-center py-8 text-gray-400">
              <ClockIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No upcoming deadlines</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.deadlineSoon.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                  <div>
                    <p className="font-medium">{item.companyName}</p>
                    <p className="text-sm text-gray-500">{item.role}</p>
                  </div>
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                    {formatDate(item.deadline)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
