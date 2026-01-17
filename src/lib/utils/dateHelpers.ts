/**
 * Get tomorrow's date in YYYY-MM-DD format
 */
export function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDate(tomorrow);
}

/**
 * Get today's date in YYYY-MM-DD format (local timezone)
 */
export function getTodayDate(): string {
  return formatDate(new Date());
}

/**
 * Format a Date object to YYYY-MM-DD string (local timezone)
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse a YYYY-MM-DD string to Date object
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}

/**
 * Get day of week (1=Monday, 5=Friday) from a date
 */
export function getDayOfWeek(date: Date): number {
  const day = date.getDay();
  // Convert from Sunday=0 to Monday=1 format
  return day === 0 ? 7 : day;
}

/**
 * Get day name from day number (1=Monday)
 */
export function getDayName(dayOfWeek: number): string {
  const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days[dayOfWeek] || '';
}

/**
 * Get short day name from day number (1=Monday)
 */
export function getShortDayName(dayOfWeek: number): string {
  const days = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days[dayOfWeek] || '';
}

/**
 * Check if a date is a weekend
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Get an array of dates for the next N days
 */
export function getNextNDays(n: number, startDate: Date = new Date()): Date[] {
  const dates: Date[] = [];
  const current = new Date(startDate);

  for (let i = 1; i <= n; i++) {
    const next = new Date(current);
    next.setDate(current.getDate() + i);
    dates.push(next);
  }

  return dates;
}

/**
 * Get the start of the week (Monday) for a given date
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Adjust to get Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get dates for complete weeks of workdays (Mon-Fri), starting from current week's Monday
 */
export function getNextNWeeksWorkdays(numWeeks: number = 4): Date[] {
  const today = new Date();
  const dates: Date[] = [];

  // Find current week's Monday (go back to Monday of this week)
  let startDate = new Date(today);
  const dayOfWeek = startDate.getDay();
  if (dayOfWeek === 0) {
    // Sunday - go back 6 days to Monday
    startDate.setDate(startDate.getDate() - 6);
  } else if (dayOfWeek !== 1) {
    // Not Monday - go back to this week's Monday
    startDate.setDate(startDate.getDate() - (dayOfWeek - 1));
  }
  startDate.setHours(0, 0, 0, 0);

  // Generate complete weeks (5 workdays each)
  for (let week = 0; week < numWeeks; week++) {
    for (let day = 0; day < 5; day++) { // Mon-Fri
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + (week * 7) + day);
      dates.push(date);
    }
  }

  return dates;
}

/**
 * Get dates for exactly 4 complete weeks of workdays (Mon-Fri), starting from next Monday
 */
export function getNext4WeeksWorkdays(): Date[] {
  return getNextNWeeksWorkdays(4);
}

/**
 * Format date for display (e.g., "Mon, Jan 15")
 */
export function formatDisplayDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseDate(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date for full display (e.g., "Monday, January 15, 2024")
 */
export function formatFullDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseDate(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format dispatch time for display (e.g., "5:30 AM")
 */
export function formatDispatchTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Get the next business day (Mon-Fri) from a given date
 * Friday -> Monday, other days -> next day
 */
export function getNextBusinessDay(date: Date | string): Date {
  const d = typeof date === 'string' ? parseDate(date) : new Date(date);
  const result = new Date(d);

  do {
    result.setDate(result.getDate() + 1);
  } while (isWeekend(result));

  return result;
}

/**
 * Get the next business day as a formatted string
 */
export function getNextBusinessDayString(date: Date | string): string {
  return formatDate(getNextBusinessDay(date));
}
