# API de Tafsir des Mots du Coran

Ce projet fournit une API RESTful simple pour consulter et rechercher le tafsir (l'explication) des mots du Saint Coran.

## Fonctionnalités

*   Fournit une liste paginée de tous les mots et de leur tafsir.
*   Permet la recherche en texte intégral dans les mots et leur tafsir.
*   Filtre les mots par numéro de sourate.
*   Utilise une base de données PostgreSQL pour un stockage efficace des données.

## Technologies utilisées

*   [Node.js](https://nodejs.org/)
*   [Express.js](https://expressjs.com/fr/)
*   [PostgreSQL](https://www.postgresql.org/)
*   [node-postgres (pg)](https://node-postgres.com/)

## Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :
*   [Node.js](https://nodejs.org/) (version 14 ou supérieure)
*   [npm](https://www.npmjs.com/) (généralement inclus avec Node.js)
*   [PostgreSQL](https://www.postgresql.org/download/)

## Installation

1.  **Clonez le dépôt :**
    ```bash
    git clone https://github.com/votre-utilisateur/TafsirWordsAPI.git
    cd TafsirWordsAPI/quran-tafsir-api
    ```

2.  **Installez les dépendances :**
    ```bash
    npm install
    ```

3.  **Configurez la base de données PostgreSQL :**
    *   Créez une nouvelle base de données. Par exemple, `tafsir_db`.

4.  **Configurez les variables d'environnement :**
    *   Créez un fichier `.env` à la racine du dossier `quran-tafsir-api`.
    *   Copiez le contenu ci-dessous dans votre fichier `.env` et remplacez les valeurs par vos propres informations de configuration de base de données.

    ```env
    # .env.example
    DB_USER=votre_utilisateur_postgres
    DB_HOST=localhost
    DB_DATABASE=tafsir_db
    DB_PASSWORD=votre_mot_de_passe
    DB_PORT=5432
    
    PORT=3000
    ```

## Importation des données

Après avoir configuré votre base de données, vous devez importer les données du fichier `tafsir.json`.

Exécutez le script d'importation :
```bash
node importData.js
```
Ce script créera la table `words` et la remplira avec les données nécessaires.

## Démarrage du serveur

Une fois l'installation et l'importation des données terminées, vous pouvez démarrer le serveur :

```bash
node server.js
```

L'API sera alors accessible à l'adresse `http://localhost:3000` (ou le port que vous avez spécifié dans le fichier `.env`).

## Points d'API (Endpoints)

### `GET /api/words`

Récupère une liste paginée de tous les mots.

*   **Paramètres de requête :**
    *   `page` (optionnel) : Numéro de la page (par défaut : `1`).
    *   `limit` (optionnel) : Nombre d'éléments par page (par défaut : `50`).

*   **Exemple de requête :**
    ```
    http://localhost:3000/api/words?page=2&limit=20
    ```

*   **Exemple de réponse :**
    ```json
    {
        "page": 2,
        "limit": 20,
        "total": 6342,
        "total_pages": 318,
        "data": [
            {
                "id": 21,
                "page_number": 4,
                "surah_number": 2,
                "surah_name": "البقرة",
                "ayah_number": 21,
                "word": "اعْبُدُوا",
                "tafsir": "أطيعوا ربكم وانقادوا له وحده دون سواه"
            },
            ...
        ]
    }
    ```

### `GET /api/words/search`

Recherche un terme dans les mots et leur tafsir.

*   **Paramètres de requête :**
    *   `q` (requis) : Le terme de recherche.

*   **Exemple de requête :**
    ```
    http://localhost:3000/api/words/search?q=ربكم
    ```

*   **Exemple de réponse :**
    ```json
    {
        "total_found": 5,
        "data": [
            {
                "id": 21,
                "page_number": 4,
                "surah_number": 2,
                "surah_name": "البقرة",
                "ayah_number": 21,
                "word": "اعْبُدُوا",
                "tafsir": "أطيعوا ربكم وانقادوا له وحده دون سواه"
            },
            ...
        ]
    }
    ```

### `GET /api/words/surah/:surah_number`

Récupère tous les mots d'une sourate spécifique.

*   **Paramètres d'URL :**
    *   `surah_number` (requis) : Le numéro de la sourate.

*   **Exemple de requête :**
    ```
    http://localhost:3000/api/words/surah/2
    ```

*   **Exemple de réponse :**
    ```json
    {
        "surah_number": 2,
        "total_words": 1500,
        "data": [
            {
                "id": 8,
                "page_number": 2,
                "surah_number": 2,
                "surah_name": "البقرة",
                "ayah_number": 2,
                "word": "ذَٰلِكَ",
                "tafsir": "اسم إشارة، والمشار إليه هو القرآن"
            },
            ...
        ]
    }
    ```
