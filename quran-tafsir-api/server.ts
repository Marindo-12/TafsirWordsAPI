const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/api/words', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const offset = (page - 1) * limit;

        const dataQuery = 'SELECT * FROM words ORDER BY id ASC LIMIT $1 OFFSET $2';
        const { rows } = await pool.query(dataQuery, [limit, offset]);

        const countQuery = 'SELECT COUNT(*) FROM words';
        const countResult = await pool.query(countQuery);
        const total = parseInt(countResult.rows[0].count);

        res.json({
            page,
            limit,
            total,
            total_pages: Math.ceil(total / limit),
            data: rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.get('/api/words/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: "Veuillez fournir un terme de recherche avec ?q=..." });
        }

        const searchQuery = `
            SELECT * FROM words 
            WHERE word ILIKE $1 OR tafsir ILIKE $1 
            ORDER BY id ASC
        `;
        const { rows } = await pool.query(searchQuery, [`%${query}%`]);

        res.json({
            total_found: rows.length,
            data: rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.get('/api/words/surah/:surah_number', async (req, res) => {
    try {
        const surah_number = parseInt(req.params.surah_number);
        
        const surahQuery = 'SELECT * FROM words WHERE surah_number = $1 ORDER BY id ASC';
        const { rows } = await pool.query(surahQuery, [surah_number]);

        res.json({
            surah_number,
            total_words: rows.length,
            data: rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.listen(PORT, () => {
    console.log(`API démarrée sur http://localhost:${PORT}`);
});