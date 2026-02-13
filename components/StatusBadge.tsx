

import React from 'react';
import { CommissionStatus } from '../types';

interface Props {
  status: CommissionStatus;
}

const statusConfig: Record<string, { bg: string; text: string }> = {
  [CommissionStatus.APPLYING]: { bg: 'bg-gray-100', text: 'text-gray-600' },
  [CommissionStatus.DISCUSSION]: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  [CommissionStatus.DEPOSIT_PAID]: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  [CommissionStatus.QUEUED]: { bg: 'bg-indigo-200', text: 'text-indigo-800' },
  [CommissionStatus.ESTABLISHED]: { bg: 'bg-stone-100', text: 'text-stone-600' },
  [CommissionStatus.DRAFTING]: { bg: 'bg-blue-50', text: 'text-blue-600' },
  [CommissionStatus.DRAFT_CHECK]: { bg: 'bg-blue-100', text: 'text-blue-700' },
  [CommissionStatus.DRAFT_CONFIRMED]: { bg: 'bg-blue-200', text: 'text-blue-800' },
  [CommissionStatus.IN_PRODUCTION]: { bg: 'bg-purple-100', text: 'text-purple-600' },
  [CommissionStatus.PRODUCT_CHECK]: { bg: 'bg-purple-200', text: 'text-purple-800' },
  [CommissionStatus.SHIPPED_BY_ARTIST]: { bg: 'bg-pink-100', text: 'text-pink-600' },
  [CommissionStatus.WAREHOUSE_RECEIVED]: { bg: 'bg-pink-200', text: 'text-pink-700' },
  [CommissionStatus.SHIPPING_INTL]: { bg: 'bg-orange-100', text: 'text-orange-600' },
  [CommissionStatus.PACKING]: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  [CommissionStatus.SHIPPED_LOCALLY]: { bg: 'bg-green-100', text: 'text-green-600' },
  [CommissionStatus.COMPLETED]: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
};

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${config.bg} ${config.text}`}>
      {status}
    </span>
  );
};