use std::collections::HashMap;
use std::sync::{LazyLock, Mutex};
use std::time::Instant;

use sysinfo::Disks;

use crate::models::system::DiskMetrics;

#[derive(Clone)]
struct DiskDelta {
    last_read: u64,
    last_write: u64,
    last_updated: Instant,
}

impl Default for DiskDelta {
    fn default() -> Self {
        Self {
            last_read: 0,
            last_write: 0,
            last_updated: Instant::now(),
        }
    }
}

static DISK_DELTA_STATE: LazyLock<Mutex<HashMap<String, DiskDelta>>> =
    LazyLock::new(|| Mutex::new(HashMap::new()));

pub fn collect_disks() -> Vec<DiskMetrics> {
    let mut disks = Disks::new_with_refreshed_list();
    disks.refresh(true);

    let mut collected = Vec::new();
    let now = Instant::now();
    let mut cache = DISK_DELTA_STATE.lock().unwrap();

    for disk in disks.list() {
        let usage = disk.usage();
        let total_read = usage.total_read_bytes;
        let total_written = usage.total_written_bytes;
        let mount = disk.mount_point().to_string_lossy().to_string();
        let total = disk.total_space();
        let available = disk.available_space();
        let used = total.saturating_sub(available);
        let usage_percent = if total > 0 {
            (used as f64 / total as f64) * 100.0
        } else {
            0.0
        };

        let entry = cache.entry(mount.clone()).or_insert(DiskDelta {
            last_read: total_read,
            last_write: total_written,
            last_updated: now,
        });

        let elapsed = now
            .duration_since(entry.last_updated)
            .as_secs_f64()
            .max(0.2);
        let read_speed = if total_read >= entry.last_read {
            ((total_read - entry.last_read) as f64) / elapsed
        } else {
            0.0
        };
        let write_speed = if total_written >= entry.last_write {
            ((total_written - entry.last_write) as f64) / elapsed
        } else {
            0.0
        };

        entry.last_read = total_read;
        entry.last_write = total_written;
        entry.last_updated = now;

        collected.push(DiskMetrics {
            name: disk.name().to_string_lossy().to_string(),
            mount_point: mount,
            total_bytes: total,
            used_bytes: used,
            free_bytes: available,
            usage_percent,
            read_speed_bytes_per_second: read_speed,
            write_speed_bytes_per_second: write_speed,
        });
    }

    collected
}
