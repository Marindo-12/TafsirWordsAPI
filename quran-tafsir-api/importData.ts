import fs from 'fs';
import pool from './db';

interface TafsirItem {
    page_number: number;
    surah_number: number;
    surah_name: string;
    ayah_number: number;
    word: string;
    tafsir: string;
}

async function importData() {
    try {
        console.log("Création de la table 'words'...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS words (
                id SERIAL PRIMARY KEY,
                page_number INTEGER,
                surah_number INTEGER,
                surah_name VARCHAR(100),
                ayah_number INTEGER,
                word TEXT,
                tafsir TEXT
            );
        `);

        console.log("Lecture du fichier tafsir.json...");
        const rawData = fs.readFileSync('./JSON/tafsir_alnour.json', 'utf-8');
        const tafsirData: TafsirItem[] = JSON.parse(rawData);

        console.log(`Insertion de ${tafsirData.length} mots dans la base de données...`);
        for (const item of tafsirData) {
            await pool.query(
                `INSERT INTO words (page_number, surah_number, surah_name, ayah_number, word, tafsir) 
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [item.page_number, item.surah_number, item.surah_name, item.ayah_number, item.word, item.tafsir]
            );
        }

        console.log("Importation terminée avec succès !");
    } catch (err) {
        console.error("Erreur lors de l'importation :", err);
    } finally {
        pool.end(); 
    }
}

importData();