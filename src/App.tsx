import { useEffect, useMemo } from 'react';

import { SystemOverview } from './components/dashboard/SystemOverview';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProcessTable } from './components/processes/ProcessTable';
import { useSystemMetrics } from './hooks/useSystemMetrics';
import { useSystemStore } from './stores/systemStore';
import type { SystemMetrics } from './types/system';

const navItems = ['Dashboard', 'Performance', 'Processes'];

function App() {
  const { isMonitoring, status, error, retry } = useSystemMetrics();
  const { cpu, memory, gpu, disks, networks, processes } = useSystemStore();

  useEffect(() => {
    console.info('[Frontend] Dashboard rendered');
  }, []);

  const snapshot = useMemo<SystemMetrics | null>(() => {
    if (!cpu && !memory && !gpu && processes.length === 0) {
      return null;
    }

    return {
      cpu,
      memory,
      gpu,
      disks,
      networks,
      processes,
      timestamp: Date.now(),
    };
  }, [cpu, memory, gpu, disks, networks, processes]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1800px] border-r border-slate-800 bg-slate-950/95">
        <aside className="w-64 border-r border-slate-800 bg-slate-950/80 p-4">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-sm font-semibold text-emerald-300">
              P
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-100">PulseCore</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Phase 1</div>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <button
                key={item}
                type="button"
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                  index === 0
                    ? 'bg-slate-800 text-slate-100 shadow-inner shadow-slate-900'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`}
              >
                <span>{item}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{index + 1}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Status</div>
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-200">
              <span className={`h-2.5 w-2.5 rounded-full ${isMonitoring ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              {isMonitoring ? 'Monitoring live' : 'Waiting for data'}
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-hidden p-6">
          <header className="mb-6 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">System overview</div>
              <h1 className="mt-1 text-2xl font-semibold text-slate-100">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-slate-700 px-2.5 py-1">Windows</span>
              <span className="rounded-full border border-slate-700 px-2.5 py-1">Live updates</span>
            </div>
          </header>

          {status === 'error' && (
            <div role="alert" className="mb-6 rounded-lg border border-rose-800 bg-rose-950/40 p-4 text-sm text-rose-100">
              <div className="font-semibold">Unable to retrieve system metrics</div>
              <p className="mt-2 break-words text-rose-200">{error}</p>
              <button
                type="button"
                onClick={retry}
                className="mt-3 rounded-md bg-rose-200 px-3 py-2 font-medium text-rose-950 hover:bg-white"
              >
                Retry
              </button>
            </div>
          )}
          <SystemOverview snapshot={snapshot} loading={status === 'loading' && !snapshot} />
          <div className="mt-6">
            <ProcessTable processes={processes} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

export function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
