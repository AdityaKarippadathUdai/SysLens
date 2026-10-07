use tauri::command;

use crate::models::system::{ProcessInfo, SystemMetrics};
use crate::monitoring::{collect_system_snapshot, processes::collect_processes};

#[command]
pub fn get_system_metrics() -> Result<SystemMetrics, String> {
    Ok(collect_system_snapshot())
}

#[command]
pub fn get_processes() -> Result<Vec<ProcessInfo>, String> {
    let system = sysinfo::System::new_all();
    Ok(collect_processes(&system))
}
