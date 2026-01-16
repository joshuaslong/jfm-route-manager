'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface UseRealtimeSubscriptionOptions {
  table: string;
  filter?: string;
  onInsert?: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void;
  onUpdate?: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void;
  onDelete?: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void;
  onChange?: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void;
}

export function useRealtimeSubscription({
  table,
  filter,
  onInsert,
  onUpdate,
  onDelete,
  onChange,
}: UseRealtimeSubscriptionOptions) {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`${table}-changes`)
      .on<Record<string, unknown>>(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          if (onChange) {
            onChange(payload);
          }

          switch (payload.eventType) {
            case 'INSERT':
              onInsert?.(payload);
              break;
            case 'UPDATE':
              onUpdate?.(payload);
              break;
            case 'DELETE':
              onDelete?.(payload);
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter, onInsert, onUpdate, onDelete, onChange]);
}
