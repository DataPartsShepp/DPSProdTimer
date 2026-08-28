# DPS Focus Timer

A cross-platform productivity timer for Data Parts Shepperton, built with Electron.

## Features

- Focus and break timer presets
- Start, pause, and reset controls
- Wall-clock accurate countdown that remains reliable when the app is backgrounded
- Custom task description
- Built-in chime, pulse, and bell sounds
- Select a custom audio file from your computer
- Bring the app window to the front when a session ends
- Flash and shake the timer window on completion
- Responsive interface with Data Parts Shepperton branding

## Requirements

- Node.js 18 or newer
- npm

## Run Locally

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm start
```

The development command is also available:

```bash
npm run dev
```

## Build for Windows

Create both a Windows installer and a portable executable:

```bash
npm run build:win
```

Build artifacts are written to `dist/`:

- `DPS Focus Timer Setup 1.0.0.exe` - installable Windows version
- `DPS Focus Timer 1.0.0.exe` - portable Windows version

The installer creates optional Desktop and Start Menu shortcuts and allows the user to choose the installation directory.

## Project Structure

```text
main.js              Electron main process and native window behavior
preload.js           Secure bridge between Electron and the renderer
src/index.html       Timer interface
src/renderer.js      Timer state, controls, sounds, and completion handling
src/style.css        Application styling
img/                 Data Parts Shepperton logo assets
```

## Timer Completion

When the countdown reaches zero, the app plays the selected sound. If enabled, it brings the window forward, flashes the taskbar icon, and shakes the timer card. The `Bring window forward` and `Shake on completion` options can be controlled independently in the interface.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
