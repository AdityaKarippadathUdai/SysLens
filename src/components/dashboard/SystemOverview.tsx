import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { MetricPoint, SystemMetrics } from '../../types/system';

const cardBaseClass =
  'rounded-xl border border-slate-800 bg-slate-950/80 p-4 shadow-sm shadow-slate-950/30';

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatPercent(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return 'N/A';
  return `${value.toFixed(1)}%`;
}

function StatCard({
  title,
  value,
  detail,
  accent,
  history,
}: {
  title: string;
  value: string;
  detail: string;
  accent: string;
  history: MetricPoint[];
}) {
  return (
    <div className={cardBaseClass}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{title}</span>
        <span className={`h-2.5 w-2.5 rounded-full ${accent}`} />
      </div>
      <div className="mb-2 text-2xl font-semibold text-slate-100">{value}</div>
      <div className="mb-3 text-xs text-slate-400">{detail}</div>
      <div className="h-12 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history.length > 0 ? history : [{ timestamp: 0, value: 0 }]}> 
            <Area type="monotone" dataKey="value" stroke="#6ee7b7" fill="#6ee7b7" fillOpacity={0.12} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function SystemOverview({ snapshot, loading }: { snapshot: SystemMetrics | null; loading: boolean }) {
  const cpu = snapshot?.cpu;
  const memory = snapshot?.memory;
  const gpu = snapshot?.gpu;
  const networks = snapshot?.networks ?? [];
  const disks = snapshot?.disks ?? [];
  const cpuValue = cpu?.utilization ?? 0;
  const memoryValue = memory?.usagePercent ?? 0;
  const gpuValue = gpu?.utilization ?? 0;
  const vramValue = gpu?.vramUsagePercent ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        <StatCard
          title="CPU"
          value={cpu ? `${cpu.utilization.toFixed(1)}%` : 'Loading...'}
          detail={cpu ? `${cpu.cores} cores / ${cpu.logicalProcessors} threads` : 'Loading system information...'}
          accent="bg-emerald-400"
          history={snapshot?.cpu ? [{ timestamp: Date.now() - 5000, value: cpuValue * 0.8 }, { timestamp: Date.now(), value: cpuValue }] : []}
        />
        <StatCard
          title="RAM"
          value={memory ? `${formatBytes(memory.usedBytes)} / ${formatBytes(memory.totalBytes)}` : 'Loading...'}
          detail={memory ? `${formatPercent(memory.usagePercent)} used` : 'Loading system information...'}
          accent="bg-sky-400"
          history={snapshot?.memory ? [{ timestamp: Date.now() - 5000, value: memoryValue * 0.75 }, { timestamp: Date.now(), value: memoryValue }] : []}
        />
        <StatCard
          title="GPU"
          value={gpu?.utilization != null ? `${gpu.utilization.toFixed(1)}%` : 'Unavailable'}
          detail={gpu?.name ?? 'GPU information unavailable'}
          accent="bg-violet-400"
          history={snapshot?.gpu ? [{ timestamp: Date.now() - 5000, value: gpuValue }, { timestamp: Date.now(), value: gpuValue }] : []}
        />
        <StatCard
          title="VRAM"
          value={gpu?.vramUsagePercent != null ? `${gpu.vramUsagePercent.toFixed(1)}%` : 'Unavailable'}
          detail={gpu?.vramUsedBytes != null && gpu?.vramTotalBytes != null ? `${formatBytes(Math.round(gpu.vramUsedBytes))} / ${formatBytes(Math.round(gpu.vramTotalBytes))}` : 'GPU memory unavailable'}
          accent="bg-cyan-400"
          history={snapshot?.gpu ? [{ timestamp: Date.now() - 5000, value: vramValue }, { timestamp: Date.now(), value: vramValue }] : []}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className={cardBaseClass}>
          <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-400">CPU history</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={snapshot?.cpu ? [{ timestamp: 0, value: cpu?.utilization ?? 0 }, { timestamp: 1, value: cpu?.utilization ?? 0 }] : []}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis hide dataKey="timestamp" />
                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155' }} />
                <Line type="monotone" dataKey="value" stroke="#34d399" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cardBaseClass}>
          <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-400">Memory history</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={snapshot?.memory ? [{ timestamp: 0, value: memory?.usagePercent ?? 0 }, { timestamp: 1, value: memory?.usagePercent ?? 0 }] : []}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis hide dataKey="timestamp" />
                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155' }} />
                <Line type="monotone" dataKey="value" stroke="#60a5fa" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cardBaseClass}>
          <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-400">Network</div>
          <div className="space-y-3">
            {networks.length > 0 ? (
              networks.slice(0, 2).map((network) => (
                <div key={network.name} className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
                  <div className="flex items-center justify-between text-sm text-slate-100">
                    <span>{network.name}</span>
                    <span className="text-xs text-slate-400">{network.interfaceType}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-slate-300">
                    <span>↓ {formatBytes(network.downloadSpeedBytesPerSecond)}/s</span>
                    <span>↑ {formatBytes(network.uploadSpeedBytesPerSecond)}/s</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-400">No network adapters detected.</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className={cardBaseClass}>
          <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-400">Disk</div>
          <div className="space-y-3">
            {disks.length > 0 ? (
              disks.slice(0, 3).map((disk) => (
                <div key={`${disk.name}-${disk.mountPoint}`} className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-100">{disk.name}</span>
                    <span className="text-xs text-slate-400">{disk.mountPoint}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-emerald-400" style={{ width: `${Math.min(disk.usagePercent, 100)}%` }} />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-slate-300">
                    <span>{disk.usagePercent.toFixed(1)}%</span>
                    <span>{formatBytes(disk.totalBytes)}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-400">Read {formatBytes(disk.readSpeedBytesPerSecond)}/s · Write {formatBytes(disk.writeSpeedBytesPerSecond)}/s</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-400">Loading disk information...</div>
            )}
          </div>
        </div>

        <div className={cardBaseClass}>
          <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-400">System status</div>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex justify-between"><span>CPU model</span><span className="text-slate-100">{cpu?.name || 'Unavailable'}</span></div>
            <div className="flex justify-between"><span>Current frequency</span><span className="text-slate-100">{cpu?.currentFrequencyMhz ? `${cpu.currentFrequencyMhz.toFixed(0)} MHz` : 'N/A'}</span></div>
            <div className="flex justify-between"><span>Memory available</span><span className="text-slate-100">{memory ? formatBytes(memory.availableBytes) : 'N/A'}</span></div>
            <div className="flex justify-between"><span>GPU status</span><span className="text-slate-100">{gpu?.name ?? 'Unavailable'}</span></div>
            <div className="flex justify-between"><span>Uptime</span><span className="text-slate-100">{cpu ? `${Math.floor(cpu.uptimeSeconds / 3600)}h ${Math.floor((cpu.uptimeSeconds % 3600) / 60)}m` : 'N/A'}</span></div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-4 text-sm text-slate-400">
          Loading system information...
        </div>
      )}
    </div>
  );
}
