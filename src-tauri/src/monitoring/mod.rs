use std::time::{SystemTime, UNIX_EPOCH};
use sysinfo::{ProcessesToUpdate, System};

use crate::models::system::SystemMetrics;

pub mod cpu;
pub mod disk;
pub mod gpu;
pub mod memory;
pub mod network;
pub mod processes;

pub fn collect_system_snapshot() -> SystemMetrics {
    let mut system = System::new_all();
    system.refresh_all();
    system.refresh_cpu_all();
    system.refresh_memory();
    system.refresh_processes(ProcessesToUpdate::All, true);

    let cpu = cpu::collect_cpu(&system);
    let memory = memory::collect_memory(&system);
    let gpu = gpu::collect_gpu();
    let disks = disk::collect_disks();
    let networks = network::collect_networks();
    let processes = processes::collect_processes(&system);

    SystemMetrics {
        cpu: Some(cpu),
        memory: Some(memory),
        gpu: gpu,
        disks,
        networks,
        processes,
        timestamp: SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis() as u64,
    }
}
