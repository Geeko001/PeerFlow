# Next.js WebRTC Video Call App

A premium, high-performance video calling application built with Next.js, WebRTC, and Tailwind CSS. Features a glassmorphism UI, real-time peer-to-peer video/audio, and end-to-end encrypted signaling.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌟 Features

-   **Peer-to-Peer Calls**: Built on WebRTC for ultra-low latency.
-   **No Sign-ups**: Generate a room, share the link, and join instantly.
-   **Premium UI**: Glassmorphism design with dark mode and smooth micro-animations.
-   **Real-time Chat**: Integrated text chat during calls.
-   **Device Management**: Select input/output devices (Camera/Mic) on the fly.
-   **Secure Signaling**: custom WebSocket signaling server.

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/video-call-next.git
    cd video-call-next
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🛠️ Tech Stack

-   **Framework**: Next.js 14+ (App Router)
-   **Styling**: Tailwind CSS, CSS Modules
-   **Real-time**: WebRTC, WebSocket (ws)
-   **State Management**: React Hooks

## 📝 Usage

1.  Click **"Create a Meeting"** on the home page.
2.  Enter a meeting name (optional) and click Create.
3.  Copy the URL from your browser's address bar.
4.  Share the link with a friend or open it in a new window/device to join.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
