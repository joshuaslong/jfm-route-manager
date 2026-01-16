'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { formatDate, formatDisplayDate, getNextNWeeksWorkdays, getTodayDate, getNextBusinessDay } from '@/lib/utils/dateHelpers';

export default function PlanningPage() {
  const [numWeeks, setNumWeeks] = useState(4);
  const today = getTodayDate();

  const workdays = getNextNWeeksWorkdays(numWeeks);

  // Group by week (every 5 days since we're generating complete weeks)
  const weeks: Date[][] = [];
  for (let i = 0; i < workdays.length; i += 5) {
    weeks.push(workdays.slice(i, i + 5));
  }

  const handleShowMore = () => {
    setNumWeeks(prev => prev + 4);
  };

  return (
    <div>
      <PageHeader
        title={`${numWeeks}-Week Planning`}
        description="Click a day to prepare routes for the next business day (e.g., Friday prepares Monday's routes)"
      />

      <div className="space-y-6">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">
                Week {weekIndex + 1}
              </h3>
            </div>
            <div className="grid grid-cols-5 divide-x divide-gray-200">
              {week.map((date) => {
                const dateStr = formatDate(date);
                const isToday = dateStr === today;
                const deliveryDate = getNextBusinessDay(date);
                return (
                  <Link
                    key={dateStr}
                    href={`/transportation/day/${dateStr}`}
                    className={`p-4 hover:bg-gray-50 transition-colors relative ${
                      isToday ? 'ring-2 ring-inset ring-green-500 bg-green-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDisplayDate(date)}
                      </div>
                      {isToday && (
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-blue-600">
                      → {formatDisplayDate(deliveryDate)}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {isToday ? 'Today' : 'Click to view'}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleShowMore}
          className="px-6 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
        >
          Show 4 More Weeks
        </button>
      </div>
    </div>
  );
}
