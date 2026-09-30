# PulseCore

PulseCore is a Windows desktop system monitoring dashboard built with Tauri, Rust, React, TypeScript, and Vite. Phase 1 focuses on real-time CPU, RAM, GPU, VRAM, disk, network, and process monitoring with a clean dark-mode desktop layout.

## Features

- Real-time CPU and memory telemetry from the Rust backend
- GPU metrics when NVIDIA hardware is available via nvidia-smi
- Disk and network throughput sampling
- Running process list with CPU and memory sorting/search
- Dark desktop UI with responsive resource cards and charts
- Typed Tauri IPC contracts between Rust and the React frontend

## Architecture

- Frontend: React + TypeScript + Vite + Tailwind CSS + Zustand + Recharts
- Desktop shell: Tauri
- Backend: Rust system collectors using sysinfo and Windows-compatible data sources

## Tech stack

- Tauri 2
- Rust
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Zustand
- sysinfo

## Project structure

```text
src/
  components/
    dashboard/
      SystemOverview.tsx
    processes/
      ProcessTable.tsx
  hooks/
    useSystemMetrics.ts
  stores/
    systemStore.ts
  types/
    system.ts
  App.tsx
  index.css
src-tauri/
  src/
    commands/
      system.rs
    monitoring/
      cpu.rs
      disk.rs
      gpu.rs
      memory.rs
      mod.rs
      network.rs
      processes.rs
    models/
      mod.rs
      system.rs
    lib.rs
    main.rs
  Cargo.toml
  tauri.conf.json
```

## Windows prerequisites

- Windows 10 or newer
- Rust + Cargo
- Node.js 20+
- Microsoft C++ Build Tools (if needed for native dependencies)
- NVIDIA GPU driver and nvidia-smi for GPU telemetry when available

## Development setup

```bash
npm install
npm run dev
```

## Running the desktop app

```bash
npm run tauri dev
```

## Production build

```bash
npm run tauri build
```

## GPU monitoring limitations

- GPU metrics are only available when NVIDIA hardware is detected and nvidia-smi is available on the system.
- Unsupported GPU values are reported as unavailable instead of fabricated values.
- Some system configurations may expose only partial GPU data.

## Known limitations

- Process GPU usage is limited to what the operating system exposes; it is unavailable for many systems.
- Disk and network throughput is sampled over a short interval to estimate rates.
- This is Phase 1 and intentionally omits process termination and startup management.

## Future roadmap

### Phase 1
- CPU
- RAM
- GPU
- VRAM
- Disk
- Network
- Processes
- Real-time graphs

### Phase 2
- Process management
- Process details
- End task
- Process tree

### Phase 3
- Startup apps
- Windows services
- System information

### Phase 4
- System tray
- Mini widget
- Alerts
- Notifications
