'use client';

import { useState, useEffect } from 'react';
import { formatDispatchTime, parseDispatchTime } from '@/lib/utils/formatters';

interface TimeInputProps {
  value: string | null;
  onChange: (time: string | null) => void;
  className?: string;
  disabled?: boolean;
}

export function TimeInput({
  value,
  onChange,
  className = '',
  disabled = false,
}: TimeInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value) {
      setDisplayValue(formatDispatchTime(value));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleBlur = () => {
    if (!displayValue.trim()) {
      onChange(null);
      return;
    }

    const parsed = parseDispatchTime(displayValue);
    if (parsed) {
      onChange(parsed);
      setDisplayValue(formatDispatchTime(parsed));
    } else {
      // Reset to previous valid value
      setDisplayValue(value ? formatDispatchTime(value) : '');
    }
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={(e) => setDisplayValue(e.target.value)}
      onBlur={handleBlur}
      placeholder="2:30am"
      disabled={disabled}
      className={`block w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
    />
  );
}
