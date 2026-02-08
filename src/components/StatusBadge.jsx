import { STATUSES, STATUS_LABELS } from '../data/seedData';

const STATUS_DARK_COLORS = {
  [STATUSES.OFFLINE]: 'bg-white/5 text-white/40',
  [STATUSES.WORKING]: 'bg-green-500/15 text-green-400',
  [STATUSES.BUSY]: 'bg-red-500/15 text-red-400',
  [STATUSES.LUNCH]: 'bg-yellow-500/15 text-yellow-400',
  [STATUSES.AWAY]: 'bg-blue-500/15 text-blue-400',
};

export default function StatusBadge({ status, className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_DARK_COLORS[status] || 'bg-white/5 text-white/40'} ${className}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}
