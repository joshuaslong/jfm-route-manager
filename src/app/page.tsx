import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';

export default function Home() {
  return (
    <div>
      <PageHeader
        title="Route Manager"
        description="Daily delivery route management system"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/transportation"
          className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Transportation
          </h2>
          <p className="text-sm text-gray-600">
            Plan routes, manage templates, and finalize tomorrow&apos;s assignments.
          </p>
        </Link>

        <Link
          href="/shipping"
          className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Shipping</h2>
          <p className="text-sm text-gray-600">
            View tonight&apos;s load, assign loaders, and update loading status.
          </p>
        </Link>

        <Link
          href="/admin"
          className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Admin</h2>
          <p className="text-sm text-gray-600">
            Manage drivers, trucks, trailers, loaders, and routes.
          </p>
        </Link>
      </div>
    </div>
  );
}
