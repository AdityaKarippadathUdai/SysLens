use sysinfo::System;

use crate::models::system::MemoryMetrics;

pub fn collect_memory(system: &System) -> MemoryMetrics {
    let total_bytes = system.total_memory();
    let used_bytes = system.used_memory();
    let available_bytes = system.available_memory();
    let free_bytes = system.free_memory();
    let swap_total_bytes = system.total_swap();
    let swap_used_bytes = system.used_swap();
    let usage_percent = if total_bytes > 0 {
        (used_bytes as f64 / total_bytes as f64) * 100.0
    } else {
        0.0
    };

    MemoryMetrics {
        total_bytes,
        used_bytes,
        available_bytes,
        free_bytes,
        usage_percent,
        swap_total_bytes,
        swap_used_bytes,
    }
}
