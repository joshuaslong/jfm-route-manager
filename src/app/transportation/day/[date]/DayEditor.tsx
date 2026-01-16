'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DropdownSelector } from '@/components/shared/DropdownSelector';
import { TimeInput } from '@/components/shared/TimeInput';
import { formatDispatchTime } from '@/lib/utils/formatters';

interface DayEditorProps {
  date: string;
  dayOfWeek: number;
  onFinalizeStatusChange?: (isFinalized: boolean) => void;
}

// Combined type for display - either from template or daily assignment
interface DisplayRow {
  id: string;
  source: 'template' | 'assignment';
  route_id: string | null;
  driver_id: string | null;
  truck_id: string | null;
  trailer_id: string | null;
  dispatch_time: string | null;
  backhaul: string | null;
  notes: string | null;
  status?: string;
  route?: { id: string; code: string; description: string | null } | null;
  driver?: { id: string; name: string } | null;
  truck?: { id: string; number: string; type: string } | null;
  trailer?: { id: string; number: string; type: string } | null;
}

export function DayEditor({ date, dayOfWeek }: DayEditorProps) {
  const [rows, setRows] = useState<DisplayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isNewRow, setIsNewRow] = useState(false);
  const [hasAssignments, setHasAssignments] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [finalizing, setFinalizing] = useState(false);

  const fetchData = useCallback(async () => {
    const supabase = createClient();

    // First check if we have daily assignments for this date
    const { data: assignments, error: assignmentError } = await supabase
      .from('daily_assignments')
      .select(`
        *,
        route:routes(*),
        driver:drivers(*),
        truck:trucks(*),
        trailer:trailers(*)
      `)
      .eq('date', date)
      .order('sort_order');

    if (assignmentError) {
      console.error('Error fetching assignments:', assignmentError);
    }

    if (assignments && assignments.length > 0) {
      // We have daily assignments - use those
      setHasAssignments(true);
      // Check if any are finalized (all should be finalized together)
      const finalized = assignments.some((a: any) => a.planning_status === 'finalized');
      setIsFinalized(finalized);
      setRows(assignments.map((a: any) => ({
        ...a,
        source: 'assignment' as const,
      })));
    } else {
      setIsFinalized(false);
      // No assignments - fall back to templates
      setHasAssignments(false);
      const { data: templates, error: templateError } = await supabase
        .from('weekly_templates')
        .select(`
          *,
          route:routes(*),
          driver:drivers(*),
          truck:trucks(*),
          trailer:trailers(*)
        `)
        .eq('day_of_week', dayOfWeek)
        .order('sort_order');

      if (templateError) {
        console.error('Error fetching templates:', templateError);
        setRows([]);
      } else {
        setRows((templates || []).map((t: any) => ({
          ...t,
          source: 'template' as const,
          status: 'pending',
        })));
      }
    }

    setLoading(false);
  }, [date, dayOfWeek]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Convert template to assignment when editing
  const ensureAssignment = async (row: DisplayRow): Promise<string> => {
    if (row.source === 'assignment') {
      return row.id;
    }

    // Create a daily assignment from this template row
    const supabase = createClient();
    const { data, error } = await (supabase
      .from('daily_assignments') as any)
      .insert({
        date,
        route_id: row.route_id,
        driver_id: row.driver_id,
        truck_id: row.truck_id,
        trailer_id: row.trailer_id,
        dispatch_time: row.dispatch_time,
        backhaul: row.backhaul,
        notes: row.notes,
        status: 'pending',
        sort_order: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }

    return data.id;
  };

  const handleUpdateField = async (row: DisplayRow, field: string, value: string | null) => {
    const supabase = createClient();

    try {
      // If this is a template row, we need to create an assignment first
      // But for simplicity, let's create ALL assignments for this day when any edit happens
      if (!hasAssignments) {
        // Create assignments for all template rows
        const assignments = rows.map((r, index) => ({
          date,
          route_id: r.route_id,
          driver_id: r.driver_id,
          truck_id: r.truck_id,
          trailer_id: r.trailer_id,
          dispatch_time: r.dispatch_time,
          backhaul: r.backhaul,
          notes: r.notes,
          status: 'pending',
          sort_order: index,
        }));

        const { error: insertError } = await (supabase
          .from('daily_assignments') as any)
          .insert(assignments);

        if (insertError) {
          console.error('Error creating assignments:', insertError);
          return;
        }

        setHasAssignments(true);
      }

      // Now update the specific field
      // We need to refetch to get the new assignment IDs
      await fetchData();

      // Find the assignment that matches this row and update it
      const { data: updatedAssignments } = await (supabase
        .from('daily_assignments') as any)
        .select('id, route_id')
        .eq('date', date)
        .order('sort_order');

      if (updatedAssignments) {
        // Find matching assignment by route_id or position
        const rowIndex = rows.findIndex(r => r.id === row.id);
        const targetAssignment = updatedAssignments[rowIndex];

        if (targetAssignment) {
          await (supabase
            .from('daily_assignments') as any)
            .update({ [field]: value })
            .eq('id', targetAssignment.id);

          fetchData();
        }
      }
    } catch (err) {
      console.error('Error updating:', err);
    }
  };

  const handleDelete = async (row: DisplayRow) => {
    if (row.source === 'template') {
      alert('This is from the template. To remove it, edit the weekly template.');
      return;
    }

    if (!confirm('Delete this assignment?')) return;

    const supabase = createClient();
    const { error } = await supabase
      .from('daily_assignments')
      .delete()
      .eq('id', row.id);

    if (error) {
      console.error('Error deleting:', error);
      return;
    }

    fetchData();
  };

  const handleFinalize = async () => {
    if (rows.length === 0) {
      alert('No routes to finalize for this day.');
      return;
    }

    setFinalizing(true);
    const supabase = createClient();

    try {
      // If we don't have assignments yet, create them from templates
      if (!hasAssignments) {
        const assignments = rows.map((r, index) => ({
          date,
          route_id: r.route_id,
          driver_id: r.driver_id,
          truck_id: r.truck_id,
          trailer_id: r.trailer_id,
          dispatch_time: r.dispatch_time,
          backhaul: r.backhaul,
          notes: r.notes,
          planning_status: 'finalized',
          sort_order: index,
        }));

        const { error: insertError } = await (supabase
          .from('daily_assignments') as any)
          .insert(assignments);

        if (insertError) {
          console.error('Error creating assignments:', insertError);
          alert('Failed to finalize. Please try again.');
          return;
        }
      } else {
        // Update existing assignments to finalized
        const { error: updateError } = await (supabase
          .from('daily_assignments') as any)
          .update({ planning_status: 'finalized' })
          .eq('date', date);

        if (updateError) {
          console.error('Error finalizing:', updateError);
          alert('Failed to finalize. Please try again.');
          return;
        }
      }

      setIsFinalized(true);
      setHasAssignments(true);
      fetchData();
    } finally {
      setFinalizing(false);
    }
  };

  const handleUnfinalize = async () => {
    setFinalizing(true);
    const supabase = createClient();

    try {
      const { error } = await (supabase
        .from('daily_assignments') as any)
        .update({ planning_status: 'draft' })
        .eq('date', date);

      if (error) {
        console.error('Error unfinalizing:', error);
        alert('Failed to unfinalize. Please try again.');
        return;
      }

      setIsFinalized(false);
      fetchData();
    } finally {
      setFinalizing(false);
    }
  };

  const handleAddRoute = async () => {
    const supabase = createClient();

    // If we're still showing templates, we need to create assignments first
    if (!hasAssignments && rows.length > 0) {
      // Create assignments for all existing template rows first
      const assignments = rows.map((r, index) => ({
        date,
        route_id: r.route_id,
        driver_id: r.driver_id,
        truck_id: r.truck_id,
        trailer_id: r.trailer_id,
        dispatch_time: r.dispatch_time,
        backhaul: r.backhaul,
        notes: r.notes,
        planning_status: 'draft',
        sort_order: index,
      }));

      const { error: insertError } = await (supabase
        .from('daily_assignments') as any)
        .insert(assignments);

      if (insertError) {
        console.error('Error creating assignments:', insertError);
        return;
      }
      setHasAssignments(true);
    }

    // Now add the new empty row
    const maxSortOrder = rows.length > 0
      ? Math.max(...rows.map((_, i) => i)) + 1
      : 0;

    const { data, error } = await (supabase
      .from('daily_assignments') as any)
      .insert({
        date,
        planning_status: 'draft',
        sort_order: maxSortOrder,
      })
      .select(`
        *,
        route:routes(*),
        driver:drivers(*),
        truck:trucks(*),
        trailer:trailers(*)
      `)
      .single();

    if (error) {
      console.error('Error adding route:', error);
      return;
    }

    if (data) {
      const newRow: DisplayRow = {
        ...data,
        source: 'assignment' as const,
      };

      setRows([...rows.map(r => ({ ...r, source: 'assignment' as const })), newRow]);
      setEditingId(data.id);
      setIsNewRow(true);
      setHasAssignments(true);
    }
  };

  const handleCancelNew = async () => {
    if (!editingId || !isNewRow) return;

    const supabase = createClient();
    await supabase
      .from('daily_assignments')
      .delete()
      .eq('id', editingId);

    setRows(rows.filter(r => r.id !== editingId));
    setEditingId(null);
    setIsNewRow(false);
  };

  const handleDone = () => {
    setEditingId(null);
    setIsNewRow(false);
  };

  const handleResetToTemplate = async () => {
    if (!confirm('This will delete all changes for this day and revert to the weekly template. Are you sure?')) {
      return;
    }

    const supabase = createClient();

    // Delete all daily assignments for this date
    const { error } = await supabase
      .from('daily_assignments')
      .delete()
      .eq('date', date);

    if (error) {
      console.error('Error resetting to template:', error);
      alert('Failed to reset. Please try again.');
      return;
    }

    // Refetch - this will now load from templates since assignments are gone
    setHasAssignments(false);
    setIsFinalized(false);
    fetchData();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex justify-between items-center">
        <div>
          {isFinalized ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Finalized
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Draft
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {hasAssignments && !isFinalized && (
            <button
              onClick={handleResetToTemplate}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Reset to Template
            </button>
          )}
          {!isFinalized && (
            <button
              onClick={handleAddRoute}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Add Route
            </button>
          )}
          {isFinalized ? (
            <button
              onClick={handleUnfinalize}
              disabled={finalizing}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {finalizing ? 'Processing...' : 'Unfinalize'}
            </button>
          ) : (
            <button
              onClick={handleFinalize}
              disabled={finalizing || rows.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {finalizing ? 'Finalizing...' : 'Finalize'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {!hasAssignments && rows.length > 0 && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 text-sm text-blue-700">
            Showing template defaults. Changes will be saved as daily assignments.
          </div>
        )}
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <colgroup>
          <col className="w-[140px]" />
          <col className="w-[180px]" />
          <col className="w-[120px]" />
          <col className="w-[120px]" />
          <col className="w-[80px]" />
          <col className="w-[160px]" />
          <col className="w-[100px]" />
        </colgroup>
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Route
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Driver
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Truck
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trailer
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dispatch
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Backhaul
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                No routes configured for this day.
                <br />
                <span className="text-sm">Click &quot;Add Route&quot; to create one.</span>
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {editingId === row.id ? (
                  <>
                    <td className="px-4 py-2">
                      <DropdownSelector
                        table="routes"
                        value={row.route_id}
                        onChange={(val) => handleUpdateField(row, 'route_id', val)}
                        placeholder="Select route"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <DropdownSelector
                        table="drivers"
                        value={row.driver_id}
                        onChange={(val) => handleUpdateField(row, 'driver_id', val)}
                        placeholder="Select driver"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <DropdownSelector
                        table="trucks"
                        value={row.truck_id}
                        onChange={(val) => handleUpdateField(row, 'truck_id', val)}
                        placeholder="Select truck"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <DropdownSelector
                        table="trailers"
                        value={row.trailer_id}
                        onChange={(val) => handleUpdateField(row, 'trailer_id', val)}
                        placeholder="Select trailer"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <TimeInput
                        value={row.dispatch_time}
                        onChange={(val) => handleUpdateField(row, 'dispatch_time', val)}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        defaultValue={row.backhaul || ''}
                        onBlur={(e) => handleUpdateField(row, 'backhaul', e.target.value || null)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Backhaul"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={handleDone}
                          className="text-green-600 hover:text-green-800 text-sm font-medium cursor-pointer"
                        >
                          Done
                        </button>
                        {isNewRow && (
                          <button
                            onClick={handleCancelNew}
                            className="text-gray-500 hover:text-gray-700 text-sm font-medium cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">
                      {row.route?.code || '—'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {row.driver?.name || '—'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {row.truck?.number || '—'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {row.trailer?.number || '—'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {formatDispatchTime(row.dispatch_time)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {row.backhaul || '—'}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setEditingId(row.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(row)}
                          className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}
