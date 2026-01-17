'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { formatFullDate, formatDate, formatDispatchTime, getNextBusinessDay } from '@/lib/utils/dateHelpers';
import { createClient } from '@/lib/supabase/client';

interface DoorAssignment {
  id: string;
  door_number: number;
  trailer_id: string | null;
  daily_assignment_id: string | null;
  date: string;
  move_status: 'at_door' | 'jockey_moving' | 'truck_in' | 'departed';
  assigned_at: string;
  removed_at: string | null;
  trailer?: { id: string; number: string } | null;
  daily_assignment?: {
    id: string;
    loading_status: string;
    dispatch_time: string | null;
    route?: { id: string; code: string } | null;
    driver?: { id: string; name: string } | null;
  } | null;
}

interface UnassignedTrailer {
  id: string;
  daily_assignment_id: string;
  trailer_number: string;
  route_code: string;
  loading_status: string;
  dispatch_time: string | null;
}

// Door numbers 4-13
const DOORS = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

// Storage trailer that typically sits in door 4
const STORAGE_TRAILER = { number: '1007', doorNumber: 4 };

const MOVE_STATUS_CONFIG = {
  at_door: { label: 'At Door', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  jockey_moving: { label: 'Jockey Moving', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  truck_in: { label: 'Truck In', color: 'bg-green-100 text-green-800 border-green-200' },
  departed: { label: 'Departed', color: 'bg-gray-100 text-gray-600 border-gray-200' },
};

const LOADING_STATUS_CONFIG = {
  not_started: { label: 'Not Started', color: 'bg-gray-300' },
  in_progress: { label: 'Loading', color: 'bg-yellow-400' },
  loaded: { label: 'Loaded', color: 'bg-green-500' },
};

export default function DoorsPage() {
  const [doorAssignments, setDoorAssignments] = useState<DoorAssignment[]>([]);
  const [unassignedTrailers, setUnassignedTrailers] = useState<UnassignedTrailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningDoor, setAssigningDoor] = useState<number | null>(null);

  const deliveryDate = getNextBusinessDay(new Date());
  const deliveryDateStr = formatDate(deliveryDate);

  const fetchData = async () => {
    const supabase = createClient();

    // Fetch active door assignments for today
    const { data: assignments, error: assignmentError } = await supabase
      .from('door_assignments')
      .select(`
        *,
        trailer:trailers(*),
        daily_assignment:daily_assignments(
          id,
          loading_status,
          dispatch_time,
          route:routes(id, code),
          driver:drivers(id, name)
        )
      `)
      .eq('date', deliveryDateStr)
      .is('removed_at', null)
      .order('door_number');

    if (assignmentError) {
      console.error('Error fetching door assignments:', assignmentError);
    } else {
      setDoorAssignments((assignments || []) as DoorAssignment[]);
    }

    // Fetch daily assignments that don't have an active door assignment
    const { data: dailyAssignments, error: dailyError } = await supabase
      .from('daily_assignments')
      .select(`
        id,
        loading_status,
        dispatch_time,
        trailer:trailers(id, number),
        route:routes(id, code)
      `)
      .eq('date', deliveryDateStr)
      .eq('planning_status', 'finalized')
      .not('trailer_id', 'is', null);

    if (dailyError) {
      console.error('Error fetching daily assignments:', dailyError);
    } else {
      // Filter out assignments that already have an active door assignment
      const assignedDailyIds = new Set((assignments || []).map((a: DoorAssignment) => a.daily_assignment_id));
      const unassigned = (dailyAssignments || [])
        .filter((da: any) => !assignedDailyIds.has(da.id))
        .map((da: any) => ({
          id: da.trailer?.id,
          daily_assignment_id: da.id,
          trailer_number: da.trailer?.number || '?',
          route_code: da.route?.code || '?',
          loading_status: da.loading_status,
          dispatch_time: da.dispatch_time,
        }));
      setUnassignedTrailers(unassigned);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [deliveryDateStr]);

  const getDoorAssignment = (doorNumber: number): DoorAssignment | undefined => {
    return doorAssignments.find(a => a.door_number === doorNumber);
  };

  const handleAssignToDoor = async (doorNumber: number, trailerId: string, dailyAssignmentId: string) => {
    const supabase = createClient();

    const { error } = await (supabase
      .from('door_assignments') as any)
      .insert({
        door_number: doorNumber,
        trailer_id: trailerId,
        daily_assignment_id: dailyAssignmentId,
        date: deliveryDateStr,
        move_status: 'at_door',
      });

    if (error) {
      console.error('Error assigning to door:', error);
      return;
    }

    setAssigningDoor(null);
    fetchData();
  };

  const handleUpdateMoveStatus = async (assignmentId: string, newStatus: string) => {
    const supabase = createClient();

    if (newStatus === 'departed') {
      // Mark as removed when departed
      const { error } = await (supabase
        .from('door_assignments') as any)
        .update({ move_status: newStatus, removed_at: new Date().toISOString() })
        .eq('id', assignmentId);

      if (error) {
        console.error('Error updating move status:', error);
        return;
      }
    } else {
      const { error } = await (supabase
        .from('door_assignments') as any)
        .update({ move_status: newStatus })
        .eq('id', assignmentId);

      if (error) {
        console.error('Error updating move status:', error);
        return;
      }
    }

    fetchData();
  };

  const handleClearDoor = async (assignmentId: string) => {
    const supabase = createClient();

    const { error } = await (supabase
      .from('door_assignments') as any)
      .update({ removed_at: new Date().toISOString() })
      .eq('id', assignmentId);

    if (error) {
      console.error('Error clearing door:', error);
      return;
    }

    fetchData();
  };

  const handleAssignStorageTrailer = async () => {
    const supabase = createClient();

    // First, find the trailer by number
    const { data: trailer, error: trailerError } = await (supabase
      .from('trailers') as any)
      .select('id')
      .eq('number', STORAGE_TRAILER.number)
      .single();

    if (trailerError || !trailer) {
      console.error('Error finding storage trailer:', trailerError);
      alert(`Could not find trailer ${STORAGE_TRAILER.number}. Make sure it exists in the system.`);
      return;
    }

    // Create door assignment without a daily_assignment (storage only)
    const { error } = await (supabase
      .from('door_assignments') as any)
      .insert({
        door_number: STORAGE_TRAILER.doorNumber,
        trailer_id: (trailer as { id: string }).id,
        daily_assignment_id: null,
        date: deliveryDateStr,
        move_status: 'at_door',
      });

    if (error) {
      console.error('Error assigning storage trailer:', error);
      return;
    }

    fetchData();
  };

  const occupiedCount = doorAssignments.length;
  const emptyCount = DOORS.length - occupiedCount;

  return (
    <div>
      <PageHeader
        title="Dock View"
        description={`Door assignments for ${formatFullDate(deliveryDate)} deliveries`}
        actions={
          <div className="flex items-center gap-2">
            {!getDoorAssignment(STORAGE_TRAILER.doorNumber) && (
              <button
                onClick={handleAssignStorageTrailer}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Set Door 4 as {STORAGE_TRAILER.number}
              </button>
            )}
            <Link
              href="/shipping"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Back to Loading
            </Link>
          </div>
        }
      />

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
          Loading...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Bar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{occupiedCount}</span>
                  <span className="text-sm text-gray-500">Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-400">{emptyCount}</span>
                  <span className="text-sm text-gray-500">Empty</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
                  <span className="text-gray-600">Not Started</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                  <span className="text-gray-600">Loading</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  <span className="text-gray-600">Loaded</span>
                </div>
              </div>
            </div>
          </div>

          {/* Door List - Table Layout */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Door
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trailer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dispatch
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Move Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {DOORS.map((doorNumber) => {
                  const assignment = getDoorAssignment(doorNumber);
                  const loadingStatus = assignment?.daily_assignment?.loading_status || 'not_started';
                  const loadingConfig = LOADING_STATUS_CONFIG[loadingStatus as keyof typeof LOADING_STATUS_CONFIG] || LOADING_STATUS_CONFIG.not_started;
                  const moveConfig = assignment ? MOVE_STATUS_CONFIG[assignment.move_status] : null;

                  return (
                    <tr
                      key={doorNumber}
                      className={assignment ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-lg font-bold ${
                          assignment
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {doorNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {assignment && (
                          <span className={`w-3 h-3 rounded-full inline-block ${loadingConfig.color}`}></span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {assignment ? (
                          <span className="text-lg font-bold text-gray-900">
                            {assignment.trailer?.number || '?'}
                          </span>
                        ) : assigningDoor === doorNumber ? (
                          <div className="flex items-center gap-2">
                            {unassignedTrailers.length > 0 ? (
                              <select
                                onChange={(e) => {
                                  const selected = unassignedTrailers.find(t => t.daily_assignment_id === e.target.value);
                                  if (selected) {
                                    handleAssignToDoor(doorNumber, selected.id, selected.daily_assignment_id);
                                  }
                                }}
                                className="text-sm border border-gray-300 rounded px-2 py-1 cursor-pointer bg-white"
                                defaultValue=""
                                autoFocus
                              >
                                <option value="" disabled>Select trailer...</option>
                                {unassignedTrailers.map((t) => (
                                  <option key={t.daily_assignment_id} value={t.daily_assignment_id}>
                                    {t.trailer_number} - {t.route_code}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-sm text-gray-400">No trailers available</span>
                            )}
                            <button
                              onClick={() => setAssigningDoor(null)}
                              className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAssigningDoor(doorNumber)}
                            className="text-sm text-purple-600 hover:text-purple-800 font-medium cursor-pointer"
                          >
                            + Assign trailer
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {assignment?.daily_assignment?.route?.code || (assignment && !assignment.daily_assignment_id ? (
                          <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded">Storage</span>
                        ) : '—')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {assignment?.daily_assignment?.dispatch_time
                          ? formatDispatchTime(assignment.daily_assignment.dispatch_time)
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {assignment ? (
                          <select
                            value={assignment.move_status}
                            onChange={(e) => handleUpdateMoveStatus(assignment.id, e.target.value)}
                            className={`text-xs font-medium rounded px-2 py-1 cursor-pointer border ${moveConfig?.color}`}
                          >
                            <option value="at_door">At Door</option>
                            <option value="jockey_moving">Jockey Moving</option>
                            <option value="truck_in">Truck In</option>
                            <option value="departed">Departed</option>
                          </select>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {assignment && (
                          <button
                            onClick={() => handleClearDoor(assignment.id)}
                            className="text-xs text-gray-500 hover:text-red-600 cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Unassigned Trailers */}
          {unassignedTrailers.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-3">
                In Yard - Not At Door ({unassignedTrailers.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {unassignedTrailers.map((trailer) => {
                  const loadingConfig = LOADING_STATUS_CONFIG[trailer.loading_status as keyof typeof LOADING_STATUS_CONFIG] || LOADING_STATUS_CONFIG.not_started;
                  return (
                    <div
                      key={trailer.daily_assignment_id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded border border-yellow-200 text-sm"
                    >
                      <span className={`w-2 h-2 rounded-full ${loadingConfig.color}`}></span>
                      <span className="font-medium text-gray-900">{trailer.trailer_number}</span>
                      <span className="text-gray-500">{trailer.route_code}</span>
                      {trailer.dispatch_time && (
                        <span className="text-xs text-gray-400">
                          {formatDispatchTime(trailer.dispatch_time)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
