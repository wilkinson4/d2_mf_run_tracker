<div align="center">
  <img src="src-tauri/icons/icon.png" alt="Logo" width="200" />
  <h1>D2 MF Tracker</h1>
  <p>A simple desktop app for tracking Diablo 2 magic find sessions, runs, and timing.</p>
</div>

----

<div>
  <img src="home_screen.png" alt="Logo" width="1200" />
</div>

## What it does

- Track full farming sessions
- Start and stop individual runs with a timer
- See run count, average run time, and session time
- Keep a session history for later review

## Hotkeys

**Super key:** Windows/Linux = `Ctrl`, macOS = `Command`

- `Super+Shift+S` -> Start/Stop Run
- `Super+Shift+C` -> Cancel Run
- `Super+Shift+E` -> End Session

On Linux Wayland sessions, desktop-wide shortcuts may be unavailable depending on compositor support. The app will still launch and work without them.

## Coming later

- Auto-tracking for offline mode
- In-game overlay

## Installation

**Latest release:** [Download the newest version Windows/MacOS](https://github.com/wilkinson4/d2_mf_run_tracker/releases/latest)

### Windows

Download the `windows-x64-setup.exe` file from the latest release and run it.

If Windows shows a SmartScreen warning, click **More info** and then **Run anyway**.

### macOS

Download the `.dmg` that matches your Mac:

- **Apple Silicon (M1, M2, M3, etc.)**: `aarch64.dmg`
- **Intel Mac**: `x64.dmg`

If macOS blocks the app the first time, right-click it and choose **Open**.

### Linux

- **Arch / EndeavourOS / CachyOS / other AUR-based distros:** install from AUR: [`d2-mf-tracker`](https://aur.archlinux.org/packages/d2-mf-tracker)
- **Debian / Ubuntu / Mint / Pop!_OS:** download the `.deb` from the latest release
- **Fedora / Nobara / RHEL-based distros:** download the `.rpm` from the latest release

#### Wayland issues

When running this app on wayland it is recommended to set the following so the app doesn't crash:

(Most users): Copy and run this in your terminal

```bash
echo 'export WEBKIT_DISABLE_DMABUF_RENDERER=1' >> ~/.bashrc && source ~/.bashrc
```

Fish Shell:
```fish
set -Ux WEBKIT_DISABLE_DMABUF_RENDERER 1
```

Zsh:
```bash
echo 'export WEBKIT_DISABLE_DMABUF_RENDERER=1' >> ~/.zshrc && source ~/.zshrc
```
## For developers

```bash
bun run tauri dev
```
