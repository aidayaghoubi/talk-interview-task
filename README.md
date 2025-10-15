Device Settings Panel (React + TypeScript)

This project is a media device settings panel built with React, TypeScript, Redux Toolkit, and TailwindCSS.
It allows users to manage and test their microphone, speaker, and camera devices.

🚀 Features

🎤 Microphone Input

List available microphones and show real-time sound level meter

Auto-detect device disconnection and update list

🔊 Audio Output

List all audio output devices (Speakers, USB, HDMI)

Play test sound on selected speaker

📷 Video Input

Preview selected camera stream

Detect and handle missing, blocked, or in-use devices

Support multiple cameras and virtual cameras (like OBS)

Allow manual video mute

🧩 Tech Stack

React 18 + TypeScript

Redux Toolkit for state management

TailwindCSS for styling

navigator.mediaDevices.enumerateDevices() for hardware access

Toast notifications for user feedback

📦 Setup
npm install
npm start
