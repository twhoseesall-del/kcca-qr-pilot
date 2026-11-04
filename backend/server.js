require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection (using environment variables)
const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false } // For managed DBs
});

// --- PUBLIC ROUTE: The QR Code Scanner Endpoint ---
app.get('/api/scan/:qrId', async (req, res) => {
    try {
        const { qrId } = req.params;
        
        const result = await pool.query(
            "SELECT name, heritage_text, ST_AsGeoJSON(location) as geom FROM landmarks WHERE qr_shortlink = $1 AND status = 'PUBLISHED'",
            [qrId]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: "Landmark not found or not yet approved." });

        const landmark = result.rows[0];
        const coords = JSON.parse(landmark.geom).coordinates;

        // MOCK KCCA GIS INTEGRATION
        const kccaGisData = { zone_type: "Commercial", road_reserve: "10m", plot_number: "Plot 42" }; 

        res.json({
            name: landmark.name,
            heritage: landmark.heritage_text,
            location: { lat: coords[1], lng: coords[0] },
            kcca_zoning: kccaGisData
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Health check endpoint for Coolify
app.get('/health', (req, res) => res.status(200).send('OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`KCCA QR Backend running on port ${PORT}`));
