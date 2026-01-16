import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { formatFullDate, formatDate, formatDisplayDate, parseDate, isWeekend, getDayOfWeek, getTodayDate, getNextBusinessDay } from '@/lib/utils/dateHelpers';
import { DayEditor } from './DayEditor';

interface DayEditorPageProps {
  params: Promise<{ date: string }>;
}

function getAdjacentWorkday(date: Date, direction: 'prev' | 'next'): string {
  const result = new Date(date);
  const offset = direction === 'next' ? 1 : -1;

  do {
    result.setDate(result.getDate() + offset);
  } while (isWeekend(result));

  return formatDate(result);
}

export default async function DayEditorPage({ params }: DayEditorPageProps) {
  const { date } = await params;
  const dateObj = parseDate(date);
  const isToday = date === getTodayDate();

  // The URL date is the "preparation date" (when you're working)
  // The delivery date is the next business day
  const deliveryDate = getNextBusinessDay(dateObj);
  const deliveryDateStr = formatDate(deliveryDate);
  const deliveryDayOfWeek = getDayOfWeek(deliveryDate);

  const prevDay = getAdjacentWorkday(dateObj, 'prev');
  const nextDay = getAdjacentWorkday(dateObj, 'next');

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Link
          href={`/transportation/day/${prevDay}`}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous Day
        </Link>
        <Link
          href={`/transportation/day/${nextDay}`}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          Next Day
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <PageHeader
        title={
          <span className="flex items-center gap-3">
            <span>Preparing: {formatDisplayDate(deliveryDate)}</span>
            {isToday && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                Today
              </span>
            )}
          </span>
        }
        description={`Working on ${formatFullDate(dateObj)} — Routes will dispatch on ${formatFullDate(deliveryDate)}`}
        actions={
          <Link
            href="/transportation/planning"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Back to Planning
          </Link>
        }
      />

      <DayEditor date={deliveryDateStr} dayOfWeek={deliveryDayOfWeek} />
    </div>
  );
}
