# NexusCode - Collaborative Coding Platform

A powerful real-time collaborative coding environment that enables seamless code sharing and editing. Join virtual coding rooms, share code in real-time, and collaborate with developers worldwide.

## 🚀 Key Features

- **Real-time Collaboration**: Code together with multiple users in real-time
- **File Management**: Create, edit, and organize files and folders
- **Code Execution**: Run code directly within the platform
- **Language Support**: Syntax highlighting for multiple programming languages
- **Instant Sync**: Real-time code synchronization across all users
- **User Presence**: See who's online and who's editing what
- **Chat System**: Built-in chat for team communication
- **Drawing Tools**: Collaborative whiteboard for sketching and diagramming
- **AI Assistant**: AI-powered code suggestions and completions
- **Customization**: Adjust font size, family, and themes

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Real-time**: Socket.io
- **Deployment**: Docker, Vercel

## 📋 Installation Guide

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ravirraj/code-nexus.git
   ```

2. **Environment Setup**
   Create `.env` files in both client and server directories:

   Client:
   ```
   VITE_BACKEND_URL=<your_server_url>
   ```

   Server:
   ```
   PORT=3000
   ```

3. **Install Dependencies**
   ```bash
   # In client directory
   cd client
   npm install

   # In server directory
   cd server
   npm install
   ```

4. **Start the Application**
   ```bash
   # Start client
   cd client
   npm run dev

   # Start server
   cd server
   npm run dev
   ```

5. **Access the Application**
   Open your browser and navigate to `http://localhost:5173`

### Docker Setup

1. **Install Docker**
   Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the Application**
   Open your browser and navigate to `http://localhost:5173`

## 🔮 Roadmap

- User authentication and authorization
- Project templates
- Code snippet sharing
- Extension marketplace
- Performance optimizations


## 🙏 Acknowledgments

- [Piston API](https://github.com/engineer-man/piston) for code execution
- [Tldraw](https://github.com/tldraw/tldraw) for collaborative drawing
- [Pollinations AI](https://github.com/pollinations/pollinations) for AI features
