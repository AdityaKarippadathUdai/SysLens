use std::process::Command;

use crate::models::system::GpuMetrics;

pub fn collect_gpu() -> Option<GpuMetrics> {
    let output = Command::new("nvidia-smi")
        .args([
            "--query-gpu=name,utilization.gpu,temperature.gpu,clocks.current.graphics,power.draw,fan.speed,memory.total,memory.used,memory.free",
            "--format=csv,noheader,nounits",
        ])
        .output()
        .ok()?;

    if !output.status.success() {
        return None;
    }

    let stdout = String::from_utf8(output.stdout).ok()?;
    let values: Vec<&str> = stdout
        .lines()
        .next()
        .unwrap_or_default()
        .split(',')
        .map(str::trim)
        .collect();

    if values.len() < 9 {
        return None;
    }

    let total_mib: f64 = values[6].parse().unwrap_or(0.0);
    let used_mib: f64 = values[7].parse().unwrap_or(0.0);
    let free_mib: f64 = values[8].parse().unwrap_or(0.0);
    let total_bytes = total_mib * 1024.0 * 1024.0;
    let used_bytes = used_mib * 1024.0 * 1024.0;
    let available_bytes = free_mib * 1024.0 * 1024.0;

    Some(GpuMetrics {
        name: Some(values[0].to_string()),
        utilization: values[1].parse::<f64>().ok(),
        temperature: values[2].parse::<f64>().ok(),
        core_clock_mhz: values[3].parse::<f64>().ok(),
        power_usage_watts: values[4].parse::<f64>().ok(),
        fan_speed_percent: values[5].parse::<f64>().ok(),
        vram_total_bytes: Some(total_bytes),
        vram_used_bytes: Some(used_bytes),
        vram_available_bytes: Some(available_bytes),
        vram_usage_percent: if total_bytes > 0.0 {
            Some((used_bytes / total_bytes) * 100.0)
        } else {
            None
        },
    })
}
