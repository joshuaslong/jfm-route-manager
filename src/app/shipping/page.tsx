'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { formatFullDate, formatDispatchTime, formatDate, getNextBusinessDay } from '@/lib/utils/dateHelpers';
import { createClient } from '@/lib/supabase/client';
import { useShippingPreferences } from '@/hooks/useShippingPreferences';

interface Loader {
  id: string;
  name: string;
}

interface AssignmentLoader {
  id: string;
  daily_assignment_id: string;
  loader_id: string;
  loader?: Loader;
}

interface DoorAssignment {
  id: string;
  door_number: number;
  move_status: string;
}

interface Assignment {
  id: string;
  route_id: string | null;
  driver_id: string | null;
  truck_id: string | null;
  trailer_id: string | null;
  dispatch_time: string | null;
  backhaul: string | null;
  loading_status: string;
  route?: { id: string; code: string; description: string | null } | null;
  driver?: { id: string; name: string } | null;
  truck?: { id: string; number: string } | null;
  trailer?: { id: string; number: string } | null;
  loaders?: AssignmentLoader[];
  door_assignment?: DoorAssignment | null;
}

export default function ShippingPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loaders, setLoaders] = useState<Loader[]>([]);
  const [loading, setLoading] = useState(true);
  const { sortBy, setSortBy, layout, setLayout, isLoaded } = useShippingPreferences();

  // Tonight we load trailers for the next business day's deliveries
  // This matches the transportation logic: today's work prepares tomorrow's routes
  const deliveryDate = getNextBusinessDay(new Date());
  const deliveryDateStr = formatDate(deliveryDate);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const supabase = createClient();

      // Fetch assignments with loaders
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('daily_assignments')
        .select(`
          *,
          route:routes(*),
          driver:drivers(*),
          truck:trucks(*),
          trailer:trailers(*),
          loaders:assignment_loaders(
            id,
            loader_id,
            loader:loaders(*)
          )
        `)
        .eq('date', deliveryDateStr)
        .eq('planning_status', 'finalized')
        .order('dispatch_time');

      if (assignmentError) {
        console.error('Error fetching assignments:', assignmentError);
        setAssignments([]);
      } else {
        // Fetch door assignments separately
        const { data: doorData } = await supabase
          .from('door_assignments')
          .select('id, door_number, move_status, daily_assignment_id')
          .eq('date', deliveryDateStr)
          .is('removed_at', null);

        // Map door assignments to daily assignments
        const doorMap = new Map<string, DoorAssignment>();
        (doorData || []).forEach((d: any) => {
          if (d.daily_assignment_id) {
            doorMap.set(d.daily_assignment_id, {
              id: d.id,
              door_number: d.door_number,
              move_status: d.move_status,
            });
          }
        });

        const assignmentsWithDoors = (assignmentData || []).map((a: any) => ({
          ...a,
          door_assignment: doorMap.get(a.id) || null,
        }));

        setAssignments(assignmentsWithDoors as Assignment[]);
      }

      // Fetch all loaders
      const { data: loaderData, error: loaderError } = await supabase
        .from('loaders')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (loaderError) {
        console.error('Error fetching loaders:', loaderError);
      } else {
        setLoaders(loaderData || []);
      }

      setLoading(false);
    }

    fetchData();
  }, [deliveryDateStr]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const supabase = createClient();

    const { error } = await (supabase
      .from('daily_assignments') as any)
      .update({ loading_status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      return;
    }

    setAssignments(assignments.map(a =>
      a.id === id ? { ...a, loading_status: newStatus } : a
    ));
  };

  const handleAddLoader = async (assignmentId: string, loaderId: string) => {
    const supabase = createClient();

    const { data, error } = await (supabase
      .from('assignment_loaders') as any)
      .insert({
        daily_assignment_id: assignmentId,
        loader_id: loaderId,
      })
      .select(`
        id,
        loader_id,
        loader:loaders(*)
      `)
      .single();

    if (error) {
      console.error('Error adding loader:', error);
      return;
    }

    // Find the assignment to check if this is the first loader
    const assignment = assignments.find(a => a.id === assignmentId);
    const isFirstLoader = assignment && (!assignment.loaders || assignment.loaders.length === 0);

    // If this is the first loader and status is not_started, auto-set to in_progress
    if (isFirstLoader && assignment?.loading_status === 'not_started') {
      await (supabase
        .from('daily_assignments') as any)
        .update({ loading_status: 'in_progress' })
        .eq('id', assignmentId);
    }

    // Update local state
    setAssignments(assignments.map(a => {
      if (a.id === assignmentId) {
        return {
          ...a,
          loaders: [...(a.loaders || []), data as AssignmentLoader],
          // Also update loading_status locally if it was the first loader
          loading_status: isFirstLoader && a.loading_status === 'not_started' ? 'in_progress' : a.loading_status,
        };
      }
      return a;
    }));
  };

  const handleRemoveLoader = async (assignmentId: string, assignmentLoaderId: string) => {
    const supabase = createClient();

    const { error } = await supabase
      .from('assignment_loaders')
      .delete()
      .eq('id', assignmentLoaderId);

    if (error) {
      console.error('Error removing loader:', error);
      return;
    }

    // Update local state
    setAssignments(assignments.map(a => {
      if (a.id === assignmentId) {
        return {
          ...a,
          loaders: (a.loaders || []).filter(l => l.id !== assignmentLoaderId),
        };
      }
      return a;
    }));
  };

  const getAssignedLoaderIds = (assignment: Assignment): string[] => {
    return (assignment.loaders || []).map(l => l.loader_id);
  };

  const getAvailableLoaders = (assignment: Assignment): Loader[] => {
    const assignedIds = getAssignedLoaderIds(assignment);
    return loaders.filter(l => !assignedIds.includes(l.id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'loaded': return 'bg-green-500';
      case 'in_progress': return 'bg-yellow-400';
      default: return 'bg-gray-300';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'loaded': return 'bg-green-50 border-green-200';
      case 'in_progress': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-white border-gray-200';
    }
  };

  const notStartedCount = assignments.filter(a => a.loading_status === 'not_started').length;
  const inProgressCount = assignments.filter(a => a.loading_status === 'in_progress').length;
  const loadedCount = assignments.filter(a => a.loading_status === 'loaded').length;

  // Sort assignments
  const sortedAssignments = [...assignments].sort((a, b) => {
    if (sortBy === 'dispatch_time') {
      const timeA = a.dispatch_time || '99:99';
      const timeB = b.dispatch_time || '99:99';
      return timeA.localeCompare(timeB);
    } else {
      const codeA = a.route?.code || 'ZZZ';
      const codeB = b.route?.code || 'ZZZ';
      return codeA.localeCompare(codeB);
    }
  });

  // Get first name for compact display
  const getFirstName = (name: string) => name.split(' ')[0];

  return (
    <div>
      <PageHeader
        title="Loading"
        description={`Loading trailers for ${formatFullDate(deliveryDate)} deliveries`}
        actions={
          <Link
            href="/shipping/doors"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Door View
          </Link>
        }
      />

      {(loading || !isLoaded) ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
          Loading...
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-sm text-yellow-800">
            No finalized routes for {formatFullDate(deliveryDate)} yet. Waiting for Transportation to finalize.
          </p>
        </div>
      ) : (
        <>
          {/* Progress Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-700">Loading Progress</h2>
              <span className="text-sm text-gray-500">
                {loadedCount} of {assignments.length} complete
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div className="h-full flex">
                <div
                  className="bg-green-500 transition-all duration-300"
                  style={{ width: `${(loadedCount / assignments.length) * 100}%` }}
                />
                <div
                  className="bg-yellow-400 transition-all duration-300"
                  style={{ width: `${(inProgressCount / assignments.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Status Counts */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="w-3 h-3 rounded-full bg-gray-300 flex-shrink-0"></span>
                <div>
                  <div className="text-2xl font-semibold text-gray-900">{notStartedCount}</div>
                  <div className="text-xs text-gray-500">Not Started</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <span className="w-3 h-3 rounded-full bg-yellow-400 flex-shrink-0"></span>
                <div>
                  <div className="text-2xl font-semibold text-gray-900">{inProgressCount}</div>
                  <div className="text-xs text-gray-500">In Progress</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></span>
                <div>
                  <div className="text-2xl font-semibold text-gray-900">{loadedCount}</div>
                  <div className="text-xs text-gray-500">Loaded</div>
                </div>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white cursor-pointer"
              >
                <option value="dispatch_time">Dispatch Time</option>
                <option value="route_code">Route Code</option>
              </select>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLayout('grid')}
                className={`p-1.5 rounded cursor-pointer transition-colors ${
                  layout === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                title="Grid view"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setLayout('list')}
                className={`p-1.5 rounded cursor-pointer transition-colors ${
                  layout === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                title="List view"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Route Cards - Grid Layout */}
          {layout === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className={`rounded-lg border-2 transition-all ${getStatusBgColor(assignment.loading_status)}`}
              >
                {/* Card Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${getStatusColor(assignment.loading_status)}`}></span>
                      <h3 className="text-lg font-bold text-gray-900">
                        {assignment.route?.code || 'No Route'}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {assignment.door_assignment ? (
                        <Link
                          href="/shipping/doors"
                          className="text-sm font-medium rounded px-2 py-1 bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200 transition-colors"
                        >
                          Door {assignment.door_assignment.door_number}
                        </Link>
                      ) : (
                        <Link
                          href="/shipping/doors"
                          className="text-sm font-medium rounded px-2 py-1 bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200 transition-colors"
                        >
                          No Door
                        </Link>
                      )}
                      {assignment.dispatch_time && (
                        <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {formatDispatchTime(assignment.dispatch_time)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Trailer</div>
                      <div className="font-semibold text-gray-900">{assignment.trailer?.number || '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Driver</div>
                      <div className="font-medium text-gray-700">{assignment.driver?.name || '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Truck</div>
                      <div className="font-medium text-gray-700">{assignment.truck?.number || '—'}</div>
                    </div>
                    {assignment.backhaul && (
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Backhaul</div>
                        <div className="font-medium text-gray-700">{assignment.backhaul}</div>
                      </div>
                    )}
                  </div>

                  {/* Assigned Loaders */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Crew</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(assignment.loaders || []).map((al) => (
                        <span
                          key={al.id}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                        >
                          {getFirstName(al.loader?.name || '')}
                          <button
                            onClick={() => handleRemoveLoader(assignment.id, al.id)}
                            className="hover:text-blue-600 cursor-pointer"
                            title="Remove"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                      {getAvailableLoaders(assignment).length > 0 && (
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddLoader(assignment.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="px-2 py-1 text-xs border border-dashed border-gray-300 rounded bg-white cursor-pointer hover:border-gray-400"
                          defaultValue=""
                        >
                          <option value="">+ Add</option>
                          {getAvailableLoaders(assignment).map((loader) => (
                            <option key={loader.id} value={loader.id}>
                              {loader.name}
                            </option>
                          ))}
                        </select>
                      )}
                      {(assignment.loaders || []).length === 0 && getAvailableLoaders(assignment).length === 0 && (
                        <span className="text-xs text-gray-400">No crew available</span>
                      )}
                    </div>
                  </div>

                  {/* Status Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(assignment.id, 'not_started')}
                      className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer transition-colors ${
                        assignment.loading_status === 'not_started'
                          ? 'bg-gray-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Not Started
                    </button>
                    <button
                      onClick={() => handleStatusChange(assignment.id, 'in_progress')}
                      className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer transition-colors ${
                        assignment.loading_status === 'in_progress'
                          ? 'bg-yellow-500 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleStatusChange(assignment.id, 'loaded')}
                      className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer transition-colors ${
                        assignment.loading_status === 'loaded'
                          ? 'bg-green-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Loaded
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}

          {/* Route List - List Layout */}
          {layout === 'list' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dispatch
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trailer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Door
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Crew
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedAssignments.map((assignment) => (
                  <tr
                    key={assignment.id}
                    className={`transition-colors ${
                      assignment.loading_status === 'loaded'
                        ? 'bg-green-50'
                        : assignment.loading_status === 'in_progress'
                          ? 'bg-yellow-50'
                          : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className={`w-3 h-3 rounded-full inline-block ${getStatusColor(assignment.loading_status)}`}></span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {assignment.route?.code || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {assignment.dispatch_time ? formatDispatchTime(assignment.dispatch_time) : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {assignment.trailer?.number || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {assignment.door_assignment ? (
                        <Link
                          href="/shipping/doors"
                          className="text-xs font-medium rounded px-2 py-1 bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200 transition-colors"
                        >
                          {assignment.door_assignment.door_number}
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-1">
                        {(assignment.loaders || []).map((al) => (
                          <span
                            key={al.id}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                          >
                            {getFirstName(al.loader?.name || '')}
                            <button
                              onClick={() => handleRemoveLoader(assignment.id, al.id)}
                              className="hover:text-blue-600 cursor-pointer"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))}
                        {getAvailableLoaders(assignment).length > 0 && (
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAddLoader(assignment.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="px-1.5 py-0.5 text-xs border border-dashed border-gray-300 rounded bg-white cursor-pointer"
                            defaultValue=""
                          >
                            <option value="">+</option>
                            {getAvailableLoaders(assignment).map((loader) => (
                              <option key={loader.id} value={loader.id}>
                                {loader.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleStatusChange(assignment.id, 'not_started')}
                          className={`px-2 py-1 text-xs font-medium rounded cursor-pointer transition-colors ${
                            assignment.loading_status === 'not_started'
                              ? 'bg-gray-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title="Not Started"
                        >
                          NS
                        </button>
                        <button
                          onClick={() => handleStatusChange(assignment.id, 'in_progress')}
                          className={`px-2 py-1 text-xs font-medium rounded cursor-pointer transition-colors ${
                            assignment.loading_status === 'in_progress'
                              ? 'bg-yellow-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title="In Progress"
                        >
                          IP
                        </button>
                        <button
                          onClick={() => handleStatusChange(assignment.id, 'loaded')}
                          className={`px-2 py-1 text-xs font-medium rounded cursor-pointer transition-colors ${
                            assignment.loading_status === 'loaded'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title="Loaded"
                        >
                          L
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </>
      )}
    </div>
  );
}
