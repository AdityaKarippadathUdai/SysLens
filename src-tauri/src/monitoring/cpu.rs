use sysinfo::System;

use crate::models::system::CpuMetrics;

pub fn collect_cpu(system: &System) -> CpuMetrics {
    let cpus = system.cpus();
    let utilization = system.global_cpu_usage();
    let per_core = cpus.iter().map(|cpu| cpu.cpu_usage() as f64).collect();

    let logical_processors = cpus.len() as u32;
    let cores = System::physical_core_count()
        .unwrap_or(logical_processors.max(1) as usize)
        .max(1) as u32;
    let current_frequency = system.cpus().first().map(|cpu| cpu.frequency() as f64);
    let name = system
        .cpus()
        .first()
        .map(|cpu| cpu.brand().trim().to_string())
        .unwrap_or_else(|| "Unknown CPU".to_string());

    CpuMetrics {
        name,
        utilization: utilization as f64,
        per_core,
        cores,
        logical_processors,
        current_frequency_mhz: current_frequency,
        uptime_seconds: System::uptime(),
    }
}
