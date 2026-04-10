import fs from 'fs';
import path from 'path';
import pool from './db';

interface TafsirItem {
    id: number;
    page_number: number;
    surah_number: number;
    surah_name: string;
    ayah_number: number;
    word: string;
    word_sans_chakl: string;
    tafsir: string;
}

async function importData() {
    try {
        console.log("Suppression de l'ancienne table 'words'...");
        await pool.query(`DROP TABLE IF EXISTS words;`);
        
        console.log("Création de la table 'words' avec la bonne structure...");
        await pool.query(`
            CREATE TABLE words (
                id INTEGER PRIMARY KEY,
                page_number INTEGER,
                surah_number INTEGER,
                surah_name VARCHAR(100),
                ayah_number INTEGER,
                word TEXT,
                word_sans_chakl TEXT,
                tafsir TEXT
            );
        `);

        const NOM_FICHIER = 'tafsir_alimran.json';
        const jsonDir = './JSON/';
        const filePath = path.join(jsonDir, NOM_FICHIER);
        
        if (!fs.existsSync(filePath)) {
            console.error(`Le fichier ${NOM_FICHIER} n'existe pas dans le dossier ${jsonDir}`);
            return;
        }
        
        console.log(`Lecture du fichier ${NOM_FICHIER}...`);
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const tafsirData: TafsirItem[] = JSON.parse(rawData);

        console.log(`Insertion de ${tafsirData.length} mots depuis ${NOM_FICHIER}...`);
        
        for (const item of tafsirData) {
            await pool.query(
                `INSERT INTO words (id, page_number, surah_number, surah_name, ayah_number, word, word_sans_chakl, tafsir) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 ON CONFLICT (id) DO NOTHING`,
                [item.id, item.page_number, item.surah_number, item.surah_name, item.ayah_number, item.word, item.word_sans_chakl, item.tafsir]
            );
        }

        console.log(`Importation terminée avec succès !`);
    } catch (err) {
        console.error("Erreur lors de l'importation :", err);
    } finally {
        pool.end(); 
    }
}

importData();