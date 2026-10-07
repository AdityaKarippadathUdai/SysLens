export interface MetricPoint {
  timestamp: number;
  value: number;
}

export interface CpuMetrics {
  name: string;
  utilization: number;
  perCore: number[];
  cores: number;
  logicalProcessors: number;
  currentFrequencyMhz: number | null;
  uptimeSeconds: number;
}

export interface MemoryMetrics {
  totalBytes: number;
  usedBytes: number;
  availableBytes: number;
  freeBytes: number;
  usagePercent: number;
  swapTotalBytes: number;
  swapUsedBytes: number;
}

export interface GpuMetrics {
  name: string | null;
  utilization: number | null;
  temperature: number | null;
  coreClockMhz: number | null;
  powerUsageWatts: number | null;
  fanSpeedPercent: number | null;
  vramTotalBytes: number | null;
  vramUsedBytes: number | null;
  vramAvailableBytes: number | null;
  vramUsagePercent: number | null;
}

export interface DiskMetrics {
  name: string;
  mountPoint: string;
  totalBytes: number;
  usedBytes: number;
  freeBytes: number;
  usagePercent: number;
  readSpeedBytesPerSecond: number;
  writeSpeedBytesPerSecond: number;
}

export interface NetworkMetrics {
  name: string;
  interfaceType: string;
  downloadSpeedBytesPerSecond: number;
  uploadSpeedBytesPerSecond: number;
  totalReceivedBytes: number;
  totalTransmittedBytes: number;
}

export interface ProcessInfo {
  name: string;
  pid: number;
  cpuPercent: number;
  memoryBytes: number;
  gpuPercent: number | null;
  diskReadBytesPerSecond: number;
  diskWriteBytesPerSecond: number;
}

export interface SystemMetrics {
  cpu: CpuMetrics | null;
  memory: MemoryMetrics | null;
  gpu: GpuMetrics | null;
  disks: DiskMetrics[];
  networks: NetworkMetrics[];
  processes: ProcessInfo[];
  timestamp: number;
}
