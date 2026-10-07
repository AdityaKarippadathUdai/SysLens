import { create } from 'zustand';

import type { MetricPoint, SystemMetrics } from '../types/system';

const MAX_HISTORY = 60;

interface SystemState {
  cpu: SystemMetrics['cpu'];
  memory: SystemMetrics['memory'];
  gpu: SystemMetrics['gpu'];
  disks: DiskMetrics[];
  networks: NetworkMetrics[];
  processes: ProcessInfo[];
  cpuHistory: MetricPoint[];
  memoryHistory: MetricPoint[];
  gpuHistory: MetricPoint[];
  vramHistory: MetricPoint[];
  isMonitoring: boolean;
  setMonitoring: (value: boolean) => void;
  updateFromSnapshot: (snapshot: SystemMetrics | null) => void;
  clear: () => void;
}

type DiskMetrics = SystemMetrics['disks'][number];
type NetworkMetrics = SystemMetrics['networks'][number];
type ProcessInfo = SystemMetrics['processes'][number];

function pushHistory(history: MetricPoint[], value: number): MetricPoint[] {
  const next = [...history, { timestamp: Date.now(), value }];
  return next.slice(-MAX_HISTORY);
}

export const useSystemStore = create<SystemState>((set) => ({
  cpu: null,
  memory: null,
  gpu: null,
  disks: [],
  networks: [],
  processes: [],
  cpuHistory: [],
  memoryHistory: [],
  gpuHistory: [],
  vramHistory: [],
  isMonitoring: false,
  setMonitoring: (value: boolean) => set({ isMonitoring: value }),
  updateFromSnapshot: (snapshot: SystemMetrics | null) =>
    set((state) => {
      if (!snapshot) {
        return state;
      }

      const cpuHistory = pushHistory(state.cpuHistory, snapshot.cpu?.utilization ?? 0);
      const memoryHistory = pushHistory(state.memoryHistory, snapshot.memory?.usagePercent ?? 0);
      const gpuUtilization = snapshot.gpu?.utilization ?? 0;
      const gpuHistory = pushHistory(state.gpuHistory, gpuUtilization);
      const vramUsage = snapshot.gpu?.vramUsagePercent ?? snapshot.memory?.usagePercent ?? 0;
      const vramHistory = pushHistory(state.vramHistory, vramUsage);

      return {
        cpu: snapshot.cpu,
        memory: snapshot.memory,
        gpu: snapshot.gpu,
        disks: snapshot.disks,
        networks: snapshot.networks,
        processes: snapshot.processes,
        cpuHistory,
        memoryHistory,
        gpuHistory,
        vramHistory,
      };
    }),
  clear: () =>
    set({
      cpu: null,
      memory: null,
      gpu: null,
      disks: [],
      networks: [],
      processes: [],
      cpuHistory: [],
      memoryHistory: [],
      gpuHistory: [],
      vramHistory: [],
      isMonitoring: false,
    }),
}));
