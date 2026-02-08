import { STATUS_LABELS, STATUS_COLORS } from '../data/seedData';

export default function StatusBadge({ status, className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'} ${className}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}
