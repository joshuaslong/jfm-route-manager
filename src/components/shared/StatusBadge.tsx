import {
  loadingStatusColors,
  planningStatusColors,
  formatLoadingStatus,
  formatPlanningStatus,
} from '@/lib/utils/formatters';

interface StatusBadgeProps {
  status: string;
  type: 'loading' | 'planning';
  className?: string;
}

export function StatusBadge({ status, type, className = '' }: StatusBadgeProps) {
  const colors =
    type === 'loading' ? loadingStatusColors : planningStatusColors;
  const label =
    type === 'loading'
      ? formatLoadingStatus(status)
      : formatPlanningStatus(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        colors[status] || 'bg-gray-100 text-gray-700'
      } ${className}`}
    >
      {label}
    </span>
  );
}
