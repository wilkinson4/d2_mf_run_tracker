use std::sync::Mutex;
use tauri_plugin_sql::{Migration, MigrationKind};

struct AppState {
    d2_game_running: Mutex<bool>,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![Migration {
        version: 1,
        description: "create initial tables",
        sql: include_str!("../migrations/init.sql"),
        kind: MigrationKind::Up,
    }];
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:run_tracker.db", migrations)
                .build(),
        )
        .manage(AppState {
            d2_game_running: Mutex::new(false),
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
