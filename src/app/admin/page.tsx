import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';

const adminSections = [
  {
    title: 'Users',
    description: 'Manage user accounts and permissions',
    href: '/admin/users',
  },
  {
    title: 'Drivers',
    description: 'Manage delivery drivers',
    href: '/admin/drivers',
  },
  {
    title: 'Trucks',
    description: 'Manage tractors and box trucks',
    href: '/admin/trucks',
  },
  {
    title: 'Trailers',
    description: 'Manage trailers',
    href: '/admin/trailers',
  },
  {
    title: 'Loaders',
    description: 'Manage warehouse loaders',
    href: '/admin/loaders',
  },
  {
    title: 'Routes',
    description: 'Manage route definitions',
    href: '/admin/routes',
  },
];

export default function AdminPage() {
  return (
    <div>
      <PageHeader
        title="Administration"
        description="Manage system reference data"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {section.title}
            </h2>
            <p className="text-sm text-gray-600">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
