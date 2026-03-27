const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permet à votre site web de faire des requêtes à cette API
app.use(express.json());

// Charger les données JSON en mémoire
const dataPath = path.join(__dirname, 'tafsir.json');
let tafsirData = [];
try {
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    tafsirData = JSON.parse(rawData);
    console.log("Données Tafsir chargées avec succès.");
} catch (error) {
    console.error("Erreur lors du chargement du fichier JSON:", error);
}

// Route 1 : Récupérer tous les mots (avec pagination pour ne pas surcharger)
app.get('/api/words', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = tafsirData.slice(startIndex, endIndex);
    res.json({
        page: page,
        limit: limit,
        total: tafsirData.length,
        data: results
    });
});

// Route 2 : Chercher un mot spécifique dans le tafsir
app.get('/api/words/search', (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: "Veuillez fournir un terme de recherche avec ?q=..." });
    }

    // Recherche insensible à la casse et simple
    const results = tafsirData.filter(item => 
        item.tafsir && item.tafsir.includes(query)
    );

    res.json({
        total_found: results.length,
        data: results
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`API démarrée sur http://localhost:${PORT}`);
});