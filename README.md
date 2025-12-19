# Horizon Pro - Brawl Stars Analytics

A futuristic, high-performance dashboard for Brawl Stars club management. Features real-time API synchronization, goal tracking, and deep statistical analysis.

## 🚀 Features

- **Real-time Synchronization**: Direct connection to Brawl Stars API.
- **Admin Dashboard**: Manage member goals, kick simulations, and diagnostics.
- **Glassmorphism UI**: Modern, responsive design with Framer Motion animations.
- **Goal Tracking**: Set and track trophy goals for individual members (persisted locally).
- **IP Diagnostic**: Built-in tool to identify server IP for API whitelisting.

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/horizon-pro.git
   cd horizon-pro
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   Create a `.env` file in the root directory:
   ```env
   BRAWL_API_KEY=your_supercell_api_key_here
   CLUB_TAG=%23JJY0QU0P
   PORT=3000
   ```
   *Note: If you don't create a .env, the app will use the fallback key in `server.js`.*

4. **Build the Frontend**
   ```bash
   npm run build
   ```

5. **Start the Server**
   ```bash
   npm start
   ```
   Access the app at `http://localhost:3000`.

## 👨‍💻 Development

To run the frontend and backend concurrently in development mode:

1. Start the backend:
   ```bash
   node server.js
   ```
2. In a new terminal, start the frontend (Vite):
   ```bash
   npm run dev
   ```

## ⚠️ Important: Brawl Stars API Access

The Brawl Stars API requires you to whitelist your server's IP address.
1. Run the app and go to **Admin > Diagnostic**.
2. Copy the **Server IP**.
3. Go to [Brawl Stars Developer Portal](https://developer.brawlstars.com/).
4. Edit your key and add that IP to the "Allowed IP Addresses" list.