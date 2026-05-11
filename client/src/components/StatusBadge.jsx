import React from 'react';
import { STATUS_COLORS } from '../utils/constants';

export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}
