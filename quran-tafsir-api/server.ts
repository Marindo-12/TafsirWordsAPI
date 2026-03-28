import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '.env') });
import express, { Request, Response } from 'express';
import cors from 'cors';
import pool from './db';

const app: express.Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/favicon.ico', (req: Request, res: Response) => res.status(204).end());

app.get('/api/words', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
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
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.get('/api/words/search', async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
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
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.get('/api/words/surah/:surah_number', async (req: Request, res: Response) => {
    try {
        const surah_number = parseInt(req.params.surah_number as string);
        
        const surahQuery = 'SELECT * FROM words WHERE surah_number = $1 ORDER BY id ASC';
        const { rows } = await pool.query(surahQuery, [surah_number]);

        res.json({
            surah_number,
            total_words: rows.length,
            data: rows
        });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.listen(PORT, () => {
    console.log(`API démarrée sur http://localhost:${PORT}`);
});