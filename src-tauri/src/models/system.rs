use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct MetricPoint {
    pub timestamp: u64,
    pub value: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct CpuMetrics {
    pub name: String,
    pub utilization: f64,
    pub per_core: Vec<f64>,
    pub cores: u32,
    pub logical_processors: u32,
    pub current_frequency_mhz: Option<f64>,
    pub uptime_seconds: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct MemoryMetrics {
    pub total_bytes: u64,
    pub used_bytes: u64,
    pub available_bytes: u64,
    pub free_bytes: u64,
    pub usage_percent: f64,
    pub swap_total_bytes: u64,
    pub swap_used_bytes: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct GpuMetrics {
    pub name: Option<String>,
    pub utilization: Option<f64>,
    pub temperature: Option<f64>,
    pub core_clock_mhz: Option<f64>,
    pub power_usage_watts: Option<f64>,
    pub fan_speed_percent: Option<f64>,
    pub vram_total_bytes: Option<f64>,
    pub vram_used_bytes: Option<f64>,
    pub vram_available_bytes: Option<f64>,
    pub vram_usage_percent: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct DiskMetrics {
    pub name: String,
    pub mount_point: String,
    pub total_bytes: u64,
    pub used_bytes: u64,
    pub free_bytes: u64,
    pub usage_percent: f64,
    pub read_speed_bytes_per_second: f64,
    pub write_speed_bytes_per_second: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct NetworkMetrics {
    pub name: String,
    pub interface_type: String,
    pub download_speed_bytes_per_second: f64,
    pub upload_speed_bytes_per_second: f64,
    pub total_received_bytes: u64,
    pub total_transmitted_bytes: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct ProcessInfo {
    pub name: String,
    pub pid: u32,
    pub cpu_percent: f64,
    pub memory_bytes: u64,
    pub gpu_percent: Option<f64>,
    pub disk_read_bytes_per_second: f64,
    pub disk_write_bytes_per_second: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SystemMetrics {
    pub cpu: Option<CpuMetrics>,
    pub memory: Option<MemoryMetrics>,
    pub gpu: Option<GpuMetrics>,
    pub disks: Vec<DiskMetrics>,
    pub networks: Vec<NetworkMetrics>,
    pub processes: Vec<ProcessInfo>,
    pub timestamp: u64,
}
