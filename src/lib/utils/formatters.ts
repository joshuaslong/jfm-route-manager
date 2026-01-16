import type { Truck, Trailer } from '@/lib/types/database';

/**
 * Format dispatch time for display (e.g., "2:30am")
 */
export function formatDispatchTime(time: string | null): string {
  if (!time) return '—';
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'pm' : 'am';
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayHour}:${minutes}${ampm}`;
}

/**
 * Parse display time to 24-hour format for storage
 */
export function parseDispatchTime(displayTime: string): string | null {
  if (!displayTime) return null;

  const match = displayTime.match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i);
  if (!match) return null;

  let hours = parseInt(match[1]);
  const minutes = match[2];
  const period = match[3]?.toLowerCase();

  if (period === 'pm' && hours !== 12) {
    hours += 12;
  } else if (period === 'am' && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
}

/**
 * Format truck and trailer into display format (e.g., "88-1027")
 */
export function formatEquipment(truck: Truck | null, trailer: Trailer | null): string {
  if (!truck) return '—';
  if (!trailer) return truck.number; // Box truck
  if (trailer.type === 'transfer') return `${truck.number}-Transfer`;
  return `${truck.number}-${trailer.number}`;
}

/**
 * Get status badge colors
 */
export const loadingStatusColors: Record<string, string> = {
  not_started: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-yellow-100 text-yellow-800',
  loaded: 'bg-green-100 text-green-800',
};

export const planningStatusColors: Record<string, string> = {
  draft: 'bg-orange-100 text-orange-700',
  finalized: 'bg-blue-100 text-blue-800',
};

/**
 * Get human-readable loading status
 */
export function formatLoadingStatus(status: string): string {
  const labels: Record<string, string> = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    loaded: 'Loaded',
  };
  return labels[status] || status;
}

/**
 * Get human-readable planning status
 */
export function formatPlanningStatus(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Draft',
    finalized: 'Finalized',
  };
  return labels[status] || status;
}

/**
 * Get next loading status in cycle
 */
export function getNextLoadingStatus(current: string): string {
  const cycle: Record<string, string> = {
    not_started: 'in_progress',
    in_progress: 'loaded',
    loaded: 'not_started',
  };
  return cycle[current] || 'not_started';
}
