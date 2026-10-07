import { useMemo, useState } from 'react';

import type { ProcessInfo } from '../../types/system';

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

export function ProcessTable({ processes }: { processes: ProcessInfo[] }) {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'cpu' | 'memory'>('cpu');

  const visibleProcesses = useMemo(() => {
    const filtered = processes.filter((process) =>
      process.name.toLowerCase().includes(query.toLowerCase()) || String(process.pid).includes(query),
    );

    return filtered.sort((left, right) => {
      if (sortBy === 'memory') {
        return right.memoryBytes - left.memoryBytes;
      }
      return right.cpuPercent - left.cpuPercent;
    });
  }, [processes, query, sortBy]);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Processes</div>
          <div className="mt-1 text-xl font-semibold text-slate-100">Running processes</div>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search process"
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500"
          />
          <button
            type="button"
            onClick={() => setSortBy('cpu')}
            className={`rounded-lg px-3 py-2 text-xs uppercase tracking-[0.12em] ${sortBy === 'cpu' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
          >
            Sort CPU
          </button>
          <button
            type="button"
            onClick={() => setSortBy('memory')}
            className={`rounded-lg px-3 py-2 text-xs uppercase tracking-[0.12em] ${sortBy === 'memory' ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
          >
            Sort RAM
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-800">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">PID</th>
                <th className="px-4 py-3 font-medium">CPU</th>
                <th className="px-4 py-3 font-medium">Memory</th>
                <th className="px-4 py-3 font-medium">GPU</th>
                <th className="px-4 py-3 font-medium">Disk</th>
              </tr>
            </thead>
            <tbody>
              {visibleProcesses.length > 0 ? (
                visibleProcesses.map((process) => (
                  <tr key={process.pid} className="border-t border-slate-800 bg-slate-950/60 text-slate-200">
                    <td className="px-4 py-3">{process.name}</td>
                    <td className="px-4 py-3">{process.pid}</td>
                    <td className="px-4 py-3">{process.cpuPercent.toFixed(1)}%</td>
                    <td className="px-4 py-3">{formatBytes(process.memoryBytes)}</td>
                    <td className="px-4 py-3">{process.gpuPercent != null ? `${process.gpuPercent.toFixed(1)}%` : 'N/A'}</td>
                    <td className="px-4 py-3">{formatBytes(process.diskReadBytesPerSecond + process.diskWriteBytesPerSecond)}/s</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                    No processes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
