import React from 'react';
import { CommissionStatus } from '../types';

interface Props {
  status: CommissionStatus;
}

const statusConfig: Record<CommissionStatus, { bg: string; text: string }> = {
  [CommissionStatus.APPLYING]: { bg: 'bg-gray-100', text: 'text-gray-600' },
  [CommissionStatus.DISCUSSION]: { bg: 'bg-blue-100', text: 'text-blue-600' },
  [CommissionStatus.DEPOSIT_PAID]: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  [CommissionStatus.QUEUED]: { bg: 'bg-purple-100', text: 'text-purple-600' },
  [CommissionStatus.IN_PRODUCTION]: { bg: 'bg-pink-100', text: 'text-pink-600' },
  [CommissionStatus.COMPLETED]: { bg: 'bg-green-100', text: 'text-green-600' },
  [CommissionStatus.SHIPPED]: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
};

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
      {status}
    </span>
  );
};