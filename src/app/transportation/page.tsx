import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';

export default function TransportationPage() {
  return (
    <div>
      <PageHeader
        title="Transportation"
        description="Plan and manage delivery routes"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/transportation/templates"
          className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Weekly Templates
          </h2>
          <p className="text-sm text-gray-600">
            Manage default route assignments for each day of the week.
          </p>
        </Link>

        <Link
          href="/transportation/planning"
          className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            4-Week Planning
          </h2>
          <p className="text-sm text-gray-600">
            View and edit route assignments for the next four weeks.
          </p>
        </Link>
      </div>

      <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Finalize Tomorrow
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Generate Next Week
          </button>
        </div>
      </div>
    </div>
  );
}
