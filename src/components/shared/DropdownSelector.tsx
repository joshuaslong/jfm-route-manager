'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type TableName = 'drivers' | 'trucks' | 'trailers' | 'routes' | 'loaders';

interface DropdownSelectorProps {
  table: TableName;
  value: string | null;
  onChange: (id: string | null) => void;
  placeholder?: string;
  filter?: Record<string, string>;
  displayField?: string;
  className?: string;
  disabled?: boolean;
}

interface Option {
  id: string;
  label: string;
}

interface QueryResult {
  id: string;
  [key: string]: string;
}

const tableConfig: Record<TableName, { displayField: string; orderBy: string }> = {
  drivers: { displayField: 'name', orderBy: 'name' },
  trucks: { displayField: 'number', orderBy: 'number' },
  trailers: { displayField: 'number', orderBy: 'number' },
  routes: { displayField: 'code', orderBy: 'code' },
  loaders: { displayField: 'name', orderBy: 'name' },
};

export function DropdownSelector({
  table,
  value,
  onChange,
  placeholder = 'Select...',
  filter,
  displayField,
  className = '',
  disabled = false,
}: DropdownSelectorProps) {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOptions() {
      const supabase = createClient();
      const config = tableConfig[table];
      const field = displayField || config.displayField;

      let query = supabase
        .from(table)
        .select(`id, ${field}`)
        .eq('status', 'active')
        .order(config.orderBy);

      if (filter) {
        Object.entries(filter).forEach(([key, val]) => {
          query = query.eq(key, val);
        });
      }

      const { data, error } = await query;

      if (error) {
        console.error(`Error fetching ${table}:`, error);
        return;
      }

      setOptions(
        ((data as QueryResult[] | null) || []).map((item) => ({
          id: item.id,
          label: item[field] || '',
        }))
      );
      setLoading(false);
    }

    fetchOptions();
  }, [table, filter, displayField]);

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
      disabled={disabled || loading}
      className={`block w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
    >
      <option value="">{loading ? 'Loading...' : placeholder}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
