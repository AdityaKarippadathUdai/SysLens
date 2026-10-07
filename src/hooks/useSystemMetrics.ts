import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

import { useSystemStore } from '../stores/systemStore';
import type { SystemMetrics } from '../types/system';

export function useSystemMetrics() {
  const { isMonitoring, setMonitoring, updateFromSnapshot } = useSystemStore();

  useEffect(() => {
    let mounted = true;
    const poll = async () => {
      try {
        const snapshot = await invoke<SystemMetrics>('get_system_metrics');
        if (mounted) {
          updateFromSnapshot(snapshot);
        }
      } catch (error) {
        console.error('Unable to load system metrics:', error);
      }
    };

    setMonitoring(true);
    void poll();
    const interval = window.setInterval(() => {
      void poll();
    }, 1000);

    return () => {
      mounted = false;
      setMonitoring(false);
      window.clearInterval(interval);
    };
  }, [setMonitoring, updateFromSnapshot]);

  return { isMonitoring };
}
