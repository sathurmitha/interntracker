export const STATUS_COLORS = {
  'Applied': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Under Review': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'Interview Scheduled': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'Accepted': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Offer Received': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
};

export const STATUSES = ['Applied', 'Under Review', 'Interview Scheduled', 'Rejected', 'Accepted', 'Offer Received'];
export const TYPES = ['Remote', 'On-site', 'Hybrid'];

export const formatDate = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const isDeadlineSoon = (deadline) => {
  if (!deadline) return false;
  const diff = new Date(deadline) - new Date();
  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
};
