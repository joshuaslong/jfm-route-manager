'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DropdownSelector } from '@/components/shared/DropdownSelector';
import { TimeInput } from '@/components/shared/TimeInput';
import { createClient } from '@/lib/supabase/client';
import { formatDispatchTime } from '@/lib/utils/formatters';
import type { WeeklyTemplateWithRelations } from '@/lib/types/database';

const DAYS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
];

type SortDirection = 'asc' | 'desc' | null;

export default function TemplatesPage() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [templates, setTemplates] = useState<WeeklyTemplateWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isNewRow, setIsNewRow] = useState(false);
  const [dispatchSort, setDispatchSort] = useState<SortDirection>(null);

  const fetchTemplates = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('weekly_templates')
      .select(`
        *,
        route:routes(*),
        driver:drivers(*),
        truck:trucks(*),
        trailer:trailers(*)
      `)
      .eq('day_of_week', selectedDay)
      .order('sort_order');

    if (error) {
      console.error('Error fetching templates:', error);
      return;
    }

    setTemplates(data as WeeklyTemplateWithRelations[]);
    setLoading(false);
  }, [selectedDay]);

  useEffect(() => {
    setLoading(true);
    fetchTemplates();
  }, [fetchTemplates]);

  const handleAddRoute = async () => {
    const supabase = createClient();
    const maxSortOrder = templates.length > 0
      ? Math.max(...templates.map(t => t.sort_order)) + 1
      : 0;

    const { data, error } = await supabase
      .from('weekly_templates')
      .insert({
        day_of_week: selectedDay,
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
      console.error('Error adding template:', error);
      return;
    }

    setTemplates([...templates, data as WeeklyTemplateWithRelations]);
    setEditingId(data.id);
    setIsNewRow(true);
  };

  const handleCancelNew = async () => {
    if (!editingId || !isNewRow) return;

    const supabase = createClient();
    await supabase
      .from('weekly_templates')
      .delete()
      .eq('id', editingId);

    setTemplates(templates.filter(t => t.id !== editingId));
    setEditingId(null);
    setIsNewRow(false);
  };

  const handleDone = () => {
    setEditingId(null);
    setIsNewRow(false);
  };

  const handleUpdateField = async (id: string, field: string, value: string | null) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('weekly_templates')
      .update({ [field]: value })
      .eq('id', id);

    if (error) {
      console.error('Error updating template:', error);
      return;
    }

    // Refetch to get updated relations
    fetchTemplates();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template row?')) return;

    const supabase = createClient();
    const { error } = await supabase
      .from('weekly_templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting template:', error);
      return;
    }

    setTemplates(templates.filter(t => t.id !== id));
  };

  const toggleDispatchSort = () => {
    setDispatchSort(prev => {
      if (prev === null) return 'asc';
      if (prev === 'asc') return 'desc';
      return null;
    });
  };

  const sortedTemplates = [...templates].sort((a, b) => {
    // Keep the currently editing row at the top
    if (editingId) {
      if (a.id === editingId) return -1;
      if (b.id === editingId) return 1;
    }

    if (dispatchSort === null) return 0;

    const timeA = a.dispatch_time || '';
    const timeB = b.dispatch_time || '';

    if (dispatchSort === 'asc') {
      return timeA.localeCompare(timeB);
    } else {
      return timeB.localeCompare(timeA);
    }
  });

  return (
    <div>
      <PageHeader
        title="Weekly Templates"
        description="Configure default route assignments for each weekday"
        actions={
          <button
            onClick={handleAddRoute}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Add Route
          </button>
        }
      />

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {DAYS.map((day) => (
              <button
                key={day.value}
                onClick={() => setSelectedDay(day.value)}
                className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                  selectedDay === day.value
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {day.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                onClick={toggleDispatchSort}
              >
                <div className="flex items-center gap-1">
                  <span>Dispatch</span>
                  {dispatchSort === 'asc' && (
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                  {dispatchSort === 'desc' && (
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                  {dispatchSort === null && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  )}
                </div>
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
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : templates.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No templates configured for {DAYS.find(d => d.value === selectedDay)?.label}.
                  <br />
                  <span className="text-sm">Click &quot;Add Route&quot; to create one.</span>
                </td>
              </tr>
            ) : (
              sortedTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-gray-50">
                  {editingId === template.id ? (
                    <>
                      <td className="px-4 py-2">
                        <DropdownSelector
                          table="routes"
                          value={template.route_id}
                          onChange={(val) => handleUpdateField(template.id, 'route_id', val)}
                          placeholder="Select route"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <DropdownSelector
                          table="drivers"
                          value={template.driver_id}
                          onChange={(val) => handleUpdateField(template.id, 'driver_id', val)}
                          placeholder="Select driver"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <DropdownSelector
                          table="trucks"
                          value={template.truck_id}
                          onChange={(val) => handleUpdateField(template.id, 'truck_id', val)}
                          placeholder="Select truck"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <DropdownSelector
                          table="trailers"
                          value={template.trailer_id}
                          onChange={(val) => handleUpdateField(template.id, 'trailer_id', val)}
                          placeholder="Select trailer"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <TimeInput
                          value={template.dispatch_time}
                          onChange={(val) => handleUpdateField(template.id, 'dispatch_time', val)}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          defaultValue={template.backhaul || ''}
                          onBlur={(e) => handleUpdateField(template.id, 'backhaul', e.target.value || null)}
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
                        {template.route?.code || '—'}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {template.driver?.name || '—'}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {template.truck?.number || '—'}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {template.trailer?.number || '—'}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {formatDispatchTime(template.dispatch_time)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {template.backhaul || '—'}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setEditingId(template.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(template.id)}
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
