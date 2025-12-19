import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
// You should put this in a .env file: BRAWL_API_KEY=your_key_here
const BRAWL_API_KEY = process.env.BRAWL_API_KEY || "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImFjYzQxOGU2LWM1MzAtNDFmMC04ZjcxLWEwM2Q5OGI3Mzc5YyIsImlhdCI6MTc2NjExOTQwNywic3ViIjoiZGV2ZWxvcGVyLzE5ODI2ODBkLTJhZDQtYWFmYi0yNmUwLTAzNTFkMjkzY2MwMiIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiNzQuMjIwLjQ4LjI0MiJdLCJ0eXBlIjoiY2xpZW50In1dfQ.eLxQne7wExXTWjwbs5tFo7jBmLEB4BSs6oKTK55jmKHIOg2VSd2-YydI0rKWGHVv8NjHT3MqmwdRHuhMFaZrbg";
const CLUB_TAG = process.env.CLUB_TAG || "%23JJY0QU0P"; 
const METAS_FILE = path.join(__dirname, 'metas.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database (JSON file)
if (!fs.existsSync(METAS_FILE)) {
    fs.writeFileSync(METAS_FILE, JSON.stringify({}));
}

// --- API ROUTES ---

// 1. Check Server IP (Crucial for Brawl Stars API whitelisting)
app.get('/api/meu-ip', async (req, res) => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        res.json({ ip: data.ip });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch IP" });
    }
});

// 2. Get Club Stats + Local Goals
app.get('/api/stats', async (req, res) => {
    try {
        const response = await fetch(`https://api.brawlstars.com/v1/clubs/${CLUB_TAG}`, {
            headers: { 'Authorization': `Bearer ${BRAWL_API_KEY}` }
        });
        
        if (response.status === 403) {
            return res.status(403).json({ error: "Access Denied: IP not whitelisted in Developer Portal" });
        }
        
        if (!response.ok) {
            return res.status(response.status).json({ error: "Brawl Stars API Error" });
        }

        const clubData = await response.json();
        
        // Read local goals
        let metas = {};
        try {
            const fileData = fs.readFileSync(METAS_FILE, 'utf8');
            metas = JSON.parse(fileData);
        } catch (err) {
            console.error("Error reading metas file:", err);
        }

        res.json({ club: clubData, metas });
    } catch (e) { 
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" }); 
    }
});

// 3. Get Deep Player Details
app.get('/api/player/:tag', async (req, res) => {
    try {
        const tag = req.params.tag.replace('#', '');
        const response = await fetch(`https://api.brawlstars.com/v1/players/%23${tag}`, {
            headers: { 'Authorization': `Bearer ${BRAWL_API_KEY}` }
        });
        
        if (!response.ok) {
            return res.status(response.status).json({ error: "Player not found or API error" });
        }

        const data = await response.json();
        res.json(data);
    } catch (e) { 
        res.status(500).json({ error: "Server Error fetching player" }); 
    }
});

// 4. Save Player Goals
app.post('/api/save-meta', (req, res) => {
    try {
        const { tag, meta } = req.body;
        if (!tag || meta === undefined) return res.status(400).json({ error: "Invalid data" });

        let metas = {};
        if (fs.existsSync(METAS_FILE)) {
            metas = JSON.parse(fs.readFileSync(METAS_FILE, 'utf8'));
        }
        
        metas[tag] = parseInt(meta);
        fs.writeFileSync(METAS_FILE, JSON.stringify(metas, null, 2));
        
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: "Failed to save meta" });
    }
});

// --- PRODUCTION SERVING ---

// Serve static files from the React build folder (dist)
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React Routing (SPA) - Return index.html for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`
    🚀 Horizon Pro Hub Online
    --------------------------
    ► Server: http://localhost:${PORT}
    ► Environment: ${process.env.NODE_ENV || 'development'}
    `);
});